import React, { useEffect, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Ic_generelt from "@/public/images/Ic_generelt.svg";
// import Ic_tak from "@/public/images/Ic_tak.svg";
import Ic_check_true from "@/public/images/Ic_check_true.svg";
import Image from "next/image";
import Ic_logo from "@/public/images/Ic_logo.svg";
import Ic_build_housing from "@/public/images/Ic_build_housing.svg";
import Ic_build_garage from "@/public/images/Ic_build_garage.svg";
import Ic_building_platting from "@/public/images/Ic_building_platting.svg";
import Ic_Superstructure from "@/public/images/Ic_Superstructure.svg";
import Button from "@/components/common/button";
import ContactForm from "@/components/Ui/stepperUi/contactForm";
import { useAddress } from "@/context/addressContext";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import GoogleMapComponent from "@/components/Ui/map";

const PlotDetail: React.FC<any> = ({ handleNext, lamdaDataFromApi }) => {
  const items = [
    {
      id: 1,
      imageSrc: Ic_build_housing,
      title: "Bygge bolig",
      price: "2.490.000 NOK",
    },
    {
      id: 2,
      imageSrc: Ic_build_garage,
      title: "Bygge garasje",
      price: "295.899 NOK",
    },
    {
      id: 1,
      imageSrc: Ic_Superstructure,
      title: "Påbygg",
      price: "490.000 NOK",
    },
    {
      id: 1,
      imageSrc: Ic_building_platting,
      title: "Bygge platting",
      price: "295.899 NOK",
    },
  ];

  const router = useRouter();

  const [askData, setAskData] = useState<any | null>(null);
  const { additionalData, loadingAdditionalData } = useAddress();

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
  console.log(lamdaDataFromApi);

  return (
    <div className="relative">
      <SideSpaceContainer className="relative">
        <div className="pt-[26px] pb-[46px] relative flex gap-[40px]">
          <div className="w-[66%]">
            <h2 className="text-black text-2xl font-semibold mb-6">
              Eiendomsinformajon
            </h2>
            <div className="w-full flex gap-8 mb-[60px]">
              <div className="w-2/6 border-t-2 border-b-0 border-l-0 border-r-0 border-purple pt-4">
                <table className="table-auto border-0 w-full text-left property_detail_tbl">
                  <tbody>
                    <tr className="flex gap-[10px] justify-between">
                      <td className="text-left pb-[16px] text-secondary text-sm">
                        Festenummer
                      </td>
                      <td className="text-right pb-[16px] text-black text-sm font-semibold w-full truncate max-w-[120px]">
                        {
                          lamdaDataFromApi?.eiendomsInformasjon
                            ?.basisInformasjon?.festenummer
                        }
                      </td>
                    </tr>
                    <tr className="flex gap-[10px] justify-between">
                      <td className="text-left pb-[16px] text-secondary text-sm">
                        Areal beregnet
                      </td>
                      <td className="text-right pb-[16px] text-black text-sm font-semibold w-full truncate max-w-[120px]">
                        {
                          lamdaDataFromApi?.eiendomsInformasjon
                            ?.basisInformasjon?.areal_beregnet
                        }
                      </td>
                    </tr>
                    <tr className="flex gap-[10px] justify-between">
                      <td className="text-left pb-[16px] text-secondary text-sm">
                        Etableringsdato
                      </td>
                      <td className="text-right pb-[16px] text-black text-sm font-semibold w-full truncate max-w-[120px]">
                        {
                          lamdaDataFromApi?.eiendomsInformasjon
                            ?.basisInformasjon?.etableringsdato
                        }
                      </td>
                    </tr>
                    <tr className="flex gap-[10px] justify-between">
                      <td className="text-left pb-[16px] text-secondary text-sm">
                        Sist oppdatert
                      </td>
                      <td className="text-right pb-[16px] text-black text-sm font-semibold w-full truncate max-w-[120px]">
                        {
                          lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon?.sist_oppdatert.split(
                            "T"
                          )[0]
                        }
                      </td>
                    </tr>
                    <tr className="flex gap-[10px] justify-between">
                      <td className="text-left pb-[16px] text-secondary text-sm">
                        Registrert Grunnerverv
                      </td>
                      <td className="text-right pb-[16px] text-black text-sm font-semibold w-full truncate max-w-[120px]">
                        {
                          lamdaDataFromApi?.eiendomsInformasjon
                            ?.basisInformasjon?.harRegistrertGrunnerverv
                        }
                      </td>
                    </tr>
                    <tr className="flex gap-[10px] justify-between">
                      <td className="text-left pb-[16px] text-secondary text-sm">
                        Registrert JordskifteKrevd
                      </td>
                      <td className="text-right pb-[16px] text-black text-sm font-semibold w-full truncate max-w-[120px]">
                        {
                          lamdaDataFromApi?.eiendomsInformasjon
                            ?.basisInformasjon?.harRegistrertJordskifteKrevd
                        }
                      </td>
                    </tr>
                    <tr className="flex gap-[10px] justify-between">
                      <td className="text-left pb-[16px] text-secondary text-sm">
                        Inngår i annen eiendom
                      </td>
                      <td className="text-right pb-[16px] text-black text-sm font-semibold w-full truncate max-w-[120px]">
                        {
                          lamdaDataFromApi?.eiendomsInformasjon
                            ?.basisInformasjon?.inngarISamlaFastEiendom
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="w-2/6 border-t-2 border-b-0 border-l-0 border-r-0 border-purple pt-4">
                <table className="table-auto border-0 w-full text-left property_detail_tbl">
                  <tbody>
                    <tr className="flex gap-[10px] justify-between">
                      <td className="text-left pb-[16px] text-secondary text-sm">
                        Seksjonert
                      </td>
                      <td className="text-right pb-[16px] text-black text-sm font-semibold w-full truncate max-w-[120px]">
                        {
                          lamdaDataFromApi?.eiendomsInformasjon
                            ?.basisInformasjon?.seksjonert
                        }
                      </td>
                    </tr>
                    <tr className="flex gap-[10px] justify-between">
                      <td className="text-left pb-[16px] text-secondary text-sm">
                        Tinglyst
                      </td>
                      <td className="text-right pb-[16px] text-black text-sm font-semibold w-full truncate max-w-[120px]">
                        {
                          lamdaDataFromApi?.eiendomsInformasjon
                            ?.basisInformasjon?.tinglyst
                        }
                      </td>
                    </tr>
                    <tr className="flex gap-[10px] justify-between">
                      <td className="text-left pb-[16px] text-secondary text-sm">
                        Kulturminner registrert
                      </td>
                      <td className="text-right pb-[16px] text-black text-sm font-semibold w-full truncate max-w-[120px]">
                        {
                          lamdaDataFromApi?.eiendomsInformasjon?.status
                            ?.kulturminner_registrert
                        }
                      </td>
                    </tr>
                    <tr className="flex gap-[10px] justify-between">
                      <td className="text-left pb-[16px] text-secondary text-sm">
                        Aktive festegrunner
                      </td>
                      <td className="text-right pb-[16px] text-black text-sm font-semibold w-full truncate max-w-[120px]">
                        {
                          lamdaDataFromApi?.eiendomsInformasjon?.status
                            ?.aktive_festegrunner
                        }
                      </td>
                    </tr>
                    <tr className="flex gap-[10px] justify-between">
                      <td className="text-left pb-[16px] text-secondary text-sm">
                        Anmerket klage
                      </td>
                      <td className="text-right pb-[16px] text-black text-sm font-semibold w-full truncate max-w-[120px]">
                        {
                          lamdaDataFromApi?.eiendomsInformasjon?.status
                            ?.anmerket_klage
                        }
                      </td>
                    </tr>
                    <tr className="flex gap-[10px] justify-between">
                      <td className="text-left pb-[16px] text-secondary text-sm">
                        Grunnforurensning
                      </td>
                      <td className="text-right pb-[16px] text-black text-sm font-semibold w-full truncate max-w-[120px]">
                        {
                          lamdaDataFromApi?.eiendomsInformasjon?.status
                            ?.grunnforurensning
                        }
                      </td>
                    </tr>
                    <tr className="flex gap-[10px] justify-between">
                      <td className="text-left pb-[16px] text-secondary text-sm">
                        Utgått
                      </td>
                      <td className="text-right pb-[16px] text-black text-sm font-semibold w-full truncate max-w-[120px]">
                        {lamdaDataFromApi?.eiendomsInformasjon?.status?.utgatt}
                      </td>
                    </tr>
                    <tr className="flex gap-[10px] justify-between">
                      <td className="text-left pb-[16px] text-secondary text-sm">
                        Under Sammenslåing
                      </td>
                      <td className="text-right pb-[16px] text-black text-sm font-semibold w-full truncate max-w-[120px]">
                        {
                          lamdaDataFromApi?.eiendomsInformasjon?.status
                            ?.under_sammenslaing
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="w-2/6 border-t-2 border-b-0 border-l-0 border-r-0 border-purple pt-4">
                <table className="table-auto border-0 w-full text-left property_detail_tbl">
                  <tbody>
                    <tr className="flex gap-[10px] justify-between">
                      <td className="text-left pb-[16px] text-secondary text-sm">
                        Kommune
                      </td>
                      <td className="text-right pb-[16px] text-black text-sm font-semibold w-full truncate max-w-[120px]">
                        {
                          lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                            ?.kommune
                        }
                      </td>
                    </tr>
                    <tr className="flex gap-[10px] justify-between">
                      <td className="text-left pb-[16px] text-secondary text-sm">
                        Kommunenr
                      </td>
                      <td className="text-right pb-[16px] text-black text-sm font-semibold w-full truncate max-w-[120px]">
                        {
                          lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                            ?.kommunenr
                        }
                      </td>
                    </tr>
                    <tr className="flex gap-[10px] justify-between">
                      <td className="text-left pb-[16px] text-secondary text-sm">
                        Gårdsnummer
                      </td>
                      <td className="text-right pb-[16px] text-black text-sm font-semibold w-full truncate max-w-[120px]">
                        {
                          lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                            ?.gaardsnummer
                        }
                      </td>
                    </tr>
                    <tr className="flex gap-[10px] justify-between">
                      <td className="text-left pb-[16px] text-secondary text-sm">
                        Bruksnummer
                      </td>
                      <td className="text-right pb-[16px] text-black text-sm font-semibold w-full truncate max-w-[120px]">
                        {
                          lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                            ?.bruksnummer
                        }
                      </td>
                    </tr>
                    <tr className="flex gap-[10px] justify-between">
                      <td className="text-left pb-[16px] text-secondary text-sm">
                        Festenr
                      </td>
                      <td className="text-right pb-[16px] text-black text-sm font-semibold w-full truncate max-w-[120px]">
                        {
                          lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                            ?.festenr
                        }
                      </td>
                    </tr>
                    <tr className="flex gap-[10px] justify-between">
                      <td className="text-left pb-[16px] text-secondary text-sm">
                        Seksjonsnr
                      </td>
                      <td className="text-right pb-[16px] text-black text-sm font-semibold w-full truncate max-w-[120px]">
                        {
                          lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                            ?.seksjonsnr
                        }
                      </td>
                    </tr>
                    <tr className="flex gap-[10px] justify-between">
                      <td className="text-left pb-[16px] text-secondary text-sm">
                        Bruksnavn
                      </td>
                      <td className="text-right pb-[16px] text-black text-sm font-semibold w-full truncate max-w-[120px]">
                        {lamdaDataFromApi?.eiendomsInformasjon?.bruksnavn}
                      </td>
                    </tr>
                    <tr className="flex gap-[10px] justify-between">
                      <td className="text-left pb-[16px] text-secondary text-sm">
                        Oppmåling ikke fullført
                      </td>
                      <td className="text-right pb-[16px] text-black text-sm font-semibold w-full truncate max-w-[120px]">
                        {
                          lamdaDataFromApi?.eiendomsInformasjon?.status
                            ?.oppmaling_ikke_fullfort
                        }
                      </td>
                    </tr>
                    <tr className="flex gap-[10px] justify-between">
                      <td className="text-left pb-[16px] text-secondary text-sm">
                        Mangler grensepunktmerking
                      </td>
                      <td className="text-right pb-[16px] text-black text-sm font-semibold w-full truncate max-w-[120px]">
                        {
                          lamdaDataFromApi?.eiendomsInformasjon?.status
                            ?.mangler_grensepunktmerking
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mb-[34px]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-black text-2xl font-semibold">
                  Reguleringsbestemmelser
                </h2>
                <Image src={Ic_generelt} alt="image" />
              </div>
              <div className="flex flex-col gap-3">
                {loadingAdditionalData ? (
                  <Loader />
                ) : (
                  <>
                    {askData &&
                      askData?.conclusion?.map((a: any, index: number) => (
                        <div
                          className="flex items-start gap-3 text-secondary text-base"
                          key={index}
                        >
                          <Image src={Ic_check_true} alt="image" />
                          <span>{a}</span>
                        </div>
                      ))}
                  </>
                )}
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-black text-2xl font-semibold">
                  Kommuneplan for Asker
                </h2>
                <Image src={Ic_generelt} alt="image" />
              </div>
              <div className="flex flex-col gap-3">
                {loadingAdditionalData ? (
                  <Loader />
                ) : (
                  <>
                    {askData &&
                      askData?.applicable_rules?.map(
                        (a: any, index: number) => (
                          <div
                            className="flex items-start gap-3 text-secondary text-base"
                            key={index}
                          >
                            <Image src={Ic_check_true} alt="image" />
                            <div>
                              {a.rule}{" "}
                              <span className="text-primary font-bold">
                                {a.section}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="w-[34%]">
            <h2 className="text-black text-2xl font-semibold mb-6">
              Kartutsnitt
            </h2>
            <div className="rounded-[12px] overflow-hidden w-full mb-[60px]">
              <GoogleMapComponent
                coordinates={
                  lamdaDataFromApi?.plotDetails?.coordinates
                    ?.convertedCoordinates
                }
              />
            </div>
            <div>
              <div className="flex items-center gap-[36px] mb-6">
                <Image src={Ic_logo} alt="logo" />
                <p className="text-secondary text-sm">
                  Vi hjelper deg med{" "}
                  <span className="text-black font-semibold">
                    reguleringer, søknader
                  </span>{" "}
                  og{" "}
                  <span className="text-black font-semibold">
                    innheter tilbud.
                  </span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                {items.map((item, index) => (
                  <div key={index}>
                    <Image
                      src={item.imageSrc}
                      alt={item.title}
                      className="rounded-full overflow-hidden w-[80px] h-[80px] mb-3"
                    />
                    <h6 className="text-black font-medium text-base mb-2">
                      {item.title}
                    </h6>
                    <div className="gap-4 flex items-center justify-between mb-3">
                      <p className="text-secondary text-sm">Pris fra</p>
                      <h5 className="text-black text-base font-semibold">
                        {item.price}
                      </h5>
                    </div>
                    <Button
                      text="Utforsk boliger"
                      className="border border-lightPurple bg-lightPurple text-blue sm:text-base rounded-[8px] w-full h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative"
                      path=""
                    />
                  </div>
                ))}
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </SideSpaceContainer>
      <div
        className="sticky bottom-0 bg-white py-6"
        style={{
          boxShadow:
            "0px -4px 6px -2px #10182808, 0px -12px 16px -4px #10182814",
        }}
      >
        <SideSpaceContainer>
          <div className="flex justify-end gap-4 items-center">
            <Button
              text="Tilbake"
              className="border border-lightPurple bg-lightPurple text-blue sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[46px] relative desktop:py-[16px]"
              onClick={() => {
                const { plot, ...restQuery } = router.query as any;
                const updatedQuery = new URLSearchParams(restQuery).toString();

                router.push(
                  `${router.pathname}${updatedQuery ? `?${updatedQuery}` : ""}`
                );
              }}
            />
            <Button
              text="Se tilbud"
              className="border border-primary bg-primary text-white sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
              onClick={() => {
                handleNext();
              }}
            />
          </div>
        </SideSpaceContainer>
      </div>
    </div>
  );
};

export default PlotDetail;
