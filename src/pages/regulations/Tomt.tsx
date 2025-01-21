import React, { useEffect, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import PropertyDetail from "@/components/Ui/stepperUi/propertyDetail";
import Ic_generelt from "@/public/images/Ic_generelt.svg";
// import Ic_tak from "@/public/images/Ic_tak.svg";
import Ic_check_true from "@/public/images/Ic_check_true.svg";
import Image from "next/image";
import Ic_steddy from "@/public/images/Ic_steddy.svg";
import Ic_download from "@/public/images/Ic_download.svg";
import Ic_vapp from "@/public/images/Ic_vapp.svg";
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

const Tomt: React.FC<{
  loginUser: any;
  additionalData: any;
  loadingAdditionalData: any;
  handleNext: any;
  lamdaDataFromApi: any;
  isPopupOpen: any;
  setIsPopupOpen: any;
  setIsCall: any;
  loadingLamdaData: any;
  CadastreDataFromApi: any;
}> = ({
  handleNext,
  lamdaDataFromApi,
  loadingAdditionalData,
  additionalData,
  loginUser,
  isPopupOpen,
  setIsPopupOpen,
  setIsCall,
  loadingLamdaData,
  CadastreDataFromApi,
}) => {
  const router = useRouter();
  const { getAddress } = useAddress();

  const [loginPopup, setLoginPopup] = useState(false);

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

  const router_query: any = { ...router.query };

  delete router_query.login_popup;

  const queryString = new URLSearchParams(router_query).toString();

  const captureScreenshotAndDownloadPDF = () => {
    const element: any = document.querySelector("#regulationDocument");

    if (!element) {
      console.error("Element to capture not found");
      return;
    }

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

        const padding = 6;

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const newWidth = pageWidth - 2 * padding;

        const scaleFactor = newWidth / imgWidth;
        const newHeight = imgHeight * scaleFactor;

        if (newHeight > pageHeight - 2 * padding) {
          const scaleDownFactor = (pageHeight - 2 * padding) / newHeight;
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

        pdf.save("screenshot.pdf");
      })
      .catch((error) => {
        console.error("Error capturing screenshot: ", error);
      });
  };

  if (loadingLamdaData) {
    <Loader />;
  }
  return (
    <div className="relative">
      <div id="regulationDocument">
        <PropertyDetail
          isShow={false}
          loadingAdditionalData={loadingAdditionalData}
          askData={askData}
          CadastreDataFromApi={CadastreDataFromApi}
        />

        <SideSpaceContainer className="relative pt-[60px] pb-[46px]">
          <h2 className="text-black text-2xl font-semibold mb-6">
            Eiendomsinformajon
          </h2>
          <div className="grid grid-cols-6 gap-6 mb-[60px]">
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">Festenummer</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                  ?.festenummer
                  ? lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                      ?.festenummer
                  : "-"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">Areal beregnet</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                  ?.areal_beregnet ? (
                  <>
                    {
                      lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                        ?.areal_beregnet
                    }{" "}
                    m<sup>2</sup>
                  </>
                ) : (
                  "-"
                )}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">Etableringsdato</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                  ?.etableringsdato
                  ? formatDateToDDMMYYYY(
                      lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                        ?.etableringsdato
                    )
                  : "-"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">Sist oppdatert</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                  ?.sist_oppdatert
                  ? formatDateToDDMMYYYY(
                      lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon?.sist_oppdatert.split(
                        "T"
                      )[0]
                    )
                  : "-"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">Total allowed bya</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {askData?.bya_calculations?.results?.total_allowed_bya ? (
                  <>
                    {askData?.bya_calculations?.results?.total_allowed_bya} m
                    <sup>2</sup>
                  </>
                ) : (
                  "-"
                )}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">
                parkering område per plass
              </div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {askData?.bya_calculations?.results?.parking?.area_per_space ? (
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
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">numberOfPlots</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {CadastreDataFromApi?.cadastreApi?.response?.item
                  .numberOfPlots === true
                  ? "Ja"
                  : "Nei"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">pointHitch</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {CadastreDataFromApi?.cadastreApi?.response?.item.pointHitch ===
                true
                  ? "Ja"
                  : "Nei"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">zeroConcession</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {CadastreDataFromApi?.cadastreApi?.response?.item
                  .zeroConcession === true
                  ? "Ja"
                  : "Nei"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">unitName</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {CadastreDataFromApi?.cadastreApi?.response?.item.unitName
                  ? CadastreDataFromApi?.cadastreApi?.response?.item.unitName
                  : "-"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">specifiedArea</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {CadastreDataFromApi?.cadastreApi?.response?.item
                  .specifiedArea ? (
                  <>
                    {
                      CadastreDataFromApi?.cadastreApi?.response?.item
                        .specifiedArea
                    }{" "}
                    m<sup>2</sup>
                  </>
                ) : (
                  "-"
                )}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">Seksjonert</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                  ?.seksjonert
                  ? lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                      ?.seksjonert
                  : "-"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">Tinglyst</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                  ?.tinglyst
                  ? lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                      ?.tinglyst
                  : "-"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">
                Kulturminner registrert
              </div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {lamdaDataFromApi?.eiendomsInformasjon?.status
                  ?.kulturminner_registrert
                  ? lamdaDataFromApi?.eiendomsInformasjon?.status
                      ?.kulturminner_registrert
                  : "-"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">Aktive festegrunner</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {lamdaDataFromApi?.eiendomsInformasjon?.status
                  ?.aktive_festegrunner
                  ? lamdaDataFromApi?.eiendomsInformasjon?.status
                      ?.aktive_festegrunner
                  : "-"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">Anmerket klage</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {lamdaDataFromApi?.eiendomsInformasjon?.status?.anmerket_klage
                  ? lamdaDataFromApi?.eiendomsInformasjon?.status
                      ?.anmerket_klage
                  : "-"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">Grunnforurensning</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {lamdaDataFromApi?.eiendomsInformasjon?.status
                  ?.grunnforurensning
                  ? lamdaDataFromApi?.eiendomsInformasjon?.status
                      ?.grunnforurensning
                  : "-"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">Utgått</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {lamdaDataFromApi?.eiendomsInformasjon?.status?.utgatt
                  ? lamdaDataFromApi?.eiendomsInformasjon?.status?.utgatt
                  : "-"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">Under Sammenslåing</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {lamdaDataFromApi?.eiendomsInformasjon?.status
                  ?.under_sammenslaing
                  ? lamdaDataFromApi?.eiendomsInformasjon?.status
                      ?.under_sammenslaing
                  : "-"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">parkering er usikker</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {askData?.bya_calculations?.results?.parking?.is_uncertain ===
                true
                  ? "Ja"
                  : "Nei"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">agriculturalCadastre</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {CadastreDataFromApi?.cadastreApi?.response?.item
                  .agriculturalCadastre === true
                  ? "Ja"
                  : "Nei"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">canBeMortgaged</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {CadastreDataFromApi?.cadastreApi?.response?.item
                  .canBeMortgaged === true
                  ? "Ja"
                  : "Nei"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">canBeSold</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {CadastreDataFromApi?.cadastreApi?.response?.item.canBeSold ===
                true
                  ? "Ja"
                  : "Nei"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">hasActiveLeasedLand</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {CadastreDataFromApi?.cadastreApi?.response?.item
                  .hasActiveLeasedLand === true
                  ? "Ja"
                  : "Nei"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">hasBuilding</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {CadastreDataFromApi?.cadastreApi?.response?.item
                  .hasBuilding === true
                  ? "Ja"
                  : "Nei"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">hasHolidayHome</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {CadastreDataFromApi?.cadastreApi?.response?.item
                  .hasHolidayHome === true
                  ? "Ja"
                  : "Nei"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">hasHousing</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {CadastreDataFromApi?.cadastreApi?.response?.item.hasHousing ===
                true
                  ? "Ja"
                  : "Nei"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">hasNotedComplaint</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {CadastreDataFromApi?.cadastreApi?.response?.item
                  .hasNotedComplaint === true
                  ? "Ja"
                  : "Nei"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">hasOldCadastre</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {CadastreDataFromApi?.cadastreApi?.response?.item
                  .hasOldCadastre === true
                  ? "Ja"
                  : "Nei"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">
                hasRegisteredLandAcquisition
              </div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {CadastreDataFromApi?.cadastreApi?.response?.item
                  .hasRegisteredLandAcquisition === true
                  ? "Ja"
                  : "Nei"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">Kommune</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {/* {
                          lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                            ?.kommune} */}
                {getAddress?.kommunenavn}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">Kommunenr</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {lamdaDataFromApi?.eiendomsInformasjon?.kommune_info?.kommunenr
                  ? lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                      ?.kommunenr
                  : "-"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">Gårdsnummer</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                  ?.gaardsnummer
                  ? lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                      ?.gaardsnummer
                  : "-"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">Bruksnummer</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                  ?.bruksnummer
                  ? lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                      ?.bruksnummer
                  : "-"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">Festenr</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {lamdaDataFromApi?.eiendomsInformasjon?.kommune_info?.festenr
                  ? lamdaDataFromApi?.eiendomsInformasjon?.kommune_info?.festenr
                  : "-"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">Seksjonsnr</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {lamdaDataFromApi?.eiendomsInformasjon?.kommune_info?.seksjonsnr
                  ? lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                      ?.seksjonsnr
                  : "-"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">Bruksnavn</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {lamdaDataFromApi?.eiendomsInformasjon?.bruksnavn
                  ? lamdaDataFromApi?.eiendomsInformasjon?.bruksnavn
                  : "-"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">
                Oppmåling ikke fullført
              </div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {lamdaDataFromApi?.eiendomsInformasjon?.status
                  ?.oppmaling_ikke_fullfort
                  ? lamdaDataFromApi?.eiendomsInformasjon?.status
                      ?.oppmaling_ikke_fullfort
                  : "-"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">
                Mangler grensepunktmerking
              </div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {lamdaDataFromApi?.eiendomsInformasjon?.status
                  ?.mangler_grensepunktmerking
                  ? lamdaDataFromApi?.eiendomsInformasjon?.status
                      ?.mangler_grensepunktmerking
                  : "-"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">
                parkering nødvendig plass
              </div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {askData?.bya_calculations?.results?.parking
                  ?.required_spaces ? (
                  <>
                    {
                      askData?.bya_calculations?.results?.parking
                        ?.required_spaces
                    }{" "}
                    m<sup>2</sup>
                  </>
                ) : (
                  "-"
                )}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">
                totalt parkering område
              </div>
              <div className="text-black text-sm font-semibold w-full truncate">
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
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">hasSingleHeritage</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {CadastreDataFromApi?.cadastreApi?.response?.item
                  .hasSingleHeritage === true
                  ? "Ja"
                  : "Nei"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">hasSoilContamination</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {CadastreDataFromApi?.cadastreApi?.response?.item
                  .hasSoilContamination === true
                  ? "Ja"
                  : "Nei"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">leasehold</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {CadastreDataFromApi?.cadastreApi?.response?.item.ident
                  ?.leasehold === true
                  ? "Ja"
                  : "Nei"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">leaseholdUnitNumber</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {CadastreDataFromApi?.cadastreApi?.response?.item.ident
                  ?.leaseholdUnitNumber
                  ? CadastreDataFromApi?.cadastreApi?.response?.item.ident
                      ?.leaseholdUnitNumber
                  : "-"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">
                includedInTotalRealEstate
              </div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {CadastreDataFromApi?.cadastreApi?.response?.item
                  .includedInTotalRealEstate === true
                  ? "Ja"
                  : "Nei"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">
                isHistoricalRegisteredLand
              </div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {CadastreDataFromApi?.cadastreApi?.response?.item
                  .isHistoricalRegisteredLand === true
                  ? "Ja"
                  : "Nei"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">isRegisteredLand</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {CadastreDataFromApi?.cadastreApi?.response?.item
                  .isRegisteredLand === true
                  ? "Ja"
                  : "Nei"}
              </div>
            </div>
            <div className="flex gap-1 flex-col">
              <div className="text-secondary text-sm">regionnavn</div>
              <div className="text-black text-sm font-semibold w-full truncate">
                {CadastreDataFromApi?.cadastreApi?.response?.item.municipality
                  ?.regionName
                  ? CadastreDataFromApi?.cadastreApi?.response?.item
                      .municipality?.regionName
                  : "-"}
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
                    // nearbyBuildingCoordinates={nearbyBuildingCoordinates}
                  />
                </div>
              </div>
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-black text-2xl font-semibold">
                  Eksisterende bebyggelse
                </h2>
                <div
                  className="flex gap-2 items-center cursor-pointer"
                  onClick={captureScreenshotAndDownloadPDF}
                >
                  <Image src={Ic_download} alt="download" />
                  <h4 className="text-primary text-base font-semibold">
                    Download Regulation Document
                  </h4>
                </div>
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
                          <p className="text-sm text-[#4A5578]">
                            {item?.buildingStatus?.text}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-[2px]">
                        <div className="text-[#4A5578] text-sm">
                          Antall etasjer:{" "}
                          <span className="text-black font-medium text-base">
                            {item?.numberOfFloors}
                          </span>
                        </div>
                        <div className="text-[#4A5578] text-sm">
                          Bruksareal:{" "}
                          <span className="text-black font-medium text-base">
                            {item?.totalFloorSpace} m<sup>2</sup>
                          </span>
                        </div>
                        <div className="text-[#4A5578] text-sm">
                          Rammetillatelse:{" "}
                          <span className="text-black font-medium text-base">
                            {formatDateToDDMMYYYY(
                              item?.registeredApprovedDate?.timestamp
                            )}
                          </span>
                        </div>
                        <div className="text-[#4A5578] text-sm">
                          Igangsettelse:{" "}
                          <span className="text-black font-medium text-base">
                            {formatDateToDDMMYYYY(
                              item?.approvedDate?.timestamp
                            )}
                          </span>
                        </div>
                        <div className="text-[#4A5578] text-sm">
                          Midleritidg bruk:{" "}
                          <span className="text-black font-medium text-base">
                            {formatDateToDDMMYYYY(item?.usedDate?.timestamp)}
                          </span>
                        </div>
                        <div className="text-[#4A5578] text-sm">
                          Ferdigattest:{" "}
                          <span className="text-black font-medium text-base">
                            {formatDateToDDMMYYYY(
                              item?.buildingStatusHistory[0]
                                ?.buildingStatusRegisteredDate?.timestamp
                            )}
                          </span>
                        </div>
                        <div className="text-[#4A5578] text-sm">
                          Bebygd areal (BYA):{" "}
                          <span className="text-black font-medium text-base">
                            {item?.builtUpArea} m<sup>2</sup>
                          </span>
                        </div>
                        <div className="text-[#4A5578] font-bold text-sm">
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
              onClick={() => {
                handleNext();
              }}
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
    </div>
  );
};

export default Tomt;
