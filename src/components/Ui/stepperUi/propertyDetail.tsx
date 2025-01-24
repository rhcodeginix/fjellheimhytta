import React from "react";
import Image from "next/image";
import Img_line_bg from "@/public/images/Img_line_bg.png";
import SideSpaceContainer from "@/components/common/sideSpace";
import Ic_check_green_icon from "@/public/images/Ic_check_green_icon.svg";
import { useAddress } from "@/context/addressContext";
import Loading from "@/components/Loading";

const PropertyDetail: React.FC<any> = ({
  loadingAdditionalData,
  askData,
  CadastreDataFromApi,
  lamdaDataFromApi,
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
                        // data.length >= 1 &&
                        lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                          ?.areal_beregnet
                      ) {
                        const totalData = data
                          ? data.reduce(
                              (acc: number, currentValue: number) =>
                                acc + currentValue,
                              0
                            )
                          : 0;

                        const result =
                          (totalData /
                            lamdaDataFromApi?.eiendomsInformasjon
                              ?.basisInformasjon?.areal_beregnet) *
                          100;
                        const formattedResult = result.toFixed(2);

                        return `${formattedResult}  %`;
                      } else {
                        return "0";
                      }
                    })()}
                  </p>
                  <p className="text-white text-sm">
                    Tilgjengelig BYA{" "}
                    {(() => {
                      const data =
                        CadastreDataFromApi?.buildingsApi?.response?.items?.map(
                          (item: any) => item?.builtUpArea
                        ) ?? [];

                      if (
                        // data.length >= 1 &&
                        askData?.bya_calculations?.results?.total_allowed_bya
                      ) {
                        const totalData = data
                          ? data.reduce(
                              (acc: number, currentValue: number) =>
                                acc + currentValue,
                              0
                            )
                          : 0;

                        const result =
                          (totalData /
                            lamdaDataFromApi?.eiendomsInformasjon
                              ?.basisInformasjon?.areal_beregnet) *
                          100;
                        const formattedResult: any = result.toFixed(2);

                        return `${(
                          askData?.bya_calculations?.input?.bya_percentage -
                          formattedResult
                        ).toFixed(2)} %`;
                      } else {
                        return "0";
                      }
                    })()}
                  </p>
                </div>
              </div>
              <div className="w-1/4 flex items-start gap-3">
                <Image src={Ic_check_green_icon} alt="check" />
                <div className="flex flex-col gap-1">
                  <p className="text-white text-sm">Boligen kan ha en</p>
                  <p className="text-white text-base font-semibold">
                    Grunnflate på{" "}
                    {
                      askData?.bya_calculations?.results
                        ?.available_building_area
                    }{" "}
                    m<sup>2</sup>
                  </p>
                  <p className="text-white text-sm">
                    Tilgjengelig{" "}
                    {(() => {
                      const data =
                        CadastreDataFromApi?.buildingsApi?.response?.items?.map(
                          (item: any) => item?.builtUpArea
                        ) ?? [];

                      if (
                        // data.length >= 1 &&
                        askData?.bya_calculations?.results?.total_allowed_bya
                      ) {
                        const totalData = data
                          ? data.reduce(
                              (acc: number, currentValue: number) =>
                                acc + currentValue,
                              0
                            )
                          : 0;

                        return (
                          <>
                            {(
                              askData?.bya_calculations?.results
                                ?.total_allowed_bya - totalData
                            ).toFixed(2)}
                            m<sup>2</sup>
                          </>
                        );
                      } else {
                        return "0";
                        // return (
                        //   <>
                        //     {
                        //       askData?.bya_calculations?.results
                        //         ?.available_building_area
                        //     }{" "}
                        //     m<sup>2</sup>
                        //   </>
                        // );
                      }
                    })()}
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
