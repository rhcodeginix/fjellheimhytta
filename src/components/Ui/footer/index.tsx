import React from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Ic_logo from "@/public/images/Ic_logo_footer.svg";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <div className="bg-primary">
        <SideSpaceContainer>
          <div className="pt-[40px] md:pt-[52px] lg:pt-[80px] pb-[24px] md:pb-[36px] lg:pb-[48px] flex flex-col desktop:flex-row desktop:items-end gap-6 justify-between">
            <div>
              <Image
                src={Ic_logo}
                alt="logo"
                className="mb-[16px] lg:mb-[36px] w-[90px] lg:w-auto"
                fetchPriority="auto"
              />
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 md:gap-5 lg:gap-6 sm:items-end">
                <span className="text-black font-medium text-sm md:text-base">
                  <span className="font-bold">Iplot AS</span> <br /> 834 632 772
                  <br />
                  Sokkabekkveien 81, 3478
                  <br className="hidden sm:block" />
                  Nærsnes
                </span>
                <div className="flex gap-6 sm:items-end">
                  <span className="text-black font-medium text-sm md:text-base">
                    +47 48 17 97 60
                  </span>
                  <span className="text-black font-medium text-sm md:text-base">
                    hei@mintomt.no
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div className="sm:items-center gap-y-2 gap-x-5 lg:gap-[38px] flex flex-wrap mb-6 md:mb-[12px]">
                <Link
                  href={""}
                  className="text-sm md:text-base text-black font-medium"
                >
                  Hvordan fungerer <span className="font-bold">MinTomt</span>?
                </Link>
                <Link
                  href={""}
                  className="text-sm md:text-base text-black font-medium"
                >
                  Ferdighusprodusenter
                </Link>
                <Link
                  href={""}
                  className="text-sm md:text-base text-black font-medium"
                >
                  Finansiering
                </Link>
                <Link
                  href={""}
                  className="text-sm md:text-base text-black font-medium"
                >
                  Om oss
                </Link>
              </div>
              <p className="text-xs md:text-sm text-black font-medium text-center desktop:text-end">
                © 2025 iPlot AS. All rights reserved.
              </p>
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default Footer;
