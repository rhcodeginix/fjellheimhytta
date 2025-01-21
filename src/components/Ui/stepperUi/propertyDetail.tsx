import React from "react";
import Image from "next/image";
import Img_line_bg from "@/public/images/Img_line_bg.png";
import SideSpaceContainer from "@/components/common/sideSpace";
import Ic_check_green_icon from "@/public/images/Ic_check_green_icon.svg";
import Ic_product_detail_avatar from "@/public/images/Ic_product_detail_avatar.svg";
import Ic_product_detail_position from "@/public/images/Ic_product_detail_position.svg";
import Ic_chevron_right from "@/public/images/Ic_chevron_right.svg";
import { useAddress } from "@/context/addressContext";
import Loading from "@/components/Loading";

const PropertyDetail: React.FC<any> = ({
  isShow,
  loadingAdditionalData,
  askData,
  CadastreDataFromApi,
}) => {
  const { getAddress } = useAddress();

  return (
    <>
      <div className="bg-lightPurple py-[20px] relative">
        <Image
          src={Img_line_bg}
          alt="image"
          className="absolute top-0 left-0 w-full h-full"
          style={{ zIndex: 1 }}
        />
        <SideSpaceContainer>
          <div
            className="flex items-center justify-between relative"
            style={{ zIndex: 9 }}
          >
            <div>
              <h2 className="text-black text-[32px] font-semibold mb-2">
                {getAddress?.adressetekst}
              </h2>
              <p className="text-secondary text-xl">
                {getAddress?.postnummer} {getAddress?.poststed}
              </p>
            </div>
            <div className="flex items-center gap-[24px]">
              <div className="flex items-center gap-4">
                <div className="text-secondary text-base">
                  Gnr:{" "}
                  <span className="text-black font-semibold">
                    {getAddress?.gardsnummer}
                  </span>
                </div>
                <div className="text-secondary text-base">
                  Bnr:{" "}
                  <span className="text-black font-semibold">
                    {getAddress?.bruksnummer}
                  </span>
                </div>
                <div className="text-secondary text-base">
                  Snr:{" "}
                  <span className="text-black font-semibold">
                    {getAddress?.bokstav}
                  </span>
                </div>
                <div className="text-secondary text-base">
                  <span className="text-black font-semibold">
                    {getAddress?.representasjonspunkt &&
                      getAddress?.representasjonspunkt.lat.toFixed(2)}
                  </span>{" "}
                  moh.
                </div>
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
      </div>
      <div className="bg-darkGreen py-5 relative">
        <SideSpaceContainer>
          {loadingAdditionalData ? (
            <div className="w-[300px] flex flex-col gap-[16px] items-center h-full">
              <Loading />
            </div>
          ) : (
            <div className="flex gap-[70px] justify-between">
              <div className="w-1/4 flex items-start gap-3">
                <Image src={Ic_check_green_icon} alt="check" />
                <div className="flex flex-col gap-1">
                  <p className="text-white text-sm">Eiendommen er</p>
                  <p className="text-white text-base font-semibold">
                    ferdig regulert til boligformål
                  </p>
                </div>
              </div>
              <div className="w-1/4 flex items-start gap-3">
                <Image src={Ic_check_green_icon} alt="check" />
                <div className="flex flex-col gap-1">
                  <p className="text-white text-sm">Eiendommen har en</p>
                  <p className="text-white text-base font-semibold">
                    Utnyttelsesgrad på{" "}
                    {askData?.bya_calculations?.input?.bya_percentage}%
                  </p>
                </div>
              </div>
              <div className="w-1/4 flex items-start gap-3">
                <Image src={Ic_check_green_icon} alt="check" />
                <div className="flex flex-col gap-1">
                  <p className="text-white text-sm">Ekisterende BYA</p>
                  <p className="text-white text-base font-semibold">
                    Utnyttelsesgrad på{" "}
                    {(() => {
                      const data =
                        CadastreDataFromApi?.buildingsApi?.response?.items?.map(
                          (item: any) => item?.builtUpArea
                        ) ?? [];

                      if (
                        data.length >= 2 &&
                        askData?.bya_calculations?.results?.total_allowed_bya
                      ) {
                        const result =
                          (data[0] + data[1]) /
                          askData?.bya_calculations?.results?.total_allowed_bya;
                        const formattedResult = (result * 100).toFixed(2);

                        return formattedResult;
                      } else {
                        return "0";
                      }
                    })()}
                    %
                  </p>
                  <p className="text-white text-sm">
                    Tilgjengelig BYA{" "}
                    {(() => {
                      const data =
                        CadastreDataFromApi?.buildingsApi?.response?.items?.map(
                          (item: any) => item?.builtUpArea
                        ) ?? [];

                      if (
                        data.length >= 2 &&
                        askData?.bya_calculations?.results?.total_allowed_bya
                      ) {
                        const result =
                          (data[0] + data[1]) /
                          askData?.bya_calculations?.results?.total_allowed_bya;
                        const formattedResult: any = (result * 100).toFixed(2);

                        return (
                          formattedResult -
                          askData?.bya_calculations?.input?.bya_percentage
                        );
                      } else {
                        return "0";
                      }
                    })()}
                    %
                  </p>
                </div>
              </div>
              <div className="w-1/4 flex items-start gap-3">
                <Image src={Ic_check_green_icon} alt="check" />
                <div className="flex flex-col gap-1">
                  <p className="text-white text-sm">Boligen kan ha en</p>
                  <p className="text-white text-base font-semibold">
                    Grunnflate på{" "}
                    {/* {
                      askData?.bya_calculations?.results
                        ?.available_building_area
                    }{" "} */}
                    {
                      CadastreDataFromApi?.buildingsApi?.response?.items[0]
                        .totalFloorSpace
                    }
                    m<sup>2</sup>
                  </p>
                  <p className="text-white text-sm">
                    Tilgjengelig 67,42 m<sup>2</sup>
                  </p>
                </div>
              </div>
            </div>
          )}
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default PropertyDetail;
