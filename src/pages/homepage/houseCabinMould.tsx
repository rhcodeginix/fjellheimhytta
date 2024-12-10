import React from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Ic_BP_logo from "@/public/images/Ic_BP_logo.svg";
import Ic_saltdalshytta_logo from "@/public/images/Ic_saltdalshytta_logo.svg";
import Ic_blink_hus_logo from "@/public/images/Ic_blink_hus_logo.svg";
import Ic_mesterhus_logo from "@/public/images/Ic_mesterhus_logo.svg";
import Ic_systemhus_logo from "@/public/images/Ic_systemhus_logo.svg";
import Ic_nordbohus_logo from "@/public/images/Ic_nordbohus_logo.svg";
import Image from "next/image";

const HouseCabinMould = () => {
  return (
    <>
      <div className="bg-navyBlue py-[80px]">
        <SideSpaceContainer>
          <div className="flex flex-col gap-8 items-center justify-center">
            <h3 className="text-white font-semibold text-[2rem] leading-[44.8px]">
              Velg blant over 100 hus- og hyttemodeller fra
            </h3>
            <div className="flex items-center justify-between w-full">
              <Image src={Ic_BP_logo} alt="logo" />
              <Image src={Ic_saltdalshytta_logo} alt="logo" />
              <Image src={Ic_blink_hus_logo} alt="logo" />
              <Image src={Ic_mesterhus_logo} alt="logo" />
              <Image src={Ic_systemhus_logo} alt="logo" />
              <Image src={Ic_nordbohus_logo} alt="logo" />
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default HouseCabinMould;
