import SideSpaceContainer from "@/components/common/sideSpace";
import { db } from "@/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Img_line_bg from "@/public/images/Img_line_bg.png";
import Ic_productDetailWithPrice from "@/public/images/Ic_productDetailWithPrice.svg";
import Ic_check_green_icon from "@/public/images/Ic_check_green_icon.svg";
import Loading from "@/components/Loading";
import Ic_info_circle from "@/public/images/Ic_info_circle.svg";
import Ic_close from "@/public/images/Ic_close.svg";
import Loader from "@/components/Loader";
import Ic_chevron_up from "@/public/images/Ic_chevron_up.svg";
import Ic_chevron_down from "@/public/images/Ic_chevron_down.svg";
import Img_product_3d_img1 from "@/public/images/Img_product_3d_img1.png";
import Modal from "@/components/common/modal";
import ContactForm from "@/components/Ui/stepperUi/contactForm";
import GoogleMapComponent from "@/components/Ui/map";
import { formatPrice } from "../belop/belopProperty";

const HusmodellPlotView: React.FC = () => {
  const router = useRouter();
  const [finalData, setFinalData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("hasReloaded");

    if (!hasReloaded) {
      window.location.reload();
      sessionStorage.setItem("hasReloaded", "true");
    } else {
      sessionStorage.removeItem("hasReloaded");
    }
  }, [router.asPath]);
  useEffect(() => {
    const fetchData = async () => {
      const queryParams: any = new URLSearchParams(window.location.search);
      const plotId = queryParams.get("plot");
      const husmodellId = queryParams.get("husmodell");

      if (!plotId || !husmodellId) {
        console.error("Missing plotId or husmodellId in query params.");
        setLoading(false);
        return;
      }

      try {
        const plotDocRef = doc(db, "empty_plot", plotId);
        const plotDocSnap = await getDoc(plotDocRef);

        const husmodellDocRef = doc(db, "house_model", husmodellId);
        const husmodellDocSnap = await getDoc(husmodellDocRef);

        if (plotDocSnap.exists() && husmodellDocSnap.exists()) {
          setFinalData({
            plot: plotDocSnap.data(),
            husmodell: husmodellDocSnap.data(),
          });
        } else {
          console.error("No document found for plot or husmodell ID.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  const images = finalData?.husmodell?.Husdetaljer?.photo3D || [];

  const displayedImages = images.slice(0, 4);
  const extraImagesCount = images.length - 4;

  const handlePopup = () => {
    if (isPopupOpen) {
      setIsPopupOpen(false);
    } else {
      setIsPopupOpen(true);
    }
  };

  const Byggekostnader = finalData?.husmodell?.Prisliste?.Byggekostnader;

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

  const Tomtekost = finalData?.husmodell?.Prisliste?.Tomtekost;

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

  const total = totalPrisOfByggekostnader + totalPrisOfTomtekost;

  if (loading) {
    return <Loader />;
  }

  if (!finalData) {
    return <div className="py-3">No data found</div>;
  }

  return (
    <div className="relative">
      <div className="bg-lightPurple py-[20px] relative">
        <Image
          fetchPriority="auto"
          src={Img_line_bg}
          alt="image"
          className="absolute top-0 left-0 w-full h-full"
          style={{ zIndex: 1 }}
        />
        <SideSpaceContainer>
          <div
            className="flex items-center justify-between relative gap-3"
            style={{ zIndex: 9 }}
          >
            <h2 className="text-black text-[32px] font-semibold truncate">
              {finalData?.husmodell?.Husdetaljer?.husmodell_name}
            </h2>
            <div className="flex items-center gap-[24px]">
              <div className="flex items-center gap-4">
                <div className="text-secondary text-base">
                  m<sup>2</sup>:{" "}
                  <span className="text-black font-semibold">
                    {finalData?.husmodell?.Husdetaljer?.BRATotal}
                  </span>
                </div>
                <div className="text-secondary text-base">
                  soverom:{" "}
                  <span className="text-black font-semibold">
                    {finalData?.husmodell?.Husdetaljer?.Soverom}
                  </span>
                </div>
                <div className="text-secondary text-base">
                  bad:{" "}
                  <span className="text-black font-semibold">
                    {finalData?.husmodell?.Husdetaljer?.Bad}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SideSpaceContainer>
      </div>
      <div className="bg-darkGreen py-5 relative">
        <SideSpaceContainer>
          {loading ? (
            <div className="w-[300px] flex flex-col gap-[16px] items-center h-full">
              <Loading />
            </div>
          ) : (
            <div className="flex gap-[70px] justify-between">
              <div className="w-1/4 flex items-start gap-3">
                <Image
                  fetchPriority="auto"
                  src={Ic_check_green_icon}
                  alt="check"
                />
                <div className="flex flex-col gap-1">
                  <p className="text-white text-sm">Eiendommen er</p>
                  <p className="text-white text-base font-semibold">
                    ferdig regulert til boligformål
                  </p>
                </div>
              </div>
              <div className="w-1/4 flex items-start gap-3">
                <Image
                  fetchPriority="auto"
                  src={Ic_check_green_icon}
                  alt="check"
                />
                <div className="flex flex-col gap-1">
                  <p className="text-white text-sm">Eiendommen har en</p>
                  <p className="text-white text-base font-semibold">
                    Utnyttelsesgrad på{" "}
                    {
                      finalData?.plot?.additionalData?.answer?.bya_calculations
                        ?.input?.bya_percentage
                    }
                    %
                  </p>
                </div>
              </div>
              <div className="w-1/4 flex items-start gap-3">
                <Image
                  fetchPriority="auto"
                  src={Ic_check_green_icon}
                  alt="check"
                />
                <div className="flex flex-col gap-1">
                  <p className="text-white text-sm">Ekisterende BYA</p>
                  <p className="text-white text-base font-semibold">
                    Utnyttelsesgrad på{" "}
                    {(() => {
                      const data =
                        finalData?.plot?.CadastreDataFromApi?.buildingsApi?.response?.items?.map(
                          (item: any) => item?.builtUpArea
                        ) ?? [];

                      if (
                        finalData?.plot?.lamdaDataFromApi?.eiendomsInformasjon
                          ?.basisInformasjon?.areal_beregnet
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
                            finalData?.plot?.lamdaDataFromApi
                              ?.eiendomsInformasjon?.basisInformasjon
                              ?.areal_beregnet) *
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
                        finalData?.plot?.CadastreDataFromApi?.buildingsApi?.response?.items?.map(
                          (item: any) => item?.builtUpArea
                        ) ?? [];

                      if (
                        finalData?.plot?.additionalData?.answer
                          ?.bya_calculations?.results?.total_allowed_bya
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
                            finalData?.plot?.lamdaDataFromApi
                              ?.eiendomsInformasjon?.basisInformasjon
                              ?.areal_beregnet) *
                          100;
                        const formattedResult: any = result.toFixed(2);

                        return `${(
                          finalData?.plot?.additionalData?.answer
                            ?.bya_calculations?.input?.bya_percentage -
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
                <Image
                  fetchPriority="auto"
                  src={Ic_check_green_icon}
                  alt="check"
                />
                <div className="flex flex-col gap-1">
                  <p className="text-white text-sm">Boligen kan ha en</p>
                  <p className="text-white text-base font-semibold">
                    Grunnflate på{" "}
                    {
                      finalData?.plot?.additionalData?.answer?.bya_calculations
                        ?.results?.available_building_area
                    }{" "}
                    m<sup>2</sup>
                  </p>
                  <p className="text-white text-sm">
                    Tilgjengelig{" "}
                    {(() => {
                      const data =
                        finalData?.plot?.CadastreDataFromApi?.buildingsApi?.response?.items?.map(
                          (item: any) => item?.builtUpArea
                        ) ?? [];

                      if (
                        finalData?.plot?.additionalData?.answer
                          ?.bya_calculations?.results?.total_allowed_bya
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
                              finalData?.plot?.additionalData?.answer
                                ?.bya_calculations?.results?.total_allowed_bya -
                              totalData
                            ).toFixed(2)}
                            m<sup>2</sup>
                          </>
                        );
                      } else {
                        return "0";
                      }
                    })()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </SideSpaceContainer>
      </div>
      <SideSpaceContainer>
        <div className="pt-[24px] pb-[86px]">
          <div style={{ borderBottom: "1px solid #B9C0D4" }}>
            <button
              className={`bg-white flex justify-between items-center w-full pb-6 duration-1000 ${isOpen ? "active" : ""}`}
              onClick={toggleAccordion}
            >
              <span className="text-black text-lg font-semibold">
                Illustrasjoner
              </span>
              {isOpen ? (
                <Image src={Ic_chevron_up} alt="arrow" fetchPriority="auto" />
              ) : (
                <Image src={Ic_chevron_down} alt="arrow" fetchPriority="auto" />
              )}
            </button>
            <div
              className={`overflow-hidden max-h-0 ${isOpen ? "pb-6" : ""}`}
              style={{
                maxHeight: isOpen ? "max-content" : "0",
                transition: "max-height 0.2s ease-out",
              }}
            >
              <div className="gap-6 flex h-[400px]">
                <div className="w-1/2">
                  <Image
                    src={Img_product_3d_img1}
                    alt="product"
                    className="w-full h-full"
                  />
                </div>
                <div className="w-1/2 grid grid-cols-2 gap-6">
                  {displayedImages.map((image: any, index: number) => (
                    <div
                      key={index}
                      className="relative overflow-hidden h-full"
                    >
                      <img
                        src={image}
                        alt="product"
                        className="w-full h-full object-fill rounded-lg"
                      />

                      {index === 3 && extraImagesCount > 0 && (
                        <div
                          className="absolute inset-0 bg-black bg-opacity-35 flex items-center justify-center text-white text-base font-bold cursor-pointer rounded-lg"
                          onClick={handlePopup}
                        >
                          +{extraImagesCount}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <h3 className="text-black text-2xl font-semibold my-6">
            Økonomisk plan og detaljer
          </h3>
          <div className="mb-[40px]">
            <div
              className="bg-white py-[20px] relative p-6 flex items-center gap-6 rounded-[8px]"
              style={{ boxShadow: "0px 4px 16px 0px #0000001A" }}
            >
              <div className="relative w-[50%] h-[262px] flex items-center gap-2">
                <div className="w-1/2 h-full">
                  <img
                    src={finalData?.husmodell?.Husdetaljer?.photo}
                    alt="husmodell"
                    className="w-full h-full rounded-[8px] object-cover overflow-hidden"
                  />
                </div>
                <div className="w-1/2 h-full">
                  <div className="w-full h-full rounded-lg object-cover overflow-hidden">
                    <GoogleMapComponent
                      coordinates={
                        finalData?.plot?.lamdaDataFromApi?.coordinates
                          ?.convertedCoordinates
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="w-[50%]">
                <h5 className="text-black text-lg font-medium mb-2 truncate">
                  {
                    finalData?.plot?.CadastreDataFromApi?.presentationAddressApi
                      ?.response?.item?.formatted?.line1
                  }{" "}
                  {
                    finalData?.plot?.CadastreDataFromApi?.presentationAddressApi
                      ?.response?.item?.formatted?.line2
                  }
                </h5>
                <div className="flex items-center gap-4">
                  <div className="text-secondary text-base">
                    Gnr:{" "}
                    <span className="text-black font-semibold">
                      {
                        finalData?.plot?.lamdaDataFromApi?.searchParameters
                          ?.gardsnummer
                      }
                    </span>
                  </div>
                  <div className="text-secondary text-base">
                    Bnr:{" "}
                    <span className="text-black font-semibold">
                      {
                        finalData?.plot?.lamdaDataFromApi?.searchParameters
                          ?.bruksnummer
                      }
                    </span>
                  </div>
                  {/* <div className="text-secondary text-base">
                    Snr:{" "}
                    <span className="text-black font-semibold">
                      {finalData?.plot?.getAddress?.bokstav}
                    </span>
                  </div>
                  <div className="text-secondary text-base">
                    moh.{" "}
                    <span className="text-black font-semibold">
                      {finalData?.plot?.getAddress?.representasjonspunkt &&
                        finalData?.plot?.getAddress?.representasjonspunkt.lat
                          .toFixed(2)
                          .toString()
                          .replace(".", ",")}
                    </span>
                  </div> */}
                </div>
                <div className="flex items-center gap-9 my-5">
                  <div className="flex flex-col gap-1 w-max">
                    <p className="text-red text-sm whitespace-nowrap">
                      ESTIMERT BYGGESTART
                    </p>
                    <h5 className="text-red text-xl font-semibold whitespace-nowrap">
                      03.01.2025
                    </h5>
                  </div>
                  <div className="w-full">
                    <Image
                      fetchPriority="auto"
                      src={Ic_productDetailWithPrice}
                      alt="image"
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-max">
                    <p className="text-red text-sm whitespace-nowrap">
                      {/* <p className="text-secondary text-sm whitespace-nowrap"> */}
                      ESTIMERT INNFLYTTING
                    </p>
                    <h5 className="text-red text-xl font-semibold text-right whitespace-nowrap">
                      {/* <h5 className="text-black text-xl font-semibold text-right whitespace-nowrap"> */}
                      23.11.2025
                    </h5>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-lightPurple p-3 rounded-b-[12px]">
                    <p className="text-base text-secondary text-center">
                      Tilbudpris
                    </p>
                    {/* <h3 className="text-black font-semibold text-[24px] text-center"> */}
                    <h3 className="text-red font-semibold text-[24px] text-center">
                      8.300.000 NOK
                    </h3>
                    <div className="text-secondary text-base text-center">
                      Tilbudet er gyldig til{" "}
                      {/* <span className="font-semibold text-black"> */}
                      <span className="font-semibold text-red">01.12.2024</span>
                    </div>
                  </div>
                  <div className="bg-lightPurple p-3 rounded-b-[12px]">
                    <p className="text-base text-secondary text-center">
                      Totalpris med tomt
                    </p>
                    <h3 className="text-black font-semibold text-[24px] text-center">
                      {formatPrice(
                        (finalData?.husmodell?.Husdetaljer?.pris
                          ? Math.round(
                              finalData?.husmodell?.Husdetaljer?.pris.replace(
                                /\s/g,
                                ""
                              )
                            )
                          : 0) +
                          (finalData?.plot?.pris
                            ? Math.round(finalData?.plot?.pris)
                            : 0)
                      )}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              boxShadow:
                "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
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
                    <Image
                      fetchPriority="auto"
                      src={Ic_info_circle}
                      alt="icon"
                    />
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
                    <Image
                      fetchPriority="auto"
                      src={Ic_info_circle}
                      alt="icon"
                    />
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
          <div className="flex justify-between w-full">
            <div className="w-[42%]">
              <ContactForm />
            </div>
            <div className="w-[58%]">
              <p className="text-secondary text-lg mb-2 text-right">
                Sum antatte anleggskostnader inkl. mva og tomtekostnad
              </p>
              <h5 className="text-black font-bold text-2xl text-right">
                {total.toLocaleString("nb-NO")} NOK
              </h5>
            </div>
          </div>
        </div>
      </SideSpaceContainer>
      {isPopupOpen && (
        <Modal isOpen={true} onClose={handlePopup}>
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full relative">
            <button
              className="absolute top-3 right-3"
              onClick={() => setIsOpen(false)}
            >
              <Image src={Ic_close} alt="close" />
            </button>

            <div className="grid grid-cols-3 gap-2 my-4">
              {images.map((image: any, index: number) => (
                <img
                  key={index}
                  src={image}
                  alt="product"
                  className="w-full h-[200px]"
                />
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HusmodellPlotView;
