"use client";
import React, { useEffect, useRef, useState } from "react";
import Stepper from "@/components/Ui/stepper";
import Tomt from "./Tomt";
import Husmodell from "./Husmodell";
import Tilvalg from "./Tilvalg";
import Tilbud from "./Tilbud";
import Okonomi from "./Okonomi";
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
import { useAddress } from "@/context/addressContext";
import { useUserLayoutContext } from "@/context/userLayoutContext";

const Regulations = () => {
  const [currIndex, setCurrIndex] = useState(0);
  const [lamdaDataFromApi, setLamdaDataFromApi] = useState<any | null>(null);
  const router = useRouter();
  const { kommunenummer, gardsnummer, bruksnummer, kommunenavn, propertyId } =
    router.query;
  const [loadingAdditionalData, setLoadingAdditionalData] = useState(false);
  const [loadingLamdaData, setLoadingLamdaData] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [additionalData, setAdditionalData] = useState<any | undefined>(null);
  const hasFetchedData = useRef(false);
  const { getAddress } = useAddress();
  const [userUID, setUserUID] = useState(null);
  const [isCall, setIsCall] = useState(false);

  const { loginUser, setLoginUser } = useUserLayoutContext();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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

          setLamdaDataFromApi(data);
          setLoadingLamdaData(false);

          if (cleanAnswer) {
            if (data.message === "Request failed with status code 503") {
              setLoadingAdditionalData(false);
              setLoadingLamdaData(false);
              setShowErrorPopup(true);
            }
            const areaDetails =
              data?.eiendomsInformasjon?.basisInformasjon?.areal_beregnet || "";

            const promt = {
              question: `Hva er tillatt gesims- og mønehøyde, maksimal BYA inkludert parkeringskrav i henhold til parkeringsnormen i ${kommunenavn} kommune, og er det tillatt å bygge en enebolig med flatt tak eller takterrasse i dette området i ${kommunenavn}, sone GB? Tomtestørrelse for denne eiendommen er ${areaDetails}.`,
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
    try {
      if (!userUID) {
        console.error("User ID is not available");
        return;
      }

      const userDocRef = doc(db, "users", userUID);
      const profileSubcollectionRef = collection(userDocRef, "property");

      const existingAddressQuery = query(
        profileSubcollectionRef,
        where(
          "lamdaDataFromApi.propertyId",
          "==",
          property.lamdaDataFromApi.propertyId
        )
      );

      const querySnapshot = await getDocs(existingAddressQuery);

      if (!querySnapshot.empty) {
        return;
      }

      await addDoc(profileSubcollectionRef, property);
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
      getAddress
    ) {
      hasFetchedData.current = true;
      const property = {
        lamdaDataFromApi,
        additionalData,
        getAddress,
      };
      addSearchAddress(property);
    }
  }, [loadingAdditionalData, lamdaDataFromApi, additionalData, getAddress]);

  const handleNext = () => {
    if (currIndex < steps.length - 1) {
      setCurrIndex(currIndex + 1);
    }
  };
  const handlePrevious = () => {
    if (currIndex > 0) {
      setCurrIndex(currIndex - 1);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currIndex]);

  const steps = [
    {
      name: "Tomt",
      component: (
        <Tomt
          handleNext={handleNext}
          lamdaDataFromApi={lamdaDataFromApi}
          loadingAdditionalData={loadingAdditionalData}
          additionalData={additionalData}
          loginUser={loginUser}
          isPopupOpen={isPopupOpen}
          setIsPopupOpen={setIsPopupOpen}
          setIsCall={setIsCall}
          loadingLamdaData={loadingLamdaData}
        />
      ),
    },
    {
      name: "Husmodell",
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
      name: "Økonomi",
      component: (
        <Okonomi handleNext={handleNext} handlePrevious={handlePrevious} />
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
      />
      {showErrorPopup && <ErrorPopup />}
    </>
  );
};

export default Regulations;
