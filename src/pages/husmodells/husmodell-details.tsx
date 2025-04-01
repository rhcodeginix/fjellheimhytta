"use client";
import React, { useEffect, useState } from "react";
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
import { doc, getDoc } from "firebase/firestore";

const HusmodellDetail = () => {
  const [currIndex, setCurrIndex] = useState(0);
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
  const router = useRouter();
  const { plotId } = router.query;
  const [lamdaDataFromApi, setLamdaDataFromApi] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [additionalData, setAdditionalData] = useState<any | undefined>(null);
  const [CadastreDataFromApi, setCadastreDataFromApi] = useState<any | null>(
    null
  );
  const [askData, setAskData] = useState<any | null>(null);
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
  useEffect(() => {
    if (additionalData?.answer) {
      try {
        const cleanAnswer = additionalData?.answer;

        setAskData(cleanAnswer);
      } catch (error) {
        console.error("Error parsing additionalData.answer:", error);
        setAskData(null);
      }
    }
  }, [additionalData]);

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
  useEffect(() => {
    if (plotId && userUID) {
      setLoading(true);

      const fetchProperty = async () => {
        const plotDocRef = doc(db, "empty_plot", String(plotId));

        try {
          const plotDocSnap = await getDoc(plotDocRef);
          if (plotDocSnap.exists()) {
            const fetchedProperties: any = {
              propertyId: plotDocSnap.id,
              ...plotDocSnap.data(),
            };

            if (fetchedProperties) {
              setAdditionalData(fetchedProperties?.additionalData);
              setLamdaDataFromApi(fetchedProperties?.lamdaDataFromApi);
              setCadastreDataFromApi(fetchedProperties?.CadastreDataFromApi);
            } else {
              console.error("No property found with the given ID.");
            }
          }
        } catch (error) {
          console.error("Error fetching user's properties:", error);
          setShowErrorPopup(true);
        } finally {
          setLoading(false);
        }
      };

      fetchProperty();
    }
  }, [plotId, db, userUID]);

  const steps = [
    {
      name: "Husmodell",
      component: <Husmodell handleNext={handleNext} />,
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
        <Tomt handleNext={handleNext} handlePrevious={handlePrevious} />
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
        loadingAdditionalData={loading}
        CadastreDataFromApi={CadastreDataFromApi}
        askData={askData}
      />
      {showErrorPopup && <ErrorPopup />}
    </>
  );
};

export default HusmodellDetail;
