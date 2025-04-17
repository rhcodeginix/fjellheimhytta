"use client";
import React from "react";
import MainSection from "./homepage/mainSection";
import HouseCabinMould from "./homepage/houseCabinMould";
import HowItWorks from "./homepage/howItWorks";
import OurPartners from "./homepage/ourPartners";
import Footer from "@/components/Ui/footer";

const index = () => {
  return (
    <div className="relative">
      <MainSection />
      <HouseCabinMould />
      <HowItWorks />
      <OurPartners />
      <Footer />
    </div>
  );
};

export default index;
