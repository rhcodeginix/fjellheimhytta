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
  const router = useRouter();
  const [lamdaDataFromApi, setLamdaDataFromApi] = useState<any | null>(null);
  const { propertyId } = router.query;
  const [loadingAdditionalData, setLoadingAdditionalData] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [additionalData, setAdditionalData] = useState<any | undefined>(null);
  const [CadastreDataFromApi, setCadastreDataFromApi] = useState<any | null>(
    null
  );
  const [loadingLamdaData, setLoadingLamdaData] = useState(false);
  const { getAddress } = useAddress();
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
  const hasFetchedData = useRef(false);

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
  console.log(loadingLamdaData);

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
      if (querySnapshot.empty) {
        await addDoc(profileSubcollectionRef, property);
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
            (property: any) =>
              property?.lamdaDataFromApi.propertyId === propertyId
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
          setShowErrorPopup(true);
        } finally {
          setLoadingLamdaData(false);
          setLoadingAdditionalData(false);
        }
      };

      fetchProperty();
    }
  }, [propertyId, db, userUID]);

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
        lamdaDataFromApi={lamdaDataFromApi}
        loadingAdditionalData={loadingAdditionalData}
        CadastreDataFromApi={CadastreDataFromApi}
        askData={askData}
      />
      {showErrorPopup && <ErrorPopup />}
    </>
  );
};

export default HusmodellDetail;
