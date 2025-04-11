"use client";
import React from "react";
import MainSection from "./homepage/mainSection";
import HouseCabinMould from "./homepage/houseCabinMould";
import HowItWorks from "./homepage/howItWorks";
import OurPartners from "./homepage/ourPartners";

const index = () => {
  return (
    <div className="relative">
      <MainSection />
      <HouseCabinMould />
      <HowItWorks />
      <OurPartners />
    </div>
  );
};

export default index;
