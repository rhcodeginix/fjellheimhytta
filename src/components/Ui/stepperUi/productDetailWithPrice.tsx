import React from "react";
import Image from "next/image";
import Img_product1 from "@/public/images/Img_product1.png";
import Img_product_logo1 from "@/public/images/Img_product_logo1.png";
import Ic_productDetailWithPrice from "@/public/images/Ic_productDetailWithPrice.svg";

const PropertyDetailWithPrice: React.FC<any> = () => {
  return (
    <>
      <div
        className="bg-white py-[20px] relative p-6 flex items-center gap-6 rounded-[8px]"
        style={{ boxShadow: "0px 4px 16px 0px #0000001A" }}
      >
        <div className="relative w-[42%]">
          <Image
            src={Img_product1}
            alt="image"
            className="w-full h-[262px] object-cover rounded-[12px] overflow-hidden"
          />
          <Image
            src={Img_product_logo1}
            alt="image"
            className="absolute top-[12px] left-[12px] bg-[#FFFFFFB2] py-2 px-3 flex items-center justify-center rounded-[32px] w-auto"
          />
        </div>
        <div className="w-[58%]">
          <h5 className="text-black text-lg font-medium mb-2">
            Herskapelige Almgaard er en drømmebolig for familien
          </h5>
          <div className="flex items-center gap-3">
            <div className="text-secondary text-base">
              <span className="text-black text-base font-semibold">233</span> m2
            </div>
            <div className="h-[12px] w-[1px] border-l border-gray"></div>
            <div className="text-secondary text-base">
              <span className="text-black text-base font-semibold">5</span>{" "}
              soverom
            </div>
            <div className="h-[12px] w-[1px] border-l border-gray"></div>
            <div className="text-secondary text-base">
              <span className="text-black text-base font-semibold">3</span> bad
            </div>
          </div>
          <div className="flex items-center gap-9 my-5">
            <div className="flex flex-col gap-1 w-max">
              <p className="text-secondary text-sm whitespace-nowrap">
                ESTIMERT BYGGESTART
              </p>
              <h5 className="text-black text-xl font-semibold whitespace-nowrap">
                03.01.2025
              </h5>
            </div>
            <div className="w-full">
              <Image
                src={Ic_productDetailWithPrice}
                alt="image"
                className="w-full"
              />
            </div>
            <div className="flex flex-col gap-1 w-max">
              <p className="text-secondary text-sm whitespace-nowrap">
                ESTIMERT INNFLYTTING
              </p>
              <h5 className="text-black text-xl font-semibold text-right whitespace-nowrap">
                23.11.2025
              </h5>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-lightPurple p-3 rounded-b-[12px]">
              <p className="text-base text-secondary text-center">Tilbudpris</p>
              <h3 className="text-black font-semibold text-[24px] text-center">
                8.300.000 NOK
              </h3>
              <div className="text-secondary text-base text-center">
                Tilbudet er gyldig til{" "}
                <span className="font-semibold text-black">01.12.2024</span>
              </div>
            </div>
            <div className="bg-lightPurple p-3 rounded-b-[12px]">
              <p className="text-base text-secondary text-center">
                Totalpris med tomt
              </p>
              <h3 className="text-black font-semibold text-[24px] text-center">
                14.108.690 NOK
              </h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetailWithPrice;
