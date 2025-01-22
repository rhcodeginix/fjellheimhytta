import React, { useEffect, useRef, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Ic_generelt from "@/public/images/Ic_generelt.svg";
import Ic_info_circle from "@/public/images/Ic_info_circle.svg";
import Ic_check_true from "@/public/images/Ic_check_true.svg";
import Image from "next/image";
import Ic_check from "@/public/images/Ic_check.svg";
import Ic_logo from "@/public/images/Ic_logo.svg";
import Ic_x_close from "@/public/images/Ic_x_close.svg";
import Loader from "@/components/Loader";
import GoogleMapComponent from "@/components/Ui/map";
import { useAddress } from "@/context/addressContext";
import Loading from "@/components/Loading";
import GoogleMapNearByComponent from "@/components/Ui/map/nearbyBuiildingMap";

const RegulationPdf: React.FC<{
  additionalData: any;
  loadingAdditionalData: any;
  lamdaDataFromApi: any;
  loadingLamdaData: any;
  CadastreDataFromApi: any;
}> = ({
  lamdaDataFromApi,
  loadingAdditionalData,
  additionalData,
  loadingLamdaData,
  CadastreDataFromApi,
}) => {
  const { getAddress } = useAddress();

  const [dropdownState, setDropdownState] = useState({
    Tomteopplysninger: false,
    KommunaleData: false,
    Eiendomsstatus: false,
    Parkeringsinformasjon: false,
    YtterligereEiendomsforhold: false,
    SpesielleRegistreringer: false,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownState((prevState: any) =>
          Object.keys(prevState).reduce(
            (acc: any, key) => {
              acc[key] = false;
              return acc;
            },
            {} as { [key: string]: boolean }
          )
        );
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (key: any) => {
    setDropdownState((prevState: any) => {
      const newState = Object.keys(prevState).reduce(
        (acc: any, currKey: any) => {
          acc[currKey] = currKey === key ? !prevState[key] : false;
          return acc;
        },
        {}
      );
      return newState;
    });
  };

  function formatDateToDDMMYYYY(dateString: any) {
    const dateObject: any = new Date(dateString);

    if (isNaN(dateObject)) {
      return "Invalid Date";
    }

    const day = String(dateObject.getDate()).padStart(2, "0");
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const year = dateObject.getFullYear();

    return `${day}.${month}.${year}`;
  }

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

  if (loadingLamdaData) {
    <Loader />;
  }
  return (
    <div className="relative">
      <div>
        <div className="border-b border-[#EFF1F5] py-6 mb-8">
          <SideSpaceContainer>
            <Image
              src={Ic_logo}
              alt="logo"
              className="w-[90px] lg:w-auto"
              id="logo"
            />
          </SideSpaceContainer>
        </div>
        <SideSpaceContainer className="relative">
          <h2 className="text-black text-2xl font-semibold mb-6">
            Eiendomsinformasjon
          </h2>

          <div className="grid grid-cols-3 gap-6 mb-[60px]">
            <div className="bg-gray3 rounded-[8px] p-5 flex flex-col gap-4">
              <h2 className="text-black text-lg font-semibold flex items-center gap-2">
                Tomteopplysninger
                <div className="relative">
                  <Image
                    src={Ic_info_circle}
                    alt="info"
                    className="cursor-pointer"
                    onClick={() => toggleDropdown("Tomteopplysninger")}
                  />
                  {dropdownState.Tomteopplysninger && (
                    <div
                      className="flex flex-col gap-2 absolute text-grayText font-normal text-sm p-3 rounded-[8px] bg-white w-72 dropdown-arrow"
                      style={{
                        boxShadow:
                          "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
                        zIndex: 999999999,
                        transform: "translateX(-50%)",
                        left: "50%",
                      }}
                      ref={dropdownRef}
                    >
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the indo.
                    </div>
                  )}
                </div>
              </h2>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Areal beregnet</p>
                  <h5 className="text-base text-black font-medium">
                    {lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                      ?.areal_beregnet ? (
                      <>
                        {
                          lamdaDataFromApi?.eiendomsInformasjon
                            ?.basisInformasjon?.areal_beregnet
                        }{" "}
                        m<sup>2</sup>
                      </>
                    ) : (
                      "-"
                    )}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Etableringsårs dato</p>
                  <h5 className="text-base text-black font-medium">
                    {lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                      ?.etableringsdato
                      ? formatDateToDDMMYYYY(
                          lamdaDataFromApi?.eiendomsInformasjon
                            ?.basisInformasjon?.etableringsdato
                        )
                      : "-"}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Sist oppdatert</p>
                  <h5 className="text-base text-black font-medium">
                    {lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                      ?.sist_oppdatert
                      ? formatDateToDDMMYYYY(
                          lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon?.sist_oppdatert.split(
                            "T"
                          )[0]
                        )
                      : "-"}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Totalt utalt BYA</p>
                  <h5 className="text-base text-black font-medium">
                    {askData?.bya_calculations?.results?.total_allowed_bya ? (
                      <>
                        {askData?.bya_calculations?.results?.total_allowed_bya}{" "}
                        m<sup>2</sup>
                      </>
                    ) : (
                      "-"
                    )}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Er registrert land</p>
                  <h5 className="text-base text-black font-medium">
                    {CadastreDataFromApi?.cadastreApi?.response?.item
                      .isRegisteredLand === "Ja" || true ? (
                      <Image src={Ic_check} alt="check" />
                    ) : (
                      <Image src={Ic_x_close} alt="check" />
                    )}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Festenummer</p>
                  <h5 className="text-base text-black font-medium">
                    {lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                      ?.festenummer
                      ? lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                          ?.festenummer
                      : "-"}
                  </h5>
                </div>
              </div>
            </div>
            <div className="bg-gray3 rounded-[8px] p-5 flex flex-col gap-4">
              <h2 className="text-black text-lg font-semibold flex items-center gap-2">
                Kommunale data
                <div className="relative">
                  <Image
                    src={Ic_info_circle}
                    alt="info"
                    className="cursor-pointer"
                    onClick={() => toggleDropdown("KommunaleData")}
                  />
                  {dropdownState.KommunaleData && (
                    <div
                      className="flex flex-col gap-2 absolute text-grayText font-normal text-sm p-3 rounded-[8px] bg-white w-72 dropdown-arrow"
                      style={{
                        boxShadow:
                          "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
                        zIndex: 999999999,
                        transform: "translateX(-50%)",
                        left: "50%",
                      }}
                      ref={dropdownRef}
                    >
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the indo.
                    </div>
                  )}
                </div>
              </h2>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Kommune</p>
                  <h5 className="text-base text-black font-medium">
                    {/* {lamdaDataFromApi?.eiendomsInformasjon?.kommune_info?.kommune} */}
                    {getAddress?.kommunenavn}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Kommunenummer</p>
                  <h5 className="text-base text-black font-medium">
                    {lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                      ?.kommunenr
                      ? lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                          ?.kommunenr
                      : "-"}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Gårdsnummer</p>
                  <h5 className="text-base text-black font-medium">
                    {lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                      ?.gaardsnummer
                      ? lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                          ?.gaardsnummer
                      : "-"}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Bruksnummer</p>
                  <h5 className="text-base text-black font-medium">
                    {lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                      ?.bruksnummer
                      ? lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                          ?.bruksnummer
                      : "-"}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Seksjonsnummer</p>
                  <h5 className="text-base text-black font-medium">
                    {lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                      ?.seksjonsnr
                      ? lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                          ?.seksjonsnr
                      : "-"}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Fylke</p>
                  <h5 className="text-base text-black font-medium">
                    {CadastreDataFromApi?.cadastreApi?.response?.item
                      .municipality?.regionName
                      ? CadastreDataFromApi?.cadastreApi?.response?.item
                          .municipality?.regionName
                      : "-"}
                  </h5>
                </div>
              </div>
            </div>
            <div className="bg-gray3 rounded-[8px] p-5 flex flex-col gap-4">
              <h2 className="text-black text-lg font-semibold flex items-center gap-2">
                Eiendomsstatus
                <div className="relative">
                  <Image
                    src={Ic_info_circle}
                    alt="info"
                    className="cursor-pointer"
                    onClick={() => toggleDropdown("Eiendomsstatus")}
                  />
                  {dropdownState.Eiendomsstatus && (
                    <div
                      className="flex flex-col gap-2 absolute text-grayText font-normal text-sm p-3 rounded-[8px] bg-white w-72 dropdown-arrow"
                      style={{
                        boxShadow:
                          "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
                        zIndex: 999999999,
                        transform: "translateX(-50%)",
                        left: "50%",
                      }}
                      ref={dropdownRef}
                    >
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the indo.
                    </div>
                  )}
                </div>
              </h2>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Kan selges</p>
                  <h5 className="text-base text-black font-medium">
                    {CadastreDataFromApi?.cadastreApi?.response?.item
                      .canBeSold === true || "Ja" ? (
                      <Image src={Ic_check} alt="check" />
                    ) : (
                      <Image src={Ic_x_close} alt="check" />
                    )}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Kan belånes</p>
                  <h5 className="text-base text-black font-medium">
                    {CadastreDataFromApi?.cadastreApi?.response?.item
                      .canBeMortgaged === true || "Ja" ? (
                      <Image src={Ic_check} alt="check" />
                    ) : (
                      <Image src={Ic_x_close} alt="check" />
                    )}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Har bygning</p>
                  <h5 className="text-base text-black font-medium">
                    {CadastreDataFromApi?.cadastreApi?.response?.item
                      .hasBuilding === true || "Ja" ? (
                      <Image src={Ic_check} alt="check" />
                    ) : (
                      <Image src={Ic_x_close} alt="check" />
                    )}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Har fritidsbolig</p>
                  <h5 className="text-base text-black font-medium">
                    {CadastreDataFromApi?.cadastreApi?.response?.item
                      .hasHolidayHome === true || "Ja" ? (
                      <Image src={Ic_check} alt="check" />
                    ) : (
                      <Image src={Ic_x_close} alt="check" />
                    )}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Har bolig</p>
                  <h5 className="text-base text-black font-medium">
                    {CadastreDataFromApi?.cadastreApi?.response?.item
                      .hasHousing === true || "Ja" ? (
                      <Image src={Ic_check} alt="check" />
                    ) : (
                      <Image src={Ic_x_close} alt="check" />
                    )}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Har nærkunder</p>
                  <h5 className="text-base text-black font-medium">
                    {CadastreDataFromApi?.cadastreApi?.response?.item
                      .canBeMortgaged === true || "Ja" ? (
                      <Image src={Ic_check} alt="check" />
                    ) : (
                      <Image src={Ic_x_close} alt="check" />
                    )}
                  </h5>
                </div>
              </div>
            </div>
            <div className="bg-gray3 rounded-[8px] p-5 flex flex-col gap-4">
              <h2 className="text-black text-lg font-semibold flex items-center gap-2">
                Parkeringsinformasjon
                <div className="relative">
                  <Image
                    src={Ic_info_circle}
                    alt="info"
                    className="cursor-pointer"
                    onClick={() => toggleDropdown("Parkeringsinformasjon")}
                  />
                  {dropdownState.Parkeringsinformasjon && (
                    <div
                      className="flex flex-col gap-2 absolute text-grayText font-normal text-sm p-3 rounded-[8px] bg-white w-72 dropdown-arrow"
                      style={{
                        boxShadow:
                          "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
                        zIndex: 999999999,
                        transform: "translateX(-50%)",
                        left: "50%",
                      }}
                      ref={dropdownRef}
                    >
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the indo.
                    </div>
                  )}
                </div>
              </h2>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">
                    Parkering reservert plass
                  </p>
                  <h5 className="text-base text-black font-medium">
                    {askData?.bya_calculations?.results?.parking
                      ?.required_spaces ? (
                      <>
                        {
                          askData?.bya_calculations?.results?.parking
                            ?.required_spaces
                        }{" "}
                        {/* m<sup>2</sup> */}
                        stk
                      </>
                    ) : (
                      "-"
                    )}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">
                    Parkering område per plass
                  </p>
                  <h5 className="text-base text-black font-medium">
                    {askData?.bya_calculations?.results?.parking
                      ?.area_per_space ? (
                      <>
                        {
                          askData?.bya_calculations?.results?.parking
                            ?.area_per_space
                        }{" "}
                        m<sup>2</sup>
                      </>
                    ) : (
                      "-"
                    )}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">
                    Totalt parkeringsområde
                  </p>
                  <h5 className="text-base text-black font-medium">
                    {askData?.bya_calculations?.results?.parking
                      ?.total_parking_area ? (
                      <>
                        {
                          askData?.bya_calculations?.results?.parking
                            ?.total_parking_area
                        }{" "}
                        m<sup>2</sup>
                      </>
                    ) : (
                      "-"
                    )}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Parkering er usikker</p>
                  <h5 className="text-base text-black font-medium">
                    {askData?.bya_calculations?.results?.parking
                      ?.is_uncertain === true ? (
                      <Image src={Ic_check} alt="check" />
                    ) : (
                      <Image src={Ic_x_close} alt="check" />
                    )}
                  </h5>
                </div>
              </div>
            </div>
            <div className="bg-gray3 rounded-[8px] p-5 flex flex-col gap-4">
              <h2 className="text-black text-lg font-semibold flex items-center gap-2">
                Ytterligere eiendomsforhold
                <div className="relative">
                  <Image
                    src={Ic_info_circle}
                    alt="info"
                    className="cursor-pointer"
                    onClick={() => toggleDropdown("YtterligereEiendomsforhold")}
                  />
                  {dropdownState.YtterligereEiendomsforhold && (
                    <div
                      className="flex flex-col gap-2 absolute text-grayText font-normal text-sm p-3 rounded-[8px] bg-white w-72 dropdown-arrow"
                      style={{
                        boxShadow:
                          "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
                        zIndex: 999999999,
                        transform: "translateX(-50%)",
                        left: "50%",
                      }}
                      ref={dropdownRef}
                    >
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the indo.
                    </div>
                  )}
                </div>
              </h2>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Har pestforekomster</p>
                  <h5 className="text-base text-black font-medium">
                    <Image src={Ic_check} alt="check" />
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Har aktiv leiestand</p>
                  <h5 className="text-base text-black font-medium">
                    {CadastreDataFromApi?.cadastreApi?.response?.item
                      .hasActiveLeasedLand === "Ja" || true ? (
                      <Image src={Ic_check} alt="check" />
                    ) : (
                      <Image src={Ic_x_close} alt="check" />
                    )}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">
                    Inkludert i totalt eiendom
                  </p>
                  <h5 className="text-base text-black font-medium">
                    <Image src={Ic_check} alt="check" />
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">
                    Kulturminner registrert
                  </p>
                  <h5 className="text-base text-black font-medium">
                    {lamdaDataFromApi?.eiendomsInformasjon?.status
                      ?.kulturminner_registrert === "Ja" || true ? (
                      <Image src={Ic_check} alt="check" />
                    ) : (
                      <Image src={Ic_x_close} alt="check" />
                    )}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Grunnforurensning</p>
                  <h5 className="text-base text-black font-medium">
                    {lamdaDataFromApi?.eiendomsInformasjon?.status
                      ?.grunnforurensning === "Ja" || true ? (
                      <Image src={Ic_check} alt="check" />
                    ) : (
                      <Image src={Ic_x_close} alt="check" />
                    )}
                  </h5>
                </div>
              </div>
            </div>
            <div className="bg-gray3 rounded-[8px] p-5 flex flex-col gap-4">
              <h2 className="text-black text-lg font-semibold flex items-center gap-2">
                Spesielle registreringer
                <div className="relative">
                  <Image
                    src={Ic_info_circle}
                    alt="info"
                    className="cursor-pointer"
                    onClick={() => toggleDropdown("SpesielleRegistreringer")}
                  />
                  {dropdownState.SpesielleRegistreringer && (
                    <div
                      className="flex flex-col gap-2 absolute text-grayText font-normal text-sm p-3 rounded-[8px] bg-white w-72 dropdown-arrow"
                      style={{
                        boxShadow:
                          "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
                        zIndex: 999999999,
                        transform: "translateX(-50%)",
                        left: "50%",
                      }}
                      ref={dropdownRef}
                    >
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the indo.
                    </div>
                  )}
                </div>
              </h2>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Sammenslåtte tomter</p>
                  <h5 className="text-base text-black font-medium">
                    <Image src={Ic_check} alt="check" />
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Tinglyst</p>
                  <h5 className="text-base text-black font-medium">
                    {lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                      ?.tinglyst === "Ja" || true ? (
                      <Image src={Ic_check} alt="check" />
                    ) : (
                      <Image src={Ic_x_close} alt="check" />
                    )}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Ugyldig</p>
                  <h5 className="text-base text-black font-medium">
                    <Image src={Ic_check} alt="check" />
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">
                    Oppmåling ikke fullført
                  </p>
                  <h5 className="text-base text-black font-medium">
                    {lamdaDataFromApi?.eiendomsInformasjon?.status
                      ?.oppmaling_ikke_fullfort === "Ja" || true ? (
                      <Image src={Ic_check} alt="check" />
                    ) : (
                      <Image src={Ic_x_close} alt="check" />
                    )}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">
                    Mangler grenseoppmerking
                  </p>
                  <h5 className="text-base text-black font-medium">
                    {lamdaDataFromApi?.eiendomsInformasjon?.status
                      ?.mangler_grensepunktmerking === "Ja" || true ? (
                      <Image src={Ic_check} alt="check" />
                    ) : (
                      <Image src={Ic_x_close} alt="check" />
                    )}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Under sammenslåing</p>
                  <h5 className="text-base text-black font-medium">
                    {lamdaDataFromApi?.eiendomsInformasjon?.status
                      ?.under_sammenslaing === "Ja" || true ? (
                      <Image src={Ic_check} alt="check" />
                    ) : (
                      <Image src={Ic_x_close} alt="check" />
                    )}
                  </h5>
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-black text-2xl font-semibold mb-6">
            Kartutsnitt
          </h2>
          <div className="rounded-[12px] overflow-hidden w-full mb-[60px]">
            <div className="h-[600px]">
              <GoogleMapComponent
                coordinates={
                  lamdaDataFromApi?.coordinates?.convertedCoordinates
                }
              />
            </div>
          </div>
          {loadingLamdaData ? (
            <Loader />
          ) : (
            <>
              <div className="relative">
                {loadingAdditionalData ? (
                  <Loading />
                ) : (
                  <>
                    <div className="mb-[34px] relative">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-black text-2xl font-semibold">
                          Reguleringsbestemmelser
                        </h2>
                        <Image src={Ic_generelt} alt="image" />
                      </div>
                      <div className="flex flex-col gap-3">
                        <>
                          {askData &&
                            askData?.conclusion?.map(
                              (a: any, index: number) => (
                                <div
                                  className="flex items-start gap-3 text-secondary text-base"
                                  key={index}
                                >
                                  <Image src={Ic_check_true} alt="image" />
                                  <span>{a}</span>
                                </div>
                              )
                            )}
                        </>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-black text-2xl font-semibold">
                          Kommuneplan for Asker
                        </h2>
                        <Image src={Ic_generelt} alt="image" />
                      </div>
                      <div className="flex flex-col gap-3">
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
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </SideSpaceContainer>

        <SideSpaceContainer>
          {loadingLamdaData ? (
            <div className="relative">
              <Loading />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-black text-2xl font-semibold">
                  Eksisterende bebyggelse
                </h2>
              </div>
              <div className="grid grid-cols-4 gap-6 mb-16">
                {CadastreDataFromApi?.buildingsApi?.response?.items.map(
                  (item: any, index: number) => (
                    <div
                      className="bg-gray3 rounded-[8px] p-5 flex flex-col gap-4"
                      key={index}
                    >
                      <div className="flex flex-col gap-4">
                        <div className="w-full h-[177px] rounded-[8px]">
                          <GoogleMapNearByComponent
                            coordinates={item?.position?.geometry?.coordinates}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <h3 className="text-black font-semibold text-lg second_line_elipse">
                            {item?.typeOfBuilding?.text}
                          </h3>
                          <p className="text-sm text-grayText">
                            {item?.buildingStatus?.text}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-[2px]">
                        <div className="text-grayText text-sm">
                          Antall etasjer:{" "}
                          <span className="text-black font-medium text-base">
                            {item?.numberOfFloors}
                          </span>
                        </div>
                        <div className="text-grayText text-sm">
                          Bruksareal:{" "}
                          <span className="text-black font-medium text-base">
                            {item?.totalFloorSpace} m<sup>2</sup>
                          </span>
                        </div>
                        <div className="text-grayText text-sm">
                          Rammetillatelse:{" "}
                          <span className="text-black font-medium text-base">
                            {formatDateToDDMMYYYY(
                              item?.registeredApprovedDate?.timestamp
                            )}
                          </span>
                        </div>
                        <div className="text-grayText text-sm">
                          Igangsettelse:{" "}
                          <span className="text-black font-medium text-base">
                            {formatDateToDDMMYYYY(
                              item?.approvedDate?.timestamp
                            )}
                          </span>
                        </div>
                        <div className="text-grayText text-sm">
                          Midleritidg bruk:{" "}
                          <span className="text-black font-medium text-base">
                            {formatDateToDDMMYYYY(item?.usedDate?.timestamp)}
                          </span>
                        </div>
                        <div className="text-grayText text-sm">
                          Ferdigattest:{" "}
                          <span className="text-black font-medium text-base">
                            {formatDateToDDMMYYYY(
                              item?.buildingStatusHistory[0]
                                ?.buildingStatusRegisteredDate?.timestamp
                            )}
                          </span>
                        </div>
                        <div className="text-grayText text-sm">
                          Bebygd areal (BYA):{" "}
                          <span className="text-black font-medium text-base">
                            {item?.builtUpArea} m<sup>2</sup>
                          </span>
                        </div>
                        <div className="text-grayText font-bold text-sm">
                          Bygningen utgjør{" "}
                          {(() => {
                            if (
                              item?.builtUpArea &&
                              askData?.bya_calculations?.results
                                ?.total_allowed_bya
                            ) {
                              return (
                                (item.builtUpArea /
                                  askData.bya_calculations.results
                                    .total_allowed_bya) *
                                100
                              ).toFixed(2);
                            }
                            return 0;
                          })()}
                          % av BYA
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </SideSpaceContainer>
      </div>
    </div>
  );
};

export default RegulationPdf;
