import React from "react";
import Ic_info_circle from "@/public/images/Ic_info_circle.svg";
import Image from "next/image";

const Prisliste: React.FC<{ husmodellData: any }> = ({ husmodellData }) => {
  const Byggekostnader = husmodellData?.Byggekostnader;

  const totalPrisOfByggekostnader = Byggekostnader
    ? Byggekostnader.reduce((acc: any, prod: any) => {
        const numericValue = prod.pris
          ?.replace(/\s/g, "")
          .replace(/\./g, "")
          .replace(",", ".");
        return acc + (numericValue ? parseFloat(numericValue) : 0);
      }, 0)
    : 0;
  const formattedNumberOfByggekostnader =
    totalPrisOfByggekostnader.toLocaleString("nb-NO");

  const Tomtekost = husmodellData?.Tomtekost;

  const totalPrisOfTomtekost = Tomtekost
    ? Tomtekost.reduce((acc: any, prod: any) => {
        const numericValue = prod.pris
          ?.replace(/\s/g, "")
          .replace(/\./g, "")
          .replace(",", ".");
        return acc + (numericValue ? parseFloat(numericValue) : 0);
      }, 0)
    : 0;
  const formattedNumber = totalPrisOfTomtekost.toLocaleString("nb-NO");

  return (
    <>
      <div
        style={{
          boxShadow: "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
        }}
      >
        <div className="flex items-center w-full bg-lightPurple">
          <div className="w-1/2 text-center py-[10px] text-black font-medium text-xl">
            BYGGEKOSTNADER
          </div>
          <div className="w-1/2 text-center py-[10px] text-black font-medium text-xl">
            TOMTEKOSTNADER
          </div>
        </div>
        <div className="flex p-5 gap-[48px] mb-[40px]">
          <div className="w-1/2 flex flex-col gap-4">
            {Byggekostnader &&
              Byggekostnader?.length > 0 &&
              Byggekostnader?.map((item: any, index: number) => {
                return (
                  <div
                    className="flex items-center gap-2 justify-between"
                    key={index}
                  >
                    <div className="flex items-center gap-2">
                      <Image src={Ic_info_circle} alt="icon" />
                      <p className="text-gray text-sm font-medium">
                        {item?.Headline}
                      </p>
                    </div>
                    <h4 className="text-black font-medium text-base">
                      {item?.pris ? `${item.pris} NOK` : "inkl. i tilbud"}
                    </h4>
                  </div>
                );
              })}
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <Image fetchPriority="auto" src={Ic_info_circle} alt="icon" />
                <p className="text-secondary text-base font-bold">
                  Sum byggkostnader
                </p>
              </div>
              <h4 className="text-black font-bold text-base">
                {formattedNumberOfByggekostnader
                  ? formattedNumberOfByggekostnader
                  : 0}{" "}
                NOK
              </h4>
            </div>
          </div>
          <div className="w-1/2 flex flex-col gap-4">
            {Tomtekost &&
              Tomtekost?.length > 0 &&
              Tomtekost?.map((item: any, index: number) => {
                return (
                  <div
                    className="flex items-center gap-2 justify-between"
                    key={index}
                  >
                    <div className="flex items-center gap-2">
                      <Image src={Ic_info_circle} alt="icon" />
                      <p className="text-gray text-sm font-medium">
                        {item?.Headline}
                      </p>
                    </div>
                    <h4 className="text-black font-medium text-base">
                      {item?.pris ? `${item.pris} NOK` : "inkl. i tilbud"}
                    </h4>
                  </div>
                );
              })}
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <Image fetchPriority="auto" src={Ic_info_circle} alt="icon" />
                <p className="text-secondary text-base font-bold">
                  Sum tomtekostnader
                </p>
              </div>
              <h4 className="text-black font-bold text-base">
                {formattedNumber ? formattedNumber : 0} NOK
              </h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Prisliste;
