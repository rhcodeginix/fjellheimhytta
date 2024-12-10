import React from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Ic_logo from "@/public/images/Ic_logo_footer.svg";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <div className="bg-navyBlue">
        <SideSpaceContainer>
          <div className="pt-[80px] pb-[48px] flex items-end justify-between">
            <div>
              <Image src={Ic_logo} alt="logo" className="mb-[36px]" />
              <div className="flex gap-[24px] items-end">
                <span className="text-white font-medium text-base">
                  39 Bruton Street <br />
                  San Francisco, CA 94130
                </span>
                <span className="text-white font-medium text-base">
                  +47 XX XX XX XX
                </span>
                <span className="text-white font-medium text-base">
                  hei@mintomt.no
                </span>
              </div>
            </div>
            <div>
              <div className="items-center gap-[38px] flex mb-[12px]">
                <Link href={""} className="text-base text-white font-medium">
                  Hvordan fungerer MinTomt?
                </Link>
                <Link href={""} className="text-base text-white font-medium">
                  Priser
                </Link>
                <Link href={""} className="text-base text-white font-medium">
                  Referanser
                </Link>
                <Link href={""} className="text-base text-white font-medium">
                  Kontakt
                </Link>
                <Link href={""} className="text-base text-white font-medium">
                  Logg inn
                </Link>
              </div>
              <p className="text-sm text-white font-medium text-end">
                © 2024 iPlot AS. All rights reserved.
              </p>
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default Footer;
