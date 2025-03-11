"use client";
import React, { useEffect, useRef, useState } from "react";
import Stepper from "@/components/Ui/stepper";
import Tomt from "./Tomt";
import Husmodell from "./Husmodell";
import Tilvalg from "./Tilvalg";
import Tilbud from "./Tilbud";
import Finansiering from "./Finansiering";
import Oppsummering from "./Oppsummering";
import { useRouter } from "next/router";
import ApiUtils from "@/api";
import ErrorPopup from "@/components/Ui/error";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/config/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useUserLayoutContext } from "@/context/userLayoutContext";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

const Regulations = () => {
  const [currIndex, setCurrIndex] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedIndex = localStorage.getItem("currIndex");
      if (savedIndex) {
        setCurrIndex(Number(savedIndex));
      } else {
        setCurrIndex(0);
      }
    }
  }, [currIndex]);
  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("hasReloaded");

    if (!hasReloaded) {
      window.location.reload();
      sessionStorage.setItem("hasReloaded", "true");
    } else {
      sessionStorage.removeItem("hasReloaded");
    }
  }, []);
  const [lamdaDataFromApi, setLamdaDataFromApi] = useState<any | null>(null);
  const [CadastreDataFromApi, setCadastreDataFromApi] = useState<any | null>(
    null
  );
  const router = useRouter();
  const {
    kommunenummer,
    gardsnummer,
    bruksnummer,
    kommunenavn,
    propertyId,
    plotId,
  } = router.query;
  const [loadingAdditionalData, setLoadingAdditionalData] = useState(false);
  const [loadingLamdaData, setLoadingLamdaData] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [additionalData, setAdditionalData] = useState<any | undefined>(null);
  const hasFetchedData = useRef(false);
  const [userUID, setUserUID] = useState(null);
  const [isCall, setIsCall] = useState(false);

  const { loginUser, setLoginUser } = useUserLayoutContext();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const findMatchingData = async (data: Record<string, any[]>) => {
      const matches: any[] = [];

      if (data) {
        const sheetData: any = data["Innlandet"];
        const rowsToProcess = sheetData.slice(1);
        for (const row of rowsToProcess) {
          const lamdaApiData: any = {
            kommunenummer: row["Matrikkel to be imported"],
            gardsnummer: row["__EMPTY"],
            bruksnummer: row["__EMPTY_1"],
          };

          try {
            const response = await ApiUtils.LamdaApi(lamdaApiData);
            const cleanAnswer = response.body
              .replace(/```json|```/g, "")
              .trim();

            const data = JSON.parse(cleanAnswer);

            if (
              data.message === "Request failed with status code 503" ||
              data.message === "Request failed with status code 500" ||
              !data.propertyId
            ) {
              continue;
            }
            const CadastreDataResponse =
              await ApiUtils.fetchCadastreData(lamdaApiData);

            if (cleanAnswer) {
              const areaDetails =
                data?.eiendomsInformasjon?.basisInformasjon?.areal_beregnet ||
                "";
              const regionName =
                CadastreDataResponse?.presentationAddressApi?.response?.item
                  ?.municipality?.municipalityName;

              if (CadastreDataResponse.error || !CadastreDataResponse) {
                continue;
              }
              const promt = {
                question: `Hva er tillatt gesims- og mønehøyde, maksimal BYA inkludert parkeringskrav i henhold til parkeringsnormen i ${kommunenavn || regionName} kommune, og er det tillatt å bygge en enebolig med flatt tak eller takterrasse i dette området i ${kommunenavn || regionName}, sone GB? Tomtestørrelse for denne eiendommen er ${areaDetails}.`,
              };
              try {
                const response = await ApiUtils.askApi(promt);
                const property = {
                  lamdaDataFromApi: data,
                  additionalData: response,
                  CadastreDataFromApi: CadastreDataResponse.apis,
                  pris: row["__EMPTY_3"] || null,
                };
                const propertyId = property?.lamdaDataFromApi?.propertyId;

                if (
                  property?.CadastreDataFromApi?.buildingsApi?.response
                    ?.items &&
                  property?.CadastreDataFromApi?.buildingsApi?.response?.items
                    .length === 0
                ) {
                  const EmptyPlotDb = collection(db, "empty_plot");

                  const existingEmptyPlot = query(
                    EmptyPlotDb,
                    where("lamdaDataFromApi.propertyId", "==", propertyId)
                  );
                  const EmptyPlotShot = await getDocs(existingEmptyPlot);

                  if (EmptyPlotShot.empty) {
                    await addDoc(EmptyPlotDb, property);
                  }
                } else {
                  const buildings =
                    property?.CadastreDataFromApi?.buildingsApi?.response
                      ?.items;

                  const anyBuildingHasStatus = buildings.some(
                    (building: any) => {
                      const hasRequiredStatus =
                        building.buildingStatus?.text ===
                          "IGANGSETTINGSTILLATELSE" ||
                        building.buildingStatus?.text === "RAMMETILLATELSE";
                      return hasRequiredStatus;
                    }
                  );

                  if (anyBuildingHasStatus) {
                    const EmptyPlotDb = collection(db, "empty_plot");
                    const existingEmptyPlot = query(
                      EmptyPlotDb,
                      where("lamdaDataFromApi.propertyId", "==", propertyId)
                    );
                    const EmptyPlotShot = await getDocs(existingEmptyPlot);

                    if (EmptyPlotShot.empty) {
                      await addDoc(EmptyPlotDb, property);
                    }
                  }
                }
              } catch (error: any) {
                console.error(
                  "Error fetching additional data from askApi:",
                  error?.message
                );
              }
            }
          } catch (error: any) {
            console.error("Error fetching additional data:", error?.message);
          }
        }
      }

      if (matches.length > 0) {
        return { region: Object.keys(data)[0], results: matches };
      }
      return null;
    };

    const executeFetchAndFind = async () => {
      const response = await fetch("/Matrikkel.xlsx");
      const arrayBuffer = await response?.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      const allData: Record<string, any[]> = {};

      workbook.SheetNames.forEach((sheetName) => {
        const sheet: any = workbook.Sheets[sheetName];
        allData[sheetName] = XLSX.utils.sheet_to_json(sheet);
      });

      if (allData && kommunenummer && gardsnummer && bruksnummer) {
        findMatchingData(allData);
      }
    };

    executeFetchAndFind();
  }, [kommunenummer, gardsnummer, bruksnummer]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("min_tomt_login") === "true";
    if (isLoggedIn) {
      setLoginUser(true);
      setIsCall(true);
    }
  }, []);
  useEffect(() => {
    if (!loginUser) {
      setIsPopupOpen(true);
    } else {
      setIsPopupOpen(false);
    }
  }, [loginUser]);
  useEffect(() => {
    const fetchData = async () => {
      if (kommunenummer && gardsnummer && bruksnummer) {
        setLoadingLamdaData(true);
        const lamdaApiData: any = {
          kommunenummer,
          gardsnummer,
          bruksnummer,
        };
        try {
          const response = await ApiUtils.LamdaApi(lamdaApiData);
          const cleanAnswer = response.body.replace(/```json|```/g, "").trim();

          const data = JSON.parse(cleanAnswer);

          const CadastreDataResponse =
            await ApiUtils.fetchCadastreData(lamdaApiData);

          setCadastreDataFromApi(CadastreDataResponse.apis);

          setLamdaDataFromApi(data);
          setLoadingLamdaData(false);

          if (cleanAnswer) {
            if (
              data.message === "Request failed with status code 503" ||
              !data.propertyId
            ) {
              setLoadingAdditionalData(false);
              setLoadingLamdaData(false);
              setShowErrorPopup(true);
            }

            const areaDetails =
              data?.eiendomsInformasjon?.basisInformasjon?.areal_beregnet || "";
            const regionName =
              CadastreDataResponse?.presentationAddressApi?.response?.item
                ?.municipality?.municipalityName;
            const promt = {
              question: `Hva er tillatt gesims- og mønehøyde, maksimal BYA inkludert parkeringskrav i henhold til parkeringsnormen i ${kommunenavn || regionName} kommune, og er det tillatt å bygge en enebolig med flatt tak eller takterrasse i dette området i ${kommunenavn || regionName}, sone GB? Tomtestørrelse for denne eiendommen er ${areaDetails}.`,
            };

            setLoadingAdditionalData(true);
            let timeoutId: any;

            try {
              const response = await ApiUtils.askApi(promt);
              clearTimeout(timeoutId);
              setAdditionalData(response);
            } catch (error: any) {
              console.error(
                "Error fetching additional data from askApi:",
                error?.message
              );
              setShowErrorPopup(true);
              // setLamdaDataFromApi(null);
              clearTimeout(timeoutId);
            } finally {
              setLoadingAdditionalData(false);
            }
          }
        } catch (error: any) {
          setShowErrorPopup(true);
          console.error("Error fetching additional data:", error?.message);
        }
      }
    };
    if (isCall) {
      fetchData();
    }
  }, [kommunenummer, gardsnummer, bruksnummer, isCall]);

  useEffect(() => {
    if (propertyId && userUID) {
      setLoadingLamdaData(true);

      const fetchProperty = async () => {
        const propertiesCollectionRef = collection(
          db,
          "users",
          userUID,
          "property"
        );
        try {
          const propertiesSnapshot = await getDocs(propertiesCollectionRef);
          const fetchedProperties: any = propertiesSnapshot.docs.map((doc) => ({
            propertyId: doc.id,
            ...doc.data(),
          }));
          const foundProperty = fetchedProperties.find(
            (property: any) => property.propertyId === propertyId
          );

          if (foundProperty) {
            setAdditionalData(foundProperty?.additionalData);
            setLamdaDataFromApi(foundProperty?.lamdaDataFromApi);
            setCadastreDataFromApi(foundProperty?.CadastreDataFromApi);
          } else {
            console.log("No property found with the given ID.");
          }
        } catch (error) {
          console.error("Error fetching user's properties:", error);
        } finally {
          setLoadingLamdaData(false);
        }
      };

      fetchProperty();
    }
  }, [propertyId, userUID, db]);

  useEffect(() => {
    if (plotId && userUID) {
      setLoadingLamdaData(true);

      const fetchProperty = async () => {
        const propertiesCollectionRef = collection(
          db,
          "users",
          userUID,
          "add_plot"
        );
        try {
          const propertiesSnapshot = await getDocs(propertiesCollectionRef);
          const fetchedProperties: any = propertiesSnapshot.docs.map((doc) => ({
            plotId: doc.id,
            ...doc.data(),
          }));
          const foundProperty = fetchedProperties.find(
            (property: any) => property.plotId === plotId
          );

          if (foundProperty) {
            setAdditionalData(foundProperty?.additionalData);
            setLamdaDataFromApi(foundProperty?.lamdaData);
            setCadastreDataFromApi(foundProperty?.cadastreData);
          } else {
            console.log("No property found with the given ID.");
          }
        } catch (error) {
          console.error("Error fetching user's properties:", error);
        } finally {
          setLoadingLamdaData(false);
        }
      };

      fetchProperty();
    }
  }, [plotId, userUID, db]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        setUserUID(user.uid);
      } else {
        setUserUID(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const addSearchAddress = async (property: any) => {
    const propertyId = property?.lamdaDataFromApi?.propertyId;

    if (!propertyId) {
      console.error("Property ID is missing or undefined.");
      toast.error("Property not found!", {
        position: "top-right",
      });
      return;
    }

    try {
      if (!userUID) {
        console.error("User ID is not available");
        return;
      }

      const userDocRef = doc(db, "users", userUID);
      const propertyDb = collection(userDocRef, "property");
      const existingAddressQuery = query(
        propertyDb,
        where("lamdaDataFromApi.propertyId", "==", propertyId)
      );
      const querySnapshot = await getDocs(existingAddressQuery);

      if (querySnapshot.empty) {
        await addDoc(propertyDb, property);
      }

      if (
        property?.CadastreDataFromApi?.buildingsApi?.response?.items &&
        property?.CadastreDataFromApi?.buildingsApi?.response?.items.length ===
          0
      ) {
        const EmptyPlotDb = collection(db, "empty_plot");

        const existingEmptyPlot = query(
          EmptyPlotDb,
          where("lamdaDataFromApi.propertyId", "==", propertyId)
        );
        const EmptyPlotShot = await getDocs(existingEmptyPlot);

        if (EmptyPlotShot.empty) {
          await addDoc(EmptyPlotDb, property);
        }
      } else {
        const buildings =
          property?.CadastreDataFromApi?.buildingsApi?.response?.items;

        const anyBuildingHasStatus = buildings.some((building: any) => {
          const hasRequiredStatus =
            building.buildingStatus?.text === "IGANGSETTINGSTILLATELSE" ||
            building.buildingStatus?.text === "RAMMETILLATELSE";
          return hasRequiredStatus;
        });

        if (anyBuildingHasStatus) {
          const EmptyPlotDb = collection(db, "empty_plot");
          const existingEmptyPlot = query(
            EmptyPlotDb,
            where("lamdaDataFromApi.propertyId", "==", propertyId)
          );
          const EmptyPlotShot = await getDocs(existingEmptyPlot);

          if (EmptyPlotShot.empty) {
            await addDoc(EmptyPlotDb, property);
          }
        }
      }
    } catch (error) {
      console.error("Error adding address: ", error);
    }
  };

  useEffect(() => {
    if (
      !hasFetchedData.current &&
      !loadingAdditionalData &&
      lamdaDataFromApi &&
      additionalData &&
      CadastreDataFromApi
    ) {
      hasFetchedData.current = true;
      const property = {
        lamdaDataFromApi,
        additionalData,
        CadastreDataFromApi,
        pris: null,
      };
      addSearchAddress(property);
    }
  }, [
    loadingAdditionalData,
    lamdaDataFromApi,
    additionalData,
    CadastreDataFromApi,
  ]);

  const handleNext = () => {
    if (typeof currIndex === "number" && currIndex < steps.length - 1) {
      setCurrIndex(currIndex + 1);
    }
  };
  const handlePrevious = () => {
    if (typeof currIndex === "number" && currIndex > 0) {
      setCurrIndex(currIndex - 1);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currIndex]);

  const [askData, setAskData] = useState<any | null>(null);

  useEffect(() => {
    if (additionalData?.answer) {
      try {
        const cleanAnswer = additionalData.answer;

        setAskData(cleanAnswer);
      } catch (error) {
        console.error("Error parsing additionalData.answer:", error);
        setAskData(null);
      }
    }
  }, [additionalData]);

  const steps = [
    {
      name: "Tomt",
      component: (
        <Tomt
          handleNext={handleNext}
          lamdaDataFromApi={lamdaDataFromApi}
          loadingAdditionalData={loadingAdditionalData}
          loginUser={loginUser}
          isPopupOpen={isPopupOpen}
          setIsPopupOpen={setIsPopupOpen}
          setIsCall={setIsCall}
          loadingLamdaData={loadingLamdaData}
          CadastreDataFromApi={CadastreDataFromApi}
          askData={askData}
        />
      ),
    },
    {
      name: "Hva kan du bygge?",
      component: (
        <Husmodell handleNext={handleNext} handlePrevious={handlePrevious} />
      ),
    },
    {
      name: "Tilpass",
      component: (
        <Tilvalg handleNext={handleNext} handlePrevious={handlePrevious} />
      ),
    },
    {
      name: "Tilbud",
      component: (
        <Tilbud handleNext={handleNext} handlePrevious={handlePrevious} />
      ),
    },
    {
      name: "Finansiering",
      component: (
        <Finansiering handleNext={handleNext} handlePrevious={handlePrevious} />
      ),
    },
    {
      name: "Oppsummering",
      component: <Oppsummering handlePrevious={handlePrevious} />,
    },
  ];

  return (
    <>
      <Stepper
        steps={steps}
        currIndex={currIndex}
        setCurrIndex={setCurrIndex}
        lamdaDataFromApi={lamdaDataFromApi}
        loadingAdditionalData={loadingAdditionalData}
        CadastreDataFromApi={CadastreDataFromApi}
        askData={askData}
      />
      {showErrorPopup && <ErrorPopup />}
    </>
  );
};

export default Regulations;
