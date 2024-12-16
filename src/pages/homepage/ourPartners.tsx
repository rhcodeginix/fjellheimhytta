import React from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Image from "next/image";
import Img_pms_SB1_Halling_Valdr_verti_pos from "@/public/images/Img_pms_SB1_Halling_Valdr_verti_pos.png";
import Img_steddy from "@/public/images/Img_steddy.png";
import Img_NexonTechWhite from "@/public/images/Img_NexonTechWhite.png";

const OurPartners = () => {
  return (
    <>
      <div className="py-[80px] overflow-hidden bg-primary">
        <SideSpaceContainer className="relative">
          <div className="flex flex-col gap-8 items-center justify-center">
            <h3 className="text-white font-semibold text-[2rem] leading-[44.8px]">
              Våre samarbeidspartnere
            </h3>
            <div className="flex items-center justify-center w-full gap-[96px]">
              <Image src={Img_pms_SB1_Halling_Valdr_verti_pos} alt="logo" />
              <Image src={Img_steddy} alt="logo" />
              <Image src={Img_NexonTechWhite} alt="logo" />
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default OurPartners;
