import React, { useEffect, useState } from "react";
import Image from "next/image";
import Img_product_detail1 from "@/public/images/Img_product_detail1.png";
import Img_product_detail2 from "@/public/images/Img_product_detail2.png";
import SideSpaceContainer from "@/components/common/sideSpace";
import Ic_Check_icon from "@/public/images/Ic_Check_icon.svg";
import Ic_percentage_icon from "@/public/images/Ic_percentage_icon.svg";
import Ic_square_mtr_icon from "@/public/images/Ic_square_mtr_icon.svg";
import Ic_product_detail_avatar from "@/public/images/Ic_product_detail_avatar.svg";
import Ic_product_detail_position from "@/public/images/Ic_product_detail_position.svg";
import Ic_chevron_right from "@/public/images/Ic_chevron_right.svg";
import { useAddress } from "@/context/addressContext";

const PropertyDetail: React.FC<any> = ({
  isShow,
  additionalData,
  loadingAdditionalData,
}) => {
  const { getAddress } = useAddress();

  const [askData, setAskData] = useState<any | null>(null);

  useEffect(() => {
    if (additionalData?.answer) {
      try {
        const cleanAnswer = additionalData.answer;

        setAskData(cleanAnswer);
      } catch (error) {
        console.error("Error parsing additionalData.answer:", error);
        setAskData(null);
      }
    }
  }, [additionalData]);

  
  return (
    <>
      <div className="bg-lightPurple py-[20px] relative">
        <Image
          src={Img_product_detail1}
          alt="image"
          className="absolute top-0 left-0"
          style={{ zIndex: 1 }}
        />
        <SideSpaceContainer>
          <div
            className="flex items-center justify-between relative"
            style={{ zIndex: 9 }}
          >
            <div>
              <h2 className="text-black text-[32px] font-semibold mb-2">
                {!loadingAdditionalData && getAddress?.adressetekst}
              </h2>
              <p className="text-secondary fs-xl mb-4">
                {!loadingAdditionalData && getAddress?.postnummer}{" "}
                {!loadingAdditionalData && getAddress?.poststed}
              </p>
              <div className="flex items-center gap-4">
                <div className="text-secondary text-base">
                  Gnr:{" "}
                  <span className="text-black font-semibold">
                    {!loadingAdditionalData && getAddress?.gardsnummer}
                  </span>
                </div>
                <div className="text-secondary text-base">
                  Bnr:{" "}
                  <span className="text-black font-semibold">
                    {!loadingAdditionalData && getAddress?.bruksnummer}
                  </span>
                </div>
                <div className="text-secondary text-base">
                  Snr:{" "}
                  <span className="text-black font-semibold">
                    {!loadingAdditionalData && getAddress?.bokstav}
                  </span>
                </div>
                <div className="text-secondary text-base">
                  <span className="text-black font-semibold">
                    {!loadingAdditionalData &&
                      getAddress?.representasjonspunkt &&
                      !loadingAdditionalData &&
                      getAddress?.representasjonspunkt.lat.toFixed(2)}
                  </span>{" "}
                  moh.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-[24px]">
              <div className="flex flex-col gap-[16px]">
                <div className="flex items-center gap-[16px]">
                  <Image src={Ic_Check_icon} alt="icon" />
                  <p className="text-secondary text-sm font-semibold">
                    Denne eiendommen er{" "}
                    <span className="text-black">
                      ferdig regulert til boligformål
                    </span>
                  </p>
                </div>
                {!loadingAdditionalData && askData && (
                  <div className="flex items-center gap-[16px]">
                    <Image src={Ic_percentage_icon} alt="icon" />
                    <p className="text-secondary text-sm font-semibold">
                      Eiendommen har en{" "}
                      <span className="text-black">
                        utnyttelsesgrad på{" "}
                        {askData?.bya_calculations?.input?.bya_percentage}%
                      </span>
                    </p>
                  </div>
                )}
                {!loadingAdditionalData && askData && (
                  <div className="flex items-center gap-[16px]">
                    <Image src={Ic_square_mtr_icon} alt="icon" />
                    <p className="text-secondary text-sm font-semibold">
                      Boligen kan ha en{" "}
                      <span className="text-black">
                        grunnflate på{" "}
                        {askData?.bya_calculations?.input?.plot_size} m2
                      </span>
                    </p>
                  </div>
                )}
              </div>
              {isShow && (
                <div
                  className="bg-white rounded-[8px] py-[18px] px-[22px]"
                  style={{
                    boxShadow:
                      "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
                  }}
                >
                  <p className="text-black text-sm mb-3">Din boligkonsulent</p>
                  <div className="flex items-center gap-[8px]">
                    <Image
                      src={Ic_product_detail_avatar}
                      alt="image"
                      className="h-[48px] w-[48px] rounded-full"
                    />
                    <div>
                      <h4 className="text-base text-black font-semibold">
                        Simen Wolmer
                      </h4>
                      <Image src={Ic_product_detail_position} alt="image" />
                    </div>
                    <Image src={Ic_chevron_right} alt="icon" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </SideSpaceContainer>
        <Image
          src={Img_product_detail2}
          alt="image"
          className="absolute top-0 right-0"
          style={{ zIndex: 1 }}
        />
      </div>
    </>
  );
};

export default PropertyDetail;
