import React from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import HomePageSearchTab from "@/components/Ui/homePageSearchTab";

const MainSection = () => {
  return (
    <>
      <div
        className="py-[44px] md:py-[52px] desktop:py-[60px] overflow-hidden relative"
        style={{ zIndex: 999 }}
      >
        <SideSpaceContainer className="relative">
          <div className="mb-[40px] flex flex-col justify-center items-center">
            <h1 className="text-purple text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] desktop:text-[52px] big:text-[60px] font-semibold leading-tight text-center mb-3 md:mb-4 desktop:mb-5">
              Bygg ditt drømmehus <br />
              <span className="text-black">trygt og enkelt</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl big:text-2xl text-secondary text-center">
              Få umiddelbar tomteanalyse og oppdag hva du kan bygge.
            </p>
          </div>
        </SideSpaceContainer>
        <HomePageSearchTab />
      </div>
    </>
  );
};

export default MainSection;
