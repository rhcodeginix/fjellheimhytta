"use client";
import React, { useEffect, useRef, useState } from "react";
import Stepper from "@/components/Ui/stepper";
import Tomt from "./Tomt";
import Husmodell from "./Husmodell";
import Tilbud from "./Tilbud";
import Finansiering from "./Finansiering";
// import Oppsummering from "./Oppsummering";
import { useRouter } from "next/router";
import ApiUtils from "@/api";
import ErrorPopup from "@/components/Ui/error";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/config/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useUserLayoutContext } from "@/context/userLayoutContext";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import Tilpass from "./Tilpass";
import HouseModelSingleProperty from "@/components/Ui/regulation/houseModelSingleProperty";
import Verdivurdering from "./Verdivurdering";

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
    emptyPlot,
    husmodellId,
  } = router.query;
  const [loadingAdditionalData, setLoadingAdditionalData] = useState(false);
  const [loadingLamdaData, setLoadingLamdaData] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [additionalData, setAdditionalData] = useState<any | undefined>(null);
  const hasFetchedData = useRef(false);
  const [userUID, setUserUID] = useState(null);
  const [isCall, setIsCall] = useState(false);
  const [loading, setLoading] = useState(false);

  const { loginUser, setLoginUser } = useUserLayoutContext();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const findMatchingData = async (data: Record<string, any[]>) => {
      const matches: any[] = [];

      if (data) {
        const sheetData: any = data["Vestland"];
        const rowsToProcess = sheetData.slice(1);
        for (const row of rowsToProcess) {
          const lamdaApiData: any = {
            kommunenummer: row["Matrikkel to be imported"],
            gardsnummer: row["__EMPTY"],
            bruksnummer: row["__EMPTY_1"],
          };
          let data;
          try {
            const response = await ApiUtils.LamdaApi(lamdaApiData);
            const cleanAnswer = response.body
              .replace(/```json|```/g, "")
              .trim();

            data = JSON.parse(cleanAnswer);

            if (
              data.message === "Request failed with status code 503" ||
              data.message === "Request failed with status code 500" ||
              !data.propertyId
            ) {
              // const EmptyPlotErrorDb = collection(db, "empty_plot_error");
              // const finalData = {
              //   lamdaApiData: JSON.stringify(lamdaApiData),
              //   api1: false,
              //   api2: false,
              //   api3: false,
              // };
              // // const existingEmptyPlotError = query(EmptyPlotErrorDb);
              // // const EmptyPlotErrorShot = await getDocs(existingEmptyPlotError);

              // // if (EmptyPlotErrorShot.empty) {
              // await addDoc(EmptyPlotErrorDb, finalData);
              // // }
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
                  const EmptyPlotDb = collection(db, "cabin_plot");

                  const existingEmptyPlot = query(
                    EmptyPlotDb,
                    where("id", "==", propertyId)
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
                    const EmptyPlotDb = collection(db, "cabin_plot");
                    const existingEmptyPlot = query(
                      EmptyPlotDb,
                      where("id", "==", propertyId)
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
            // const property = {
            //   lamdaDataFromApi: data,
            //   additionalData: null,
            //   CadastreDataFromApi: null,
            //   pris: row["__EMPTY_3"] || null,
            // };

            // const propertyId = property?.lamdaDataFromApi?.propertyId;

            // const EmptyPlotDb = collection(db, "cabin_plot");
            // const existingEmptyPlot = query(
            //   EmptyPlotDb,
            //   where("lamdaDataFromApi.propertyId", "==", propertyId)
            // );
            // const EmptyPlotShot = await getDocs(existingEmptyPlot);

            // if (EmptyPlotShot.empty) {
            //   await addDoc(EmptyPlotDb, property);
            // }

            // const EmptyPlotErrorDb = collection(db, "empty_plot_error");
            // const existingEmptyPlotError = query(
            //   EmptyPlotErrorDb,
            //   where("lamdaDataFromApi.propertyId", "==", propertyId)
            // );
            // const EmptyPlotErrorShot = await getDocs(existingEmptyPlotError);
            // const finalData = {
            //   lamdaApiData,
            //   api1: true,
            //   api2: false,
            //   api3: false,
            // };

            // if (EmptyPlotErrorShot.empty) {
            //   await addDoc(EmptyPlotErrorDb, finalData);
            // }
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
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUser({
              id: userDocSnapshot.id,
              ...userData,
            });
          } else {
            console.error("No such document in Firestore!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [isCall]);

  useEffect(() => {
    setLoadingLamdaData(true);
    const fetchData = async () => {
      if (!(kommunenummer && gardsnummer && bruksnummer)) return;

      const lamdaApiData = { kommunenummer, gardsnummer, bruksnummer };

      try {
        const response = await ApiUtils.LamdaApi(lamdaApiData);
        const cleanAnswer = response.body.replace(/```json|```/g, "").trim();
        const data = JSON.parse(cleanAnswer);
        const CadastreDataResponse =
          await ApiUtils.fetchCadastreData(lamdaApiData);

        setLamdaDataFromApi(data);
        setCadastreDataFromApi(CadastreDataResponse.apis);
        setLoadingLamdaData(false);

        if (
          !cleanAnswer ||
          data.message === "Request failed with status code 503" ||
          !data.propertyId
        ) {
          setLoadingAdditionalData(false);
          setShowErrorPopup(true);
          return;
        }

        const areaDetails =
          data?.eiendomsInformasjon?.basisInformasjon?.areal_beregnet || "";
        const regionName =
          CadastreDataResponse?.presentationAddressApi?.response?.item
            ?.municipality?.municipalityName;
        const prompt = {
          question: `Hva er tillatt gesims- og mønehøyde, maksimal BYA inkludert parkeringskrav i henhold til parkeringsnormen i ${kommunenavn || regionName} kommune, og er det tillatt å bygge en enebolig med flatt tak eller takterrasse i dette området i ${kommunenavn || regionName}, sone GB? Tomtestørrelse for denne eiendommen er ${areaDetails}.`,
        };

        setLoadingAdditionalData(true);
        try {
          const additionalResponse = await ApiUtils.askApi(prompt);
          setAdditionalData(additionalResponse);

          const property = {
            lamdaDataFromApi: data,
            additionalData: additionalResponse,
            CadastreDataFromApi: CadastreDataResponse.apis,
            pris: null,
          };
          const propertyId = data.propertyId;
          const queryParams = new URLSearchParams(window.location.search);
          queryParams.set("plotId", propertyId);
          queryParams.delete("empty");

          const isEmptyPlot =
            !CadastreDataResponse?.apis?.buildingsApi?.response?.items?.length;
          const collectionName = isEmptyPlot ? "cabin_plot" : "plot_building";
          queryParams.set("empty", isEmptyPlot ? "true" : "false");

          const collectionRef = collection(db, collectionName);
          const existingQuery = query(
            collectionRef,
            isEmptyPlot
              ? where("id", "==", propertyId)
              : where("lamdaDataFromApi.propertyId", "==", propertyId)
          );
          const querySnapshot = await getDocs(existingQuery);

          let docId, plotData;
          if (!querySnapshot.empty) {
            const docSnap: any = querySnapshot.docs[0];
            docId = docSnap.id;
            plotData = docSnap.data();
          } else {
            const docRef = await addDoc(collectionRef, property);
            docId = docRef.id;
            plotData =
              (await getDoc(doc(db, collectionName, docId))).data() || null;
          }

          const updatedPlotData = {
            ...plotData,
            view_count: (plotData?.view_count || 0) + 1,
          };
          await setDoc(doc(db, collectionName, docId), updatedPlotData, {
            merge: true,
          });

          const viewerDocRef = doc(
            db,
            `${collectionName}/${docId}/viewer`,
            user.uid
          );
          const viewerDocSnap = await getDoc(viewerDocRef);
          let viewerViewCount = 1;

          if (viewerDocSnap.exists()) {
            const viewerData = viewerDocSnap.data();
            viewerViewCount = (viewerData?.view_count || 0) + 1;
          }

          await setDoc(
            viewerDocRef,
            {
              userId: user.uid,
              name: user.name || "N/A",
              last_updated_date: new Date().toISOString(),
              view_count: viewerViewCount,
            },
            { merge: true }
          );

          router.replace({
            pathname: router.pathname,
            query: Object.fromEntries(queryParams),
          });
        } catch (error) {
          console.error("Error fetching additional data from askApi:", error);
          setShowErrorPopup(true);
        } finally {
          setLoadingAdditionalData(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setShowErrorPopup(true);
      }
    };

    if (isCall && user) fetchData();
  }, [kommunenummer, gardsnummer, bruksnummer, isCall, user]);

  useEffect(() => {
    if (propertyId && userUID) {
      setLoadingLamdaData(true);

      const fetchProperty = async () => {
        let propertiesCollectionRef: any;
        if (emptyPlot) {
          propertiesCollectionRef = doc(db, "cabin_plot", String(propertyId));
        } else {
          propertiesCollectionRef = collection(
            db,
            "users",
            userUID,
            "property"
          );
        }
        try {
          let foundProperty: any;
          if (emptyPlot) {
            const plotDocSnap: any = await getDoc(propertiesCollectionRef);
            if (plotDocSnap.exists()) {
              const fetchedProperties = {
                propertyId: plotDocSnap.id,
                ...plotDocSnap.data(),
              };
              foundProperty = fetchedProperties;
            } else {
              console.error(
                "No property found in empty_plot with the given ID."
              );
              return;
            }
          } else {
            const propertiesSnapshot = await getDocs(propertiesCollectionRef);
            const fetchedProperties = propertiesSnapshot.docs.map(
              (doc: any) => ({
                propertyId: doc.id,
                ...doc.data(),
              })
            );
            foundProperty = fetchedProperties.find(
              (property: any) => property.propertyId === propertyId
            );
          }

          const property = {
            lamdaDataFromApi: foundProperty?.lamdaDataFromApi,
            additionalData: foundProperty?.additionalData,
            CadastreDataFromApi: foundProperty?.CadastreDataFromApi,
            pris: null,
          };
          const queryParams = new URLSearchParams(window.location.search);
          queryParams.set("plotId", String(propertyId));
          queryParams.delete("empty");

          const isEmptyPlot =
            !foundProperty?.CadastreDataFromApi?.apis?.buildingsApi?.response
              ?.items?.length;
          const collectionName = isEmptyPlot ? "cabin_plot" : "plot_building";
          queryParams.set("empty", isEmptyPlot ? "true" : "false");

          const collectionRef = collection(db, collectionName);
          const existingQuery = query(
            collectionRef,
            isEmptyPlot
              ? where("id", "==", propertyId)
              : where("lamdaDataFromApi.propertyId", "==", propertyId)
          );
          const querySnapshot = await getDocs(existingQuery);

          let docId, plotData;
          if (!querySnapshot.empty) {
            const docSnap: any = querySnapshot.docs[0];
            docId = docSnap.id;
            plotData = docSnap.data();
          } else {
            const docRef = await addDoc(collectionRef, property);
            docId = docRef.id;
            plotData =
              (await getDoc(doc(db, collectionName, docId))).data() || null;
          }

          const updatedPlotData = {
            ...plotData,
            view_count: (plotData?.view_count || 0) + 1,
          };
          await setDoc(doc(db, collectionName, docId), updatedPlotData, {
            merge: true,
          });

          const viewerDocRef = doc(
            db,
            `${collectionName}/${docId}/viewer`,
            user.uid
          );
          const viewerDocSnap = await getDoc(viewerDocRef);
          let viewerViewCount = 1;

          if (viewerDocSnap.exists()) {
            const viewerData = viewerDocSnap.data();
            viewerViewCount = (viewerData?.view_count || 0) + 1;
          }

          await setDoc(
            viewerDocRef,
            {
              userId: user.uid,
              name: user.name || "N/A",
              last_updated_date: new Date().toISOString(),
              view_count: viewerViewCount,
            },
            { merge: true }
          );

          router.replace({
            pathname: router.pathname,
            query: Object.fromEntries(queryParams),
          });

          if (foundProperty) {
            setAdditionalData(foundProperty?.additionalData);
            setLamdaDataFromApi(foundProperty?.lamdaDataFromApi);
            setCadastreDataFromApi(foundProperty?.CadastreDataFromApi);
          } else {
            console.error("No property found with the given ID.");
          }
        } catch (error) {
          console.error("Error fetching user's properties:", error);
        } finally {
          setLoadingLamdaData(false);
        }
      };
      if (user) {
        fetchProperty();
      }
    }
  }, [propertyId, userUID, db, user]);

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
            console.error("No property found with the given ID.");
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
        const EmptyPlotDb = collection(db, "cabin_plot");

        const existingEmptyPlot = query(
          EmptyPlotDb,
          where("id", "==", propertyId)
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
          const EmptyPlotDb = collection(db, "cabin_plot");
          const existingEmptyPlot = query(
            EmptyPlotDb,
            where("id", "==", propertyId)
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
  const [HouseModelData, setHouseModelData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const husmodellDocRef = doc(db, "house_model", String(husmodellId));
        const husmodellDocSnap = await getDoc(husmodellDocRef);

        if (husmodellDocSnap.exists()) {
          setHouseModelData(husmodellDocSnap.data());
        } else {
          console.error("No document found for plot or husmodell ID.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (husmodellId) {
      fetchData();
    }
  }, [husmodellId, isCall]);
  const husmodellData = HouseModelData?.Husdetaljer;
  const [supplierData, setSupplierData] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const supplierDocRef = doc(
          db,
          "suppliers",
          husmodellData?.Leverandører
        );
        const docSnap: any = await getDoc(supplierDocRef);

        if (docSnap.exists()) {
          setSupplierData(docSnap.data());
        } else {
          console.error(
            "No document found for ID:",
            husmodellData?.Leverandører
          );
        }
      } catch (error) {
        console.error("Error fetching supplier data:", error);
      }
    };
    if (husmodellData?.Leverandører) {
      getData();
    }
  }, [husmodellData?.Leverandører]);

  const BBOXData =
    CadastreDataFromApi?.cadastreApi?.response?.item?.geojson?.bbox;

  const [BoxData, setBoxData] = useState<any>(null);
  const [results, setResult] = useState<any>(null);
  const [resultsLoading, setResultLoading] = useState(true);
  const [Documents, setDocuments] = useState<any>(null);
  const [PlanDocuments, setPlanDocuments] = useState<any>(null);
  const [exemptions, setExemptions] = useState<any>(null);
  const [KommunePlan, setKommunePlan] = useState<any>(null);
  const [documentLoading, setDocumentLoading] = useState(true);
  const [KommuneLoading, setKommuneLoading] = useState(true);

  useEffect(() => {
    const fetchPlotData = async () => {
      try {
        const response = await fetch(
          "https://d8t0z35n2l.execute-api.eu-north-1.amazonaws.com/prod/bya",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: `https://wms.geonorge.no/skwms1/wms.reguleringsplaner?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&QUERY_LAYERS=Planomrade_02,Arealformal_02&LAYERS=Planomrade_02,Arealformal_02&INFO_FORMAT=text/html&CRS=EPSG:25833&BBOX=${BBOXData[0]},${BBOXData[1]},${BBOXData[2]},${BBOXData[3]}&WIDTH=800&HEIGHT=600&I=400&J=300`,
              plot_size_m2:
                lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                  ?.areal_beregnet ?? 0,
            }),
          }
        );

        const json = await response.json();
        setBoxData(json);

        if (json?.bya_percentage) {
          setResultLoading(false);
        }

        if (json && json?.plan_link) {
          const successfulResponses: any = [];

          const makeApiCall = async (apiCall: any) => {
            try {
              const response = await fetch(apiCall.url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(apiCall.body),
              });

              if (!response.ok) {
                throw new Error(
                  `${apiCall.name} request failed with status ${response.status}`
                );
              }

              const data = await response.json();

              switch (apiCall.name) {
                case "kommuneplanens":
                  setKommunePlan(data);
                  setKommuneLoading(false);
                  break;

                case "resolve":
                  setDocuments(data);
                  await handleResolveData(data);
                  break;

                case "other-documents":
                  setPlanDocuments(data?.planning_treatments);
                  setExemptions(data?.exemptions);
                  break;
              }

              successfulResponses.push({
                name: apiCall.name,
                success: true,
                data: data,
                error: null,
              });

              return {
                name: apiCall.name,
                success: true,
                data: data,
                error: null,
              };
            } catch (error: any) {
              console.error(`${apiCall.name} API failed:`, error);
              return;
            }
          };

          const handleResolveData = async (data: any) => {
            if (!data) return;

            if (data?.inputs?.internal_plan_id) {
              const uniqueId = String(data?.inputs?.internal_plan_id);

              if (!uniqueId) {
                console.warn("No uniqueId found, skipping Firestore setDoc");
                return;
              }

              const plansDocRef = doc(db, "mintomt_plans", uniqueId);
              const existingDoc = await getDoc(plansDocRef);

              if (existingDoc.exists()) {
                setResult(existingDoc?.data()?.rule);
                return;
              }
            }

            if (data?.rule_book) {
              try {
                const responseData = await fetch(
                  "https://iplotnor-norwaypropertyagent.hf.space/extract_json",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      pdf_url: data?.rule_book?.link,
                      plot_size_m2: `${
                        lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                          ?.areal_beregnet ?? 0
                      }`,
                    }),
                  }
                );

                if (!responseData.ok) {
                  throw new Error("PDF extraction request failed");
                }

                const responseResult = await responseData.json();
                setResult(responseResult?.data);

                if (responseResult?.data && data?.inputs?.internal_plan_id) {
                  const uniqueId = String(data?.inputs?.internal_plan_id);
                  const plansDocRef = doc(db, "mintomt_plans", uniqueId);

                  const formatDate = (date: any) =>
                    date
                      .toLocaleString("sv-SE", { timeZone: "UTC" })
                      .replace(",", "");

                  const existingDoc = await getDoc(plansDocRef);

                  if (!existingDoc.exists()) {
                    await setDoc(plansDocRef, {
                      id: uniqueId,
                      updatedAt: formatDate(new Date()),
                      createdAt: formatDate(new Date()),
                      documents: { ...data },
                      rule: { ...responseResult?.data },
                    });
                  }
                }
              } catch (pdfError) {
                console.error("PDF processing failed:", pdfError);
              }
            }
          };

          const apiCalls = [
            {
              name: "kommuneplanens",
              url: "https://iplotnor-areaplanner.hf.space/kommuneplanens",
              body: {
                coordinates_url: json?.plan_link,
                knr: `${kommunenummer}`,
                gnr: `${gardsnummer}`,
                bnr: `${bruksnummer}`,
                api_token: `${process.env.NEXT_PUBLIC_DOCUMENT_TOKEN}`,
                debug_mode: true,
              },
            },
            {
              name: "resolve",
              url: "https://iplotnor-areaplanner.hf.space/resolve",
              body: {
                step1_url: json?.plan_link,
                api_token: `${process.env.NEXT_PUBLIC_DOCUMENT_TOKEN}`,
              },
            },
            {
              name: "other-documents",
              url: "https://iplotnor-areaplanner.hf.space/other-documents",
              body: {
                step1_url: json?.plan_link,
                api_token: `${process.env.NEXT_PUBLIC_DOCUMENT_TOKEN}`,
              },
            },
          ];

          apiCalls.map((apiCall) => makeApiCall(apiCall));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setResultLoading(false);
      }
    };

    if (CadastreDataFromApi) {
      fetchPlotData();
    }
  }, [CadastreDataFromApi]);

  useEffect(() => {
    if (PlanDocuments) {
      setDocumentLoading(false);
    }
  }, [PlanDocuments]);

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
          resultsLoading={resultsLoading}
          BoxData={BoxData}
          results={results}
          Documents={Documents}
          PlanDocuments={PlanDocuments}
          exemptions={exemptions}
          documentLoading={documentLoading}
          KommunePlan={KommunePlan}
          KommuneLoading={KommuneLoading}
        />
      ),
    },
    {
      name: "Hva kan du bygge?",
      component: (
        <Husmodell
          handleNext={handleNext}
          lamdaDataFromApi={lamdaDataFromApi}
          CadastreDataFromApi={CadastreDataFromApi}
          handlePrevious={handlePrevious}
          askData={askData}
          resultsLoading={resultsLoading}
          BoxData={BoxData}
          results={results}
        />
      ),
    },
    {
      name: "Detaljer",
      component: (
        <HouseModelSingleProperty
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          loadingAdditionalData={loadingAdditionalData}
          loginUser={loginUser}
          loadingLamdaData={loadingLamdaData}
          supplierData={supplierData}
          CadastreDataFromApi={CadastreDataFromApi}
          HouseModelData={HouseModelData}
          askData={askData}
          lamdaDataFromApi={lamdaDataFromApi}
          user={user}
          resultsLoading={resultsLoading}
          BoxData={BoxData}
          results={results}
          Documents={Documents}
          PlanDocuments={PlanDocuments}
          exemptions={exemptions}
          documentLoading={documentLoading}
          KommunePlan={KommunePlan}
          KommuneLoading={KommuneLoading}
        />
      ),
    },
    {
      name: "Tilpass",
      component: (
        <Tilpass
          handleNext={handleNext}
          lamdaDataFromApi={lamdaDataFromApi}
          loadingLamdaData={loading}
          HouseModelData={HouseModelData}
          handlePrevious={handlePrevious}
          supplierData={supplierData}
          CadastreDataFromApi={CadastreDataFromApi}
        />
      ),
    },
    {
      name: "Tilbud",
      component: (
        <Tilbud
          handleNext={handleNext}
          lamdaDataFromApi={lamdaDataFromApi}
          loadingLamdaData={loading}
          CadastreDataFromApi={CadastreDataFromApi}
          askData={askData}
          HouseModelData={HouseModelData}
          user={user}
          supplierData={supplierData}
          handlePrevious={handlePrevious}
          resultsLoading={resultsLoading}
          BoxData={BoxData}
          results={results}
        />
      ),
    },
    {
      name: "Finansiering",
      component: (
        <Finansiering
          handleNext={handleNext}
          lamdaDataFromApi={lamdaDataFromApi}
          loadingLamdaData={loading}
          CadastreDataFromApi={CadastreDataFromApi}
          askData={askData}
          HouseModelData={HouseModelData}
          handlePrevious={handlePrevious}
          supplierData={supplierData}
          resultsLoading={resultsLoading}
          BoxData={BoxData}
          results={results}
        />
      ),
    },
    {
      name: "Verdivurdering",
      component: (
        <Verdivurdering
          handleNext={handleNext}
          lamdaDataFromApi={lamdaDataFromApi}
          loading={loading}
          CadastreDataFromApi={CadastreDataFromApi}
          askData={askData}
          HouseModelData={HouseModelData}
          handlePrevious={handlePrevious}
          supplierData={supplierData}
          resultsLoading={resultsLoading}
          BoxData={BoxData}
          results={results}
        />
      ),
    },
    // {
    //   name: "Oppsummering",
    //   component: (
    //     <Oppsummering
    //       handleNext={handleNext}
    //       lamdaDataFromApi={lamdaDataFromApi}
    //       loadingLamdaData={loading}
    //       CadastreDataFromApi={CadastreDataFromApi}
    //       askData={askData}
    //       HouseModelData={HouseModelData}
    //       handlePrevious={handlePrevious}
    //       supplierData={supplierData}
    //     />
    //   ),
    // },
  ];

  return (
    <>
      <Stepper
        steps={steps}
        currIndex={currIndex}
        setCurrIndex={setCurrIndex}
        Style="true"
      />
      {showErrorPopup && <ErrorPopup />}
    </>
  );
};

export default Regulations;
