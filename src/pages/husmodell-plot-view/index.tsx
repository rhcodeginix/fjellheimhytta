import SideSpaceContainer from "@/components/common/sideSpace";
import { auth, db } from "@/config/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Ic_vapp from "@/public/images/Ic_vapp.svg";
import Img_line_bg from "@/public/images/Img_line_bg.png";
import Ic_productDetailWithPrice from "@/public/images/Ic_productDetailWithPrice.svg";
import Ic_check_green_icon from "@/public/images/Ic_check_green_icon.svg";
import Loading from "@/components/Loading";
import Ic_info_circle from "@/public/images/Ic_info_circle.svg";
import Ic_close from "@/public/images/Ic_close.svg";
import Loader from "@/components/Loader";
import Ic_chevron_up from "@/public/images/Ic_chevron_up.svg";
import Ic_chevron_down from "@/public/images/Ic_chevron_down.svg";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import Img_product_3d_img1 from "@/public/images/Img_product_3d_img1.png";
import Modal from "@/components/common/modal";
import GoogleMapComponent from "@/components/Ui/map";
import { formatPrice } from "../belop/belopProperty";
import ContactFormHusmodellPlotView from "@/components/Ui/husmodellPlotView/husmodellPlotContactForm";
import { onAuthStateChanged } from "firebase/auth";
import { useUserLayoutContext } from "@/context/userLayoutContext";
import LoginForm from "../login/loginForm";

