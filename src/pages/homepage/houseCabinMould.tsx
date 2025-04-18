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
      <div className="relative" style={{ zIndex: 9 }}>
        <SideSpaceContainer>
          <div className="flex flex-col gap-5 md:gap-8 items-center justify-center">
            <h3 className="text-darkBlack font-semibold text-lg md:text-[24px] desktop:leading-[120%]">
              Velg blant over 100 hus- og hyttemodeller fra
            </h3>
            <div className="flex items-center justify-between w-full overFlowScrollHidden overflow-x-auto gap-4">
              <Image
                fetchPriority="auto"
                src={Ic_BP_logo}
                alt="logo"
                className="w-[110px] md:w-[130px] lg:w-auto"
              />
              <Image
                fetchPriority="auto"
                src={Ic_saltdalshytta_logo}
                alt="logo"
                className="w-[110px] md:w-[130px] lg:w-auto"
              />
              <Image
                fetchPriority="auto"
                src={Ic_blink_hus_logo}
                alt="logo"
                className="w-[110px] md:w-[130px] lg:w-auto"
              />
              <Image
                fetchPriority="auto"
                src={Ic_mesterhus_logo}
                alt="logo"
                className="w-[110px] md:w-[130px] lg:w-auto"
              />
              <Image
                fetchPriority="auto"
                src={Ic_systemhus_logo}
                alt="logo"
                className="w-[110px] md:w-[130px] lg:w-auto"
              />
              <Image
                fetchPriority="auto"
                src={Ic_nordbohus_logo}
                alt="logo"
                className="w-[110px] md:w-[130px] lg:w-auto"
              />
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default HouseCabinMould;
