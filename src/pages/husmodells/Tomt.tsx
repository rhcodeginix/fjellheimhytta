import React, { useEffect, useState } from "react";
import Plots from "@/components/Ui/Husmodell/plot";
import SideSpaceContainer from "@/components/common/sideSpace";
import Link from "next/link";
import Image from "next/image";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";

const Tomt: React.FC<any> = ({
  handleNext,
  handlePrevious,
  HouseModelData,
}) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <div className="relative">
      <div className="bg-lightPurple2 py-4">
        <SideSpaceContainer>
          <div className="flex items-center gap-1">
            <Link href={"/"} className="text-[#7839EE] text-sm font-medium">
              Hjem
            </Link>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <div
              className="text-[#7839EE] text-sm font-medium"
              onClick={() => {
                handlePrevious();
                const currIndex = 0;
                localStorage.setItem("currIndex", currIndex.toString());
                window.location.reload();
              }}
            >
              Husmodell
            </div>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <Link
              href={"/"}
              className="text-[#7839EE] text-sm font-medium"
              onClick={() => {
                handlePrevious();
              }}
            >
              Tilpass
            </Link>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <span className="text-secondary2 text-sm">Tomt</span>
          </div>
        </SideSpaceContainer>
      </div>
      <Plots
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        HouseModelData={HouseModelData}
      />
    </div>
  );
};

export default Tomt;
