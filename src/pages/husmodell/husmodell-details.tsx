"use client";
import React, { useEffect, useRef, useState } from "react";
import Stepper from "@/components/Ui/stepper";
import Husmodell from "./Husmodell";
import Tilvalg from "./Tilvalg";
import { useRouter } from "next/router";
import Tomt from "./Tomt";
import Tilbud from "./Tilbud";
import Okonomi from "./Okonomi";
import Finansiering from "./Finansiering";
import Oppsummering from "./Oppsummering";
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

const HusmodellDetail = () => {
  const [currIndex, setCurrIndex] = useState(0);
  const [lamdaDataFromApi, setLamdaDataFromApi] = useState<any | null>(null);

  const router = useRouter();
  const { kommunenummer, gardsnummer, bruksnummer, kommunenavn } = router.query;
  const [loadingAdditionalData, setLoadingAdditionalData] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [additionalData, setAdditionalData] = useState<any | undefined>(null);
  const { getAddress } = useAddress();

  const hasFetchedData = useRef(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoadingAdditionalData(true);

      if (kommunenummer && gardsnummer && bruksnummer) {
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

          if (cleanAnswer) {
            if (data.message === "Request failed with status code 503") {
              setLoadingAdditionalData(false);
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

    fetchData();
  }, [kommunenummer, gardsnummer, bruksnummer]);

  const [userUID, setUserUID] = useState(null);

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
      router.push(router.asPath);
    }
  };
  const handlePrevious = () => {
    if (currIndex > 0) {
      router.push(router.asPath);
      setCurrIndex(currIndex - 1);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currIndex]);

  const steps = [
    {
      name: "Husmodell",
      component: (
        <Husmodell handleNext={handleNext} handlePrevious={handlePrevious} />
      ),
    },
    {
      name: "Tilvalg",
      component: (
        <Tilvalg handleNext={handleNext} handlePrevious={handlePrevious} />
      ),
    },
    {
      name: "Tomt",
      component: (
        <Tomt
          handleNext={handleNext}
          lamdaDataFromApi={lamdaDataFromApi}
          loadingAdditionalData={loadingAdditionalData}
          additionalData={additionalData}
        />
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

export default HusmodellDetail;
