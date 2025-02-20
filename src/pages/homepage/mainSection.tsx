import React from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Image from "next/image";
import Img_header_underline from "@/public/images/Img_header_underline.png";
import Img_Main_banner_img from "@/public/images/Img_Main_banner_img.png";
import Img_main_bg from "@/public/images/Img_main_bg.png";
import HomePageSearchDiv from "@/components/Ui/homePageSearch";

const MainSection = () => {
  return (
    <>
      <div
        className="pt-[44px] md:pt-[58px] desktop:pt-[80px] pb-[48px] md:pb-[80px] desktop:pb-[120px] overflow-hidden relative"
        style={{ zIndex: 999 }}
      >
        <SideSpaceContainer className="relative">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end relative gap-3">
            <h1 className="text-black text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] desktop:text-[52px] big:text-[60px] font-semibold leading-tight w-full lg:w-[75%] xBig:w-[53%] relative">
              Få umiddelbar tomteanalyse og oppdag hva du kan bygge.
              <Image
                src={Img_header_underline}
                alt="image"
                className="absolute top-[54%] left-[43%] xBig:left-[38%] hidden md:block"
                style={{
                  transform: "translateY(-50%)",
                }}
              />
            </h1>
            <p className="text-sm md:text-base lg:text-lg big:text-xl text-secondary w-full lg:w-[23%]">
              Få umiddelbar tomteanalyse og oppdag hva du kan bygge.
            </p>
          </div>
          <HomePageSearchDiv />
          <div className="w-full relative" style={{ zIndex: 99 }}>
            <Image src={Img_Main_banner_img} alt="image" className="w-full" />
          </div>
          <div
            className="absolute bottom-[10%] left-0 w-full"
            style={{ zIndex: 9 }}
          >
            <Image src={Img_main_bg} alt="image" className="w-full " />
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default MainSection;
