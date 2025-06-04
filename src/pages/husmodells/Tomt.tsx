import React, { useEffect, useState } from "react";
import Plots from "@/components/Ui/Husmodell/plot";
import SideSpaceContainer from "@/components/common/sideSpace";
import Link from "next/link";
import Image from "next/image";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";
import SelectPlot from "./selectPlot";

const Tomt: React.FC<any> = ({
  handleNext,
  handlePrevious,
  HouseModelData,
  setLamdaDataFromApi,
  setCadastreDataFromApi,
  setAdditionalData,
}) => {
  const [hasMounted, setHasMounted] = useState(false);

  const [isPlot, setIsPlot] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <div className="relative">
      <div className="bg-lightBlue py-2 md:py-4">
        <SideSpaceContainer>
          <div className="flex items-center gap-1">
            <Link
              href={"/"}
              className="text-primary text-xs md:text-sm font-bold"
            >
              Hjem
            </Link>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <div
              className="text-primary text-xs md:text-sm font-bold cursor-pointer"
              onClick={() => {
                const currIndex = 0;
                localStorage.setItem("currIndex", currIndex.toString());
                handlePrevious();
              }}
            >
              Hyttemodell
            </div>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <div
              className="text-primary text-xs md:text-sm font-bold cursor-pointer"
              onClick={() => {
                handlePrevious();
              }}
            >
              Tilpass
            </div>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <span className="text-secondary2 text-xs md:text-sm">Tomt</span>
          </div>
        </SideSpaceContainer>
      </div>
      {isPlot ? (
        <Plots
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          HouseModelData={HouseModelData}
        />
      ) : (
        <SelectPlot
          HouseModelData={HouseModelData}
          setIsPlot={setIsPlot}
          handleNext={handleNext}
          setLamdaDataFromApi={setLamdaDataFromApi}
          setCadastreDataFromApi={setCadastreDataFromApi}
          setAdditionalData={setAdditionalData}
        />
      )}
    </div>
  );
};

export default Tomt;
