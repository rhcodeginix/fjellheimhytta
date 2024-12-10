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

const HusmodellDetail = () => {
  const [currIndex, setCurrIndex] = useState(0);
  const router = useRouter();

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
      component: <Tomt handleNext={handleNext} />,
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
