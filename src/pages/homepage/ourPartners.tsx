import React from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Image from "next/image";
import Img_pms_SB1_Halling_Valdr_verti_pos from "@/public/images/Img_pms_SB1_Halling_Valdr_verti_pos.png";
import Img_NexonTechWhite from "@/public/images/Img_NexonTechWhite.png";
import Img_our_partners from "@/public/images/Img_our_partners.png";

const OurPartners = () => {
  return (
    <>
      <div
        className="py-[44px] md:py-[58px] desktop:py-[80px] overflow-hidden bg-purple"
        style={{
          backgroundImage: `url(${Img_our_partners.src})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left center",
        }}
      >
        <SideSpaceContainer className="relative">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 sm:items-center justify-between">
            <h3 className="text-white font-semibold text-lg md:text-[24px] lg:text-[28px] desktop:text-[2rem] desktop:leading-[44.8px] leading-[44.8px]">
              Our partners
            </h3>
            <div className="flex items-center gap-5 md:gap-12 desktop:gap-[80px] overflow-x-auto overFlowScrollHidden">
              <Image
                fetchPriority="auto"
                src={Img_pms_SB1_Halling_Valdr_verti_pos}
                alt="logo"
                className="w-[140px] sm:w-[160px]"
              />
              <Image
                fetchPriority="auto"
                src={Img_NexonTechWhite}
                alt="logo"
                className="w-[140px] sm:w-[160px]"
              />
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default OurPartners;
