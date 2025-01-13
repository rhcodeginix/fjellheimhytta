"use client";
import React from "react";
import MainSection from "./homepage/mainSection";
import HouseCabinMould from "./homepage/houseCabinMould";
import HowItWorks from "./homepage/howItWorks";
import Review from "./homepage/review";
import Advantages from "./homepage/advantages";
import Analysis from "./homepage/analysis";
import LatestFromMedia from "./homepage/latestFromMedia";
import Chatbot from "@/components/Ui/chatbot";
import OurPartners from "./homepage/ourPartners";

const index = () => {
  return (
    <div className="relative">
      <Chatbot />
      <MainSection />
      <HouseCabinMould />
      <HowItWorks />
      <OurPartners />
      <Review />
      <Advantages />
      <Analysis />
      <LatestFromMedia />
    </div>
  );
};

export default index;
