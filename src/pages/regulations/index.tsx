"use client";
import React, { useEffect, useState } from "react";
import Stepper from "@/components/Ui/stepper";
import Tomt from "./Tomt";
import Husmodell from "./Husmodell";
import Tilvalg from "./Tilvalg";
import Tilbud from "./Tilbud";
import Okonomi from "./Okonomi";
import Finansiering from "./Finansiering";
import Oppsummering from "./Oppsummering";
import { useAddress } from "@/context/addressContext";

const Regulations = () => {
  const [currIndex, setCurrIndex] = useState(0);
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
        <Tomt handleNext={handleNext} lamdaDataFromApi={lamdaDataFromApi} />
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
    </>
  );
};

export default Regulations;
