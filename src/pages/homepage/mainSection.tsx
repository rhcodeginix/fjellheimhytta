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
      <div className="pt-[80px] pb-[120px] overflow-hidden">
        <SideSpaceContainer className="relative">
          <div className="flex justify-between items-end relative">
            <h1 className="text-black text-[60px] font-semibold leading-tight w-[50%] xBig:w-[45%] relative">
              Bygg ditt drømmehus trygt og enkelt
              <Image
                src={Img_header_underline}
                alt="image"
                className="absolute top-[54%] left-[43%] xBig:left-[38%]"
                style={{
                  transform: "translateY(-50%)",
                }}
              />
            </h1>
            <p className="text-xl text-secondary w-[35%] xBig:w-[30%]">
              Få umiddelbar tomteanalyse og oppdag hvilke boliger du kan bygge
              på din tomt.
            </p>
          </div>
          <HomePageSearchDiv />
          <div className="w-full relative" style={{ zIndex: 999 }}>
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
