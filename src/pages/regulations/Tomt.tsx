import React, { useEffect, useRef, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Ic_generelt from "@/public/images/Ic_generelt.svg";
import Ic_info_circle from "@/public/images/Ic_info_circle.svg";
import Ic_check_true from "@/public/images/Ic_check_true.svg";
import Image from "next/image";
import Ic_steddy from "@/public/images/Ic_steddy.svg";
import Ic_download from "@/public/images/Ic_download.svg";
import Ic_check from "@/public/images/Ic_check.svg";
import Ic_x_close from "@/public/images/Ic_x_close.svg";
import Ic_logo from "@/public/images/Ic_logo.svg";
import Ic_vapp from "@/public/images/Ic_vapp.svg";
import Ic_garaje from "@/public/images/Ic_garaje.svg";
import Ic_house from "@/public/images/Ic_house.svg";
import Ic_ofc from "@/public/images/Ic_ofc.svg";
import Ic_pergola from "@/public/images/Ic_pergola.svg";
import Ic_cabin from "@/public/images/Ic_cabin.svg";
import Button from "@/components/common/button";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import ContactForm from "@/components/Ui/stepperUi/contactForm";
import Loader from "@/components/Loader";
import GoogleMapComponent from "@/components/Ui/map";
import { useAddress } from "@/context/addressContext";
import LoginForm from "../login/loginForm";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import GoogleMapNearByComponent from "@/components/Ui/map/nearbyBuiildingMap";

const buildOption: any = [
  {
    icon: Ic_garaje,
    name: "Garasje eller carport",
    BYAInntil: "67,42",
    tilgjengelig: 7,
  },
  {
    icon: Ic_house,
    name: "Hagestue, bod eller drivhus",
    BYAInntil: "67,42",
    tilgjengelig: 7,
  },
  {
    icon: Ic_ofc,
    name: "Verksted, atelier eller kontor",
    BYAInntil: "67,42",
    tilgjengelig: 7,
  },
  {
    icon: Ic_pergola,
    name: "Frittliggende pergola",
    BYAInntil: "67,42",
    tilgjengelig: 7,
  },
  {
    icon: Ic_cabin,
    name: "Hytte, fritidsbolig eller anneks",
    BYAInntil: "67,42",
    tilgjengelig: 7,
  },
];

const Tomt: React.FC<{
  loginUser: any;
  loadingAdditionalData: any;
  handleNext: any;
  lamdaDataFromApi: any;
  isPopupOpen: any;
  setIsPopupOpen: any;
  setIsCall: any;
  loadingLamdaData: any;
  CadastreDataFromApi: any;
  askData: any;
}> = ({
  handleNext,
  lamdaDataFromApi,
  loadingAdditionalData,
  askData,
  loginUser,
  isPopupOpen,
  setIsPopupOpen,
  setIsCall,
  loadingLamdaData,
  CadastreDataFromApi,
}) => {
  const router = useRouter();
  const { getAddress } = useAddress();
  const popup = useRef<HTMLDivElement>(null);

  const [loginPopup, setLoginPopup] = useState(false);
  const [dropdownState, setDropdownState] = useState({
    Tomteopplysninger: false,
    KommunaleData: false,
    Eiendomsstatus: false,
    Parkeringsinformasjon: false,
    YtterligereEiendomsforhold: false,
    SpesielleRegistreringer: false,
  });

  const [isBuild, setIsBuild] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // Close all dropdowns if clicked outside
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
    const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = dateObject.getFullYear();

    return `${day}.${month}.${year}`;
  }

  const validationLoginSchema = Yup.object().shape({
    terms_condition: Yup.boolean().oneOf([true], "Påkrevd").required("Påkrevd"),
  });

  const [isLoginChecked, setIsLoginChecked] = useState(false);
  const handleLoginCheckboxChange = () => {
    setIsLoginChecked(!isLoginChecked);
  };

  const handleLoginSubmit = async () => {
    setIsPopupOpen(false);
    setLoginPopup(true);
    router.push(`${router.asPath}&login_popup=true`);
  };

  useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPopupOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popup.current && !popup.current.contains(event.target as Node)) {
        setIsBuild(false);
        // body?.classList.remove("overflow-hidden");
        // body?.classList.remove("h-screen");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // useEffect(() => {
  //   if (isBuild) {
  //     body?.classList.add("overflow-hidden");
  //     body?.classList.add("h-screen");
  //   } else {
  //     body?.classList.remove("overflow-hidden");
  //     body?.classList.remove("h-screen");
  //   }
  // }, [isBuild]);

  const router_query: any = { ...router.query };

  delete router_query.login_popup;

  const queryString = new URLSearchParams(router_query).toString();

  const captureScreenshotAndDownloadPDF = () => {
    const element: any = document.querySelector("#regulationDocument");
    const not_show: any = document.querySelector("#not_show");
    const logoDiv: any = document.querySelector("#logoDiv");
    const notShow: any = document.querySelectorAll(".notShow");

    if (!element) {
      console.error("Element to capture not found");
      return;
    }
    if (not_show) {
      not_show.style.display = "none";
    }
    if (logoDiv) {
      logoDiv.style.display = "block";
    }
    notShow.forEach((btn: any) => {
      btn.style.display = "none";
    });

    html2canvas(element, {
      allowTaint: true,
      useCORS: true,
      logging: true,
    })
      .then((canvas) => {
        const pdf = new jsPDF("p", "mm", "a4");

        const imageData = canvas.toDataURL("image/png");

        const pageWidth = pdf.internal.pageSize.width;
        const pageHeight = pdf.internal.pageSize.height;

        const padding = 0;

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const newWidth = pageWidth - 2;

        const scaleFactor = newWidth / imgWidth;
        const newHeight = imgHeight * scaleFactor;

        if (newHeight > pageHeight - 2) {
          const scaleDownFactor = (pageHeight - 2) / newHeight;
          const scaledHeight = newHeight * scaleDownFactor;
          pdf.addImage(
            imageData,
            "PNG",
            padding,
            padding,
            newWidth,
            scaledHeight
          );
        } else {
          pdf.addImage(imageData, "PNG", padding, padding, newWidth, newHeight);
        }
        if (not_show) {
          not_show.style.display = "block";
        }
        if (logoDiv) {
          logoDiv.style.display = "none";
        }
        notShow.forEach((btn: any) => {
          btn.style.display = "flex";
        });
        pdf.save(`min_tomt_regulation_${lamdaDataFromApi?.propertyId}.pdf`);
      })
      .catch((error) => {
        console.error("Error capturing screenshot: ", error);
        if (not_show) {
          not_show.style.display = "block";
        }
        if (logoDiv) {
          logoDiv.style.display = "none";
        }
        notShow.forEach((btn: any) => {
          btn.style.display = "flex";
        });
      });
  };

  if (loadingLamdaData) {
    <Loader />;
  }
  return (
    <div className="relative">
      <div id="regulationDocument">
        <div
          className="border-b border-[#EFF1F5] py-6 pb-8"
          id="logoDiv"
          style={{ display: "none" }}
        >
          <SideSpaceContainer>
            <Image src={Ic_logo} alt="logo" className="w-[100px] lg:w-auto" />
          </SideSpaceContainer>
        </div>
        <SideSpaceContainer className="relative pt-[60px] pb-[46px]">
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
                    className="notShow cursor-pointer"
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
                      .isRegisteredLand === "Ja" ||
                    CadastreDataFromApi?.cadastreApi?.response?.item
                      .isRegisteredLand === true ? (
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
                    className="notShow cursor-pointer"
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
                    className="notShow cursor-pointer"
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
                      .canBeSold === true ||
                    CadastreDataFromApi?.cadastreApi?.response?.item
                      .canBeSold === "Ja" ? (
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
                      .canBeMortgaged === true ||
                    CadastreDataFromApi?.cadastreApi?.response?.item
                      .canBeMortgaged === "Ja" ? (
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
                      .hasBuilding === true ||
                    CadastreDataFromApi?.cadastreApi?.response?.item
                      .hasBuilding === "Ja" ? (
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
                      .hasHolidayHome === true ||
                    CadastreDataFromApi?.cadastreApi?.response?.item
                      .hasHolidayHome === "Ja" ? (
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
                      .hasHousing === true ||
                    CadastreDataFromApi?.cadastreApi?.response?.item
                      .hasHousing === "Ja" ? (
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
                    className="notShow cursor-pointer"
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
                    className="notShow cursor-pointer"
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
                    {CadastreDataFromApi?.cadastreApi?.response?.item
                      .hasSoilContamination === "Ja" ||
                    CadastreDataFromApi?.cadastreApi?.response?.item
                      .hasSoilContamination === true ? (
                      <Image src={Ic_check} alt="check" />
                    ) : (
                      <Image src={Ic_x_close} alt="check" />
                    )}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Har aktiv leiestand</p>
                  <h5 className="text-base text-black font-medium">
                    {CadastreDataFromApi?.cadastreApi?.response?.item
                      .hasActiveLeasedLand === "Ja" ||
                    CadastreDataFromApi?.cadastreApi?.response?.item
                      .hasActiveLeasedLand === true ? (
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
                    {CadastreDataFromApi?.cadastreApi?.response?.item
                      .includedInTotalRealEstate === "Ja" ||
                    CadastreDataFromApi?.cadastreApi?.response?.item
                      .includedInTotalRealEstate === true ? (
                      <Image src={Ic_check} alt="check" />
                    ) : (
                      <Image src={Ic_x_close} alt="check" />
                    )}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">
                    Kulturminner registrert
                  </p>
                  <h5 className="text-base text-black font-medium">
                    {lamdaDataFromApi?.eiendomsInformasjon?.status
                      ?.kulturminner_registrert === "Ja" ||
                    lamdaDataFromApi?.eiendomsInformasjon?.status
                      ?.kulturminner_registrert === true ? (
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
                      ?.grunnforurensning === "Ja" ||
                    lamdaDataFromApi?.eiendomsInformasjon?.status
                      ?.grunnforurensning === true ? (
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
                    className="notShow cursor-pointer"
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
                    {CadastreDataFromApi?.cadastreApi?.response?.item
                      .numberOfPlots === "Ja" ||
                    CadastreDataFromApi?.cadastreApi?.response?.item
                      .numberOfPlots === true ? (
                      <Image src={Ic_check} alt="check" />
                    ) : (
                      <Image src={Ic_x_close} alt="check" />
                    )}
                  </h5>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-grayText">Tinglyst</p>
                  <h5 className="text-base text-black font-medium">
                    {lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                      ?.tinglyst === "Ja" ||
                    lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                      ?.tinglyst === true ? (
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
                      ?.oppmaling_ikke_fullfort === "Ja" ||
                    lamdaDataFromApi?.eiendomsInformasjon?.status
                      ?.oppmaling_ikke_fullfort === true ? (
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
                      ?.mangler_grensepunktmerking === "Ja" ||
                    lamdaDataFromApi?.eiendomsInformasjon?.status
                      ?.mangler_grensepunktmerking === true ? (
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
                      ?.under_sammenslaing === "Ja" ||
                    (lamdaDataFromApi?.eiendomsInformasjon?.status
                      ?.under_sammenslaing ===
                      "Ja") ===
                      true ? (
                      <Image src={Ic_check} alt="check" />
                    ) : (
                      <Image src={Ic_x_close} alt="check" />
                    )}
                  </h5>
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex gap-[40px]">
            <div className="w-[34%]">
              <h2 className="text-black text-2xl font-semibold mb-6">
                Kartutsnitt
              </h2>
              <div className="rounded-[12px] overflow-hidden w-full mb-[60px]">
                <div className="h-[400px]">
                  <GoogleMapComponent
                    coordinates={
                      lamdaDataFromApi?.coordinates?.convertedCoordinates
                    }
                  />
                </div>
              </div>
              <div id="not_show">
                <div className="flex items-center gap-[36px] mb-6 bg-[#F9F9FB] rounded-[8px] py-5 px-6">
                  <Image src={Ic_steddy} alt="logo" />
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
                <ContactForm />
              </div>
            </div>
            <div className="w-[66%]">
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
            </div>
          </div>
          {!loginUser && (
            <div
              className="absolute top-0 h-full w-full left-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.7) 100%, rgba(255, 255, 255, 0.7) 100%)",
              }}
            ></div>
          )}
        </SideSpaceContainer>

        <SideSpaceContainer>
          {loadingLamdaData ? (
            <div className="relative">
              <Loading />
            </div>
          ) : (
            <>
              {CadastreDataFromApi?.buildingsApi?.response?.items.length >
                0 && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-black text-2xl font-semibold">
                      Eksisterende bebyggelse
                    </h2>
                    {!loadingAdditionalData && (
                      <div
                        className="flex gap-2 items-center cursor-pointer notShow"
                        onClick={captureScreenshotAndDownloadPDF}
                      >
                        <Image src={Ic_download} alt="download" />
                        <h4 className="text-primary text-base font-semibold">
                          Download Regulation Document
                        </h4>
                      </div>
                    )}
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
                                coordinates={
                                  item?.position?.geometry?.coordinates
                                }
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <h3 className="text-black font-semibold text-lg one_line_elipse">
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
                                {formatDateToDDMMYYYY(
                                  item?.usedDate?.timestamp
                                )}
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
                                const builtUpArea = item?.builtUpArea;
                                const totalAllowedBya =
                                  askData?.bya_calculations?.results
                                    ?.total_allowed_bya;

                                if (
                                  builtUpArea &&
                                  totalAllowedBya &&
                                  totalAllowedBya > 0
                                ) {
                                  const percentage =
                                    (builtUpArea / totalAllowedBya) * 100;
                                  return `${percentage.toFixed(2)}%`;
                                }
                                return "0%";
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
            </>
          )}
        </SideSpaceContainer>
      </div>
      <div
        className="sticky bottom-0 bg-white py-6"
        style={{
          boxShadow:
            "0px -4px 6px -2px #10182808, 0px -12px 16px -4px #10182814",
          zIndex: 9999,
        }}
      >
        <SideSpaceContainer>
          <div className="flex justify-end gap-4 items-center">
            <Button
              text="Tilbake"
              className="border border-lightPurple bg-lightPurple text-blue sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[46px] relative desktop:py-[16px]"
              path="/"
            />
            <Button
              text="Velg husmodell"
              className="border border-primary bg-primary text-white sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
              onClick={() => setIsBuild(true)}
            />
          </div>
        </SideSpaceContainer>
      </div>

      {isPopupOpen && !loginUser && (
        <div className="fixed top-0 left-0 flex justify-center items-center h-full w-full">
          <div
            className="bg-white p-8 rounded-[8px] w-[787px]"
            style={{
              boxShadow:
                "0px 8px 8px -4px rgba(16, 24, 40, 0.031), 0px 20px 24px -4px rgba(16, 24, 40, 0.078)",
            }}
          >
            <h2 className="text-black text-[24px] font-semibold mb-2 text-center">
              Registrer deg
            </h2>
            <p className="text-secondary text-base text-center mb-2">
              Logg inn med{" "}
              <span className="font-semibold text-black">Vipps</span> for å få
              se{" "}
              <span className="font-semibold text-black">
                alle bestemmelser og finne <br />
                boliger som passer på denne eiendommen
              </span>
            </p>
            <Formik
              initialValues={{ terms_condition: false }}
              validationSchema={validationLoginSchema}
              onSubmit={handleLoginSubmit}
            >
              {({ values, setFieldValue, errors, touched }) => (
                <Form>
                  <div className="flex items-center justify-center flex-col">
                    <label className="flex items-center gap-[12px] container w-max">
                      <Field
                        type="checkbox"
                        name="terms_condition"
                        checked={isLoginChecked}
                        onChange={() => {
                          setFieldValue(
                            "terms_condition",
                            !values.terms_condition
                          );
                          handleLoginCheckboxChange();
                        }}
                      />
                      <span className="checkmark checkmark_primary"></span>

                      <div className="text-secondary text-base">
                        Jeg aksepterer{" "}
                        <span className="text-primary">Vilkårene</span> og har
                        lest{" "}
                        <span className="text-primary">
                          Personvernerklæringen
                        </span>
                      </div>
                    </label>
                    {errors.terms_condition && touched.terms_condition && (
                      <div className="text-red text-sm">
                        {errors.terms_condition}
                      </div>
                    )}
                    <div className="flex justify-end mt-6">
                      <button
                        className="
                            text-sm md:text-base lg:py-[10px] py-[4px] px-2 md:px-[10px] lg:px-[18px] h-[36px] md:h-[40px] lg:h-[44px] flex items-center gap-[12px] justify-center border border-primary bg-primary text-white sm:text-base rounded-[8px] w-max font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                      >
                        Fortsett med <Image src={Ic_vapp} alt="logo" />
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {loginPopup && !loginUser && (
        <div
          className="fixed top-0 left-0 flex justify-center items-center h-full w-full"
          style={{ zIndex: 9999999 }}
        >
          <LoginForm
            path={`${router.pathname}?${queryString}`}
            setLoginPopup={setLoginPopup}
            setIsCall={setIsCall}
          />
        </div>
      )}

      {isBuild && !loadingAdditionalData && (
        <div
          className="fixed top-0 left-0 flex justify-center items-center h-full w-full bg-[#00000080]"
          style={{
            zIndex: 999999999,
          }}
        >
          <div
            className="bg-white rounded-[8px] w-[80%] relative max-h-[80%] overflow-y-auto"
            style={{
              boxShadow:
                "0px 8px 8px -4px rgba(16, 24, 40, 0.031), 0px 20px 24px -4px rgba(16, 24, 40, 0.078)",
            }}
            ref={popup}
          >
            <h2 className="text-black text-[24px] font-semibold mb-6 text-center pt-6 px-6">
              Hva vil du bygge?
            </h2>
            <div className="grid grid-cols-3 gap-6 mb-[40px] px-6">
              {buildOption.map((build: any, index: any) => {
                return (
                  <div
                    className="bg-gray3 rounded-[8px] p-5 flex flex-col gap-4"
                    key={index}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-[60px] h-[60px] rounded-full bg-lightPurple customShadow flex items-center justify-center">
                        <Image src={build.icon} alt="garaje" />
                      </div>
                      <h5 className="text-black text-lg font-semibold">
                        {build.name}
                      </h5>
                    </div>
                    <div className="flex flex-col gap-[2px]">
                      <div className="flex items-center gap-1">
                        <p className="text-grayText text-sm">BYA Inntil:</p>
                        <h6 className="text-black font-medium">
                          {(() => {
                            const data =
                              CadastreDataFromApi?.buildingsApi?.response?.items?.map(
                                (item: any) => item?.builtUpArea
                              ) ?? [];

                            if (
                              data.length >= 2 &&
                              askData?.bya_calculations?.results
                                ?.total_allowed_bya
                            ) {
                              const totalData = data.reduce(
                                (acc: number, currentValue: number) =>
                                  acc + currentValue,
                                0
                              );

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
                            }
                          })()}
                        </h6>
                      </div>
                      <div className="text-grayText text-sm font-bold">
                        Du har{" "}
                        {(() => {
                          const data =
                            CadastreDataFromApi?.buildingsApi?.response?.items?.map(
                              (item: any) => item?.builtUpArea
                            ) ?? [];

                          if (
                            data.length >= 2 &&
                            askData?.bya_calculations?.results
                              ?.total_allowed_bya
                          ) {
                            const totalData = data.reduce(
                              (acc: number, currentValue: number) =>
                                acc + currentValue,
                              0
                            );

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
                        })()}{" "}
                        tilgjengelig BYA
                      </div>
                    </div>
                    <Button
                      text="Velg"
                      className="border-2 border-primary text-primary sm:text-base w-full h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px] rounded-[50px]"
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-6 justify-end sticky bottom-0 bg-white px-6 py-4 shadow-shadow1">
              <Button
                text="Tilbake"
                className="border-2 border-primary text-primary sm:text-base w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px] rounded-[50px]"
                onClick={() => setIsBuild(false)}
              />
              <Button
                text="Neste"
                className="border border-primary bg-primary text-white sm:text-base rounded-[50px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                onClick={() => {
                  handleNext();
                  window.location.reload();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tomt;
