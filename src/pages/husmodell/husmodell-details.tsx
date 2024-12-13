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
import { useAddress } from "@/context/addressContext";

const HusmodellDetail = () => {
  const [currIndex, setCurrIndex] = useState(0);
  const router = useRouter();

  const [lamdaDataFromApi, setLamdaDataFromApi] = useState<any | null>(null);
  const { LamdaData } = useAddress();

  useEffect(() => {
    if (LamdaData?.body) {
      try {
        const cleanAnswer = LamdaData.body.replace(/```json|```/g, "").trim();

        const data = JSON.parse(cleanAnswer);

        setLamdaDataFromApi(data);
      } catch (error) {
        console.error("Error parsing additionalData.answer:", error);
        setLamdaDataFromApi(null);
      }
    }
  }, [LamdaData]);

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
        <Tomt handleNext={handleNext} lamdaDataFromApi={lamdaDataFromApi} />
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
    </>
  );
};

export default HusmodellDetail;