function addDaysToDate(dateString: any, days: any) {
  let date = new Date(dateString);
  date.setDate(date.getDate() + days);

  let day = String(date.getDate()).padStart(2, "0");
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

const HusmodellPlotView: React.FC = () => {
  const router = useRouter();
  const [finalData, setFinalData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [plotId, setPlotId] = useState<string | null>(null);
  const [husmodellId, setHusmodellId] = useState<string | null>(null);
  const { loginUser, setLoginUser } = useUserLayoutContext();
  const [isCall, setIsCall] = useState(false);
  const Husdetaljer = finalData?.husmodell?.Husdetaljer;
  const plot = finalData?.plot;
  const lamdaDataFromApi = plot?.lamdaDataFromApi;
  const additionalData = plot?.additionalData;

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("min_tomt_login") === "true";
    if (isLoggedIn) {
      setLoginUser(true);
      setIsCall(true);
    }
  }, []);
  useEffect(() => {
    if (!loginUser) {
      setIsPopupOpen(true);
    } else {
      setIsPopupOpen(false);
    }
  }, [loginUser]);
  const [loginPopup, setLoginPopup] = useState(false);
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
  const router_query: any = { ...router.query };

  delete router_query.login_popup;
  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      setPlotId(queryParams.get("plot"));
      setHusmodellId(queryParams.get("husmodell"));
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUser({
              id: userDocSnapshot.id,
              ...userData,
            });
          } else {
            setIsPopupOpen(true);
            setLoading(false);
            setLoginUser(false);
            console.error("No such document in Firestore!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsPopupOpen(true);
          setLoading(false);
          setLoginUser(false);
        }
      } else {
        setUser(null);
        setLoading(false);
        setLoginUser(false);
        setIsPopupOpen(true);
      }
    });

    return () => unsubscribe();
  }, [isCall]);

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("hasReloaded");

    if (!hasReloaded) {
      window.location.reload();
      sessionStorage.setItem("hasReloaded", "true");
    } else {
      sessionStorage.removeItem("hasReloaded");
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      if (!plotId || !husmodellId) {
        setLoading(false);
        return;
      }

      try {
        const plotDocRef = doc(db, "empty_plot", plotId);

        const plotDocSnap = await getDoc(plotDocRef);

        const husmodellDocRef = doc(db, "house_model", husmodellId);
        const husmodellDocSnap = await getDoc(husmodellDocRef);

        if (plotDocSnap.exists() && husmodellDocSnap.exists()) {
          let plotData = plotDocSnap.data();
          let husmodellData = husmodellDocSnap.data();

          const updatedPlotData = {
            ...plotData,
            view_count: plotData.view_count ? plotData.view_count + 1 : 1,
          };

          await setDoc(plotDocRef, updatedPlotData, { merge: true });

          const viewerDocRef = doc(collection(plotDocRef, "viewer"), user.uid);

          const viewerDocSnap = await getDoc(viewerDocRef);
          let viewerViewCount = 1;

          if (viewerDocSnap.exists()) {
            const viewerData = viewerDocSnap.data();
            viewerViewCount = (viewerData?.view_count || 0) + 1;
          }

          await setDoc(
            viewerDocRef,
            {
              userId: user.uid,
              name: user.name || "N/A",
              last_updated_date: new Date().toISOString(),
              view_count: viewerViewCount,
            },
            { merge: true }
          );

          setFinalData({
            plot: { id: plotId, ...updatedPlotData },
            husmodell: { id: husmodellId, ...husmodellData },
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
  }, [user]);
  const queryString = new URLSearchParams(router_query).toString();

  const [isOpen, setIsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  const images = Husdetaljer?.photo3D || [];

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

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !plotId || !husmodellId) {
        return;
      }

      try {
        const leadsCollectionRef = collection(db, "leads");
        const querySnapshot = await getDocs(
          query(
            leadsCollectionRef,
            where("finalData.plot?.id", "==", plotId),
            where("finalData.husmodell.id", "==", husmodellId)
          )
        );
        if (!querySnapshot.empty) {
          return;
        }

        await addDoc(leadsCollectionRef, {
          finalData,
          user,
          Isopt: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } catch (error) {
        console.error("Firestore operation failed:", error);
      }
    };

    fetchData();
  }, [finalData]);

  const [supplierData, setSupplierData] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const supplierDocRef = doc(
          db,
          "suppliers",
          finalData.husmodell.Husdetaljer.Leverandører
        );
        const docSnap: any = await getDoc(supplierDocRef);

        if (docSnap.exists()) {
          setSupplierData(docSnap.data());
        } else {
          console.error(
            "No document found for ID:",
            finalData.husmodell.Husdetaljer.Leverandører
          );
        }
      } catch (error) {
        console.error("Error fetching supplier data:", error);
      }
    };
    if (Husdetaljer?.Leverandører) {
      getData();
    }
  }, [Husdetaljer?.Leverandører, finalData]);

  const totalDays = [
    Husdetaljer?.signConractConstructionDrawing +
      Husdetaljer?.neighborNotification +
      Husdetaljer?.appSubmitApprove +
      Husdetaljer?.constuctionDayStart +
      Husdetaljer?.foundationWork +
      Husdetaljer?.concreteWork +
      Husdetaljer?.deliveryconstuctionKit +
      Husdetaljer?.denseConstuction +
      Husdetaljer?.completeInside +
      Husdetaljer?.preliminaryInspection +
      Husdetaljer?.takeOver,
  ].reduce((acc, curr) => acc + (curr || 0), 0);

  return (
    <div className="relative">
      {loading && <Loader />}

      {!finalData ? (
        <div className="py-3">No data found</div>
      ) : (
        <>
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
                  {Husdetaljer?.husmodell_name}
                </h2>
                <div className="flex items-center gap-[24px]">
                  <div className="flex items-center gap-4">
                    <div className="text-secondary text-base">
                      m<sup>2</sup>:{" "}
                      <span className="text-black font-semibold">
                        {Husdetaljer?.BRATotal}
                      </span>
                    </div>
                    <div className="text-secondary text-base">
                      soverom:{" "}
                      <span className="text-black font-semibold">
                        {Husdetaljer?.Soverom}
                      </span>
                    </div>
                    <div className="text-secondary text-base">
                      bad:{" "}
                      <span className="text-black font-semibold">
                        {Husdetaljer?.Bad}
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
                          additionalData?.answer?.bya_calculations?.input
                            ?.bya_percentage
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
                            plot?.CadastreDataFromApi?.buildingsApi?.response?.items?.map(
                              (item: any) => item?.builtUpArea
                            ) ?? [];

                          if (
                            lamdaDataFromApi?.eiendomsInformasjon
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
                            plot?.CadastreDataFromApi?.buildingsApi?.response?.items?.map(
                              (item: any) => item?.builtUpArea
                            ) ?? [];

                          if (
                            additionalData?.answer?.bya_calculations?.results
                              ?.total_allowed_bya
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
                              additionalData?.answer?.bya_calculations?.input
                                ?.bya_percentage - formattedResult
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
                          additionalData?.answer?.bya_calculations?.results
                            ?.available_building_area
                        }{" "}
                        m<sup>2</sup>
                      </p>
                      <p className="text-white text-sm">
                        Tilgjengelig{" "}
                        {(() => {
                          const data =
                            plot?.CadastreDataFromApi?.buildingsApi?.response?.items?.map(
                              (item: any) => item?.builtUpArea
                            ) ?? [];

                          if (
                            additionalData?.answer?.bya_calculations?.results
                              ?.total_allowed_bya
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
                                  additionalData?.answer?.bya_calculations
                                    ?.results?.total_allowed_bya - totalData
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
                    <Image
                      src={Ic_chevron_up}
                      alt="arrow"
                      fetchPriority="auto"
                    />
                  ) : (
                    <Image
                      src={Ic_chevron_down}
                      alt="arrow"
                      fetchPriority="auto"
                    />
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
                    <div className="w-1/2 h-full relative">
                      <img
                        src={Husdetaljer?.photo}
                        alt="husmodell"
                        className="w-full h-full rounded-[8px] object-cover overflow-hidden"
                      />
                      <img
                        src={supplierData?.photo}
                        alt="product-logo"
                        className="absolute top-[12px] left-[12px] bg-[#FFFFFFB2] py-2 px-3 flex items-center justify-center rounded-[32px] w-[137px] h-[48px]"
                      />
                    </div>
                    <div className="w-1/2 h-full">
                      <div className="w-full h-full rounded-lg object-cover overflow-hidden">
                        <GoogleMapComponent
                          coordinates={
                            lamdaDataFromApi?.coordinates?.convertedCoordinates
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-[50%]">
                    <h5 className="text-black text-lg font-medium mb-2 truncate">
                      {
                        plot?.CadastreDataFromApi?.presentationAddressApi
                          ?.response?.item?.formatted?.line1
                      }{" "}
                      {
                        plot?.CadastreDataFromApi?.presentationAddressApi
                          ?.response?.item?.formatted?.line2
                      }
                    </h5>
                    <div className="flex items-center gap-4">
                      <div className="text-secondary text-base">
                        Gnr:{" "}
                        <span className="text-black font-semibold">
                          {lamdaDataFromApi?.searchParameters?.gardsnummer}
                        </span>
                      </div>
                      <div className="text-secondary text-base">
                        Bnr:{" "}
                        <span className="text-black font-semibold">
                          {lamdaDataFromApi?.searchParameters?.bruksnummer}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-9 my-5">
                      <div className="flex flex-col gap-1 w-max">
                        <p className="text-secondary text-sm whitespace-nowrap">
                          ESTIMERT BYGGESTART
                        </p>
                        <h5 className="text-black text-xl font-semibold whitespace-nowrap">
                          {addDaysToDate(
                            finalData?.husmodell?.createdAt,
                            Husdetaljer?.appSubmitApprove
                          )}
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
                        <p className="text-secondary text-sm whitespace-nowrap">
                          ESTIMERT INNFLYTTING
                        </p>
                        <h5 className="text-black text-xl font-semibold text-right whitespace-nowrap">
                          {addDaysToDate(
                            finalData?.husmodell?.createdAt,
                            totalDays
                          )}
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
                          <span className="font-semibold text-red">
                            01.12.2024
                          </span>
                        </div>
                      </div>
                      <div className="bg-lightPurple p-3 rounded-b-[12px]">
                        <p className="text-base text-secondary text-center">
                          Totalpris med tomt
                        </p>
                        <h3 className="text-black font-semibold text-[24px] text-center">
                          {formatPrice(
                            (Husdetaljer?.pris
                              ? Math.round(Husdetaljer?.pris.replace(/\s/g, ""))
                              : 0) + (plot?.pris ? Math.round(plot?.pris) : 0)
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
                              {item?.pris
                                ? `${item.pris} NOK`
                                : "inkl. i tilbud"}
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
                              {item?.pris
                                ? `${item.pris} NOK`
                                : "inkl. i tilbud"}
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
                  <ContactFormHusmodellPlotView supplierData={supplierData} />
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
        </>
      )}
      {!loginUser && (
        <div
          className="absolute top-0 h-full w-full left-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.7) 100%, rgba(255, 255, 255, 0.7) 100%)",
          }}
        ></div>
      )}
      {isPopupOpen && !finalData && !loginUser && (
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
                        type="submit"
                      >
                        Fortsett med{" "}
                        <Image fetchPriority="auto" src={Ic_vapp} alt="logo" />
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

export default HusmodellPlotView;
