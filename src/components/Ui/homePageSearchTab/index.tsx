import { useEffect, useState } from "react";
import BeløpTab from "./beløp";
import AdresseTab from "./adresse";
import HusmodellTab from "./husmodell";
import MatrikkelTab from "./matrikkel";
import Image from "next/image";
import Img_main_bg from "@/public/images/Img_main_bg.png";
import Img_plot from "@/public/images/Img_plot.png";
import SideSpaceContainer from "@/components/common/sideSpace";
import Button from "@/components/common/button";
import Img_plot_image1 from "@/public/images/Img_plot_image1.png";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import Loading from "@/components/Loading";
import GoogleMapComponent from "../map";
import { useRouter } from "next/router";

const tabs = [
  { id: "beløp", label: ["Start med", "beløp"] },
  { id: "adresse", label: ["Start med", "adresse"] },
  { id: "husmodell", label: ["Start med", "husmodell"] },
  { id: "matrikkel", label: ["Start med", "matrikkel"] },
];
const husmodellProperties = [
  {
    name: "Dokka",
    manufacturer: "Systemhus",
    description: "Arealeffektive Dokka med uteleied",
    area: 177,
    bedrooms: 3,
    bathrooms: 2,
    price: 5100000,
    currency: "NOK",
    imagePath: Img_plot,
  },
  {
    name: "Almgård",
    manufacturer: "BoligPartner",
    description: "Herskapelige Almgaard er en drømmebolig for familien",
    area: 233,
    bedrooms: 5,
    bathrooms: 3,
    price: 8300000,
    currency: "NOK",
    imagePath: Img_plot_image1,
  },
  {
    name: "Utsyn",
    manufacturer: "Mesterhus",
    description: "Kompakte og moderne Utsyn med utebod",
    area: 201,
    bedrooms: 5,
    bathrooms: 2,
    price: 7350000,
    currency: "NOK",
    imagePath: Img_plot,
  },
];

const HomePageSearchTab: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("beløp");
  const [HouseModelProperty, setHouseModelProperty] = useState([]);
  const [BelopProperty, setBelopProperty] = useState([]);
  const [MatrikelProperty, setMatrikelProperty] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMatrikelPropertyLoading, setIsMatrikelPropertyLoading] =
    useState(false);

  function formatPrice(price: any) {
    const formatted = price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return formatted + " NOK";
  }

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      setIsMatrikelPropertyLoading(true);

      try {
        const db = getFirestore();
        const citiesSnapshot = await getDocs(collection(db, "cities"));

        const fetchedCities = citiesSnapshot.docs.map((doc) => doc.data());

        const filterProperty = fetchedCities.find(
          (property) => property.name === "Akershus"
        );

        if (filterProperty && filterProperty.kommunenummer) {
          const kommuneNumbers = Object.values(filterProperty.kommunenummer)
            .map((value: any) =>
              typeof value === "string"
                ? value.replace(/"/g, "")
                : value.toString()
            )
            .map((value) => parseInt(value, 10))
            .filter((num) => !isNaN(num));

          if (kommuneNumbers.length > 0) {
            const allPlots: any = [];
            const chunkSize = 10;

            for (let i = 0; i < kommuneNumbers.length; i += chunkSize) {
              const chunk = kommuneNumbers.slice(i, i + chunkSize);
              const q = query(
                collection(db, "empty_plot"),
                where(
                  "lamdaDataFromApi.searchParameters.kommunenummer",
                  "in",
                  chunk
                )
              );
              const querySnapshot = await getDocs(q);

              querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.CadastreDataFromApi?.presentationAddressApi) {
                  allPlots.push({ id: doc.id, ...data });
                }
              });
            }

            setHouseModelProperty(allPlots.slice(0, 3));
          }
        } else {
          setHouseModelProperty([]);
        }

        const kommuneNumbersForMatrikel = fetchedCities
          .filter((property) => property.name && property.kommunenummer)
          .flatMap((property) =>
            Object.values(property.kommunenummer)
              .map((value: any) =>
                typeof value === "string"
                  ? value.replace(/"/g, "")
                  : value.toString()
              )
              .map((value) => parseInt(value, 10))
              .filter((num) => !isNaN(num))
          );

        if (kommuneNumbersForMatrikel.length > 0) {
          const allMatrikelPlots: any = [];
          const chunkSize = 10;

          for (
            let i = 0;
            i < kommuneNumbersForMatrikel.length;
            i += chunkSize
          ) {
            const chunk = kommuneNumbersForMatrikel.slice(i, i + chunkSize);
            const querySnapshot = await getDocs(
              query(
                collection(db, "empty_plot"),
                where(
                  "CadastreDataFromApi.presentationAddressApi.response.item.municipality.municipalityName",
                  "==",
                  "ASKER"
                ),
                where(
                  "lamdaDataFromApi.searchParameters.kommunenummer",
                  "in",
                  chunk
                ),
                limit(3)
              )
            );

            querySnapshot.forEach((doc) => {
              const data = doc.data();
              if (data.CadastreDataFromApi?.presentationAddressApi) {
                allMatrikelPlots.push({ id: doc.id, ...data });
              }
            });
          }

          setMatrikelProperty(allMatrikelPlots);
        } else {
          setMatrikelProperty([]);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        setHouseModelProperty([]);
        setMatrikelProperty([]);
      } finally {
        setIsLoading(false);
        setIsMatrikelPropertyLoading(false);
      }
    };

    fetchProperty();
  }, [db]);

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);

      try {
        const db = getFirestore();
        const citiesSnapshot = await getDocs(collection(db, "cities"));

        const fetchedCities = citiesSnapshot.docs.map((doc) => doc.data());

        const filterProperty = fetchedCities.find(
          (property) => property.name === "Akershus"
        );

        if (filterProperty && filterProperty.kommunenummer) {
          const kommuneNumbers = Object.values(filterProperty.kommunenummer)
            .map((value: any) =>
              typeof value === "string"
                ? value.replace(/"/g, "")
                : value.toString()
            )
            .map((value) => parseInt(value, 10))
            .filter((num) => !isNaN(num));

          const husmodellRef = collection(db, "house_model");
          const q2 = query(husmodellRef);
          const querySnapshot2 = await getDocs(q2);
          const allHusmodell: any[] = [];

          querySnapshot2.forEach((doc) => {
            const data = doc.data();
            allHusmodell.push({ id: doc.id, ...data });
          });

          const filteredHusmodell = allHusmodell.filter((plot: any) =>
            parseInt(plot?.Husdetaljer?.pris.replace(/\s/g, ""), 10)
          );

          if (kommuneNumbers.length > 0) {
            const allPlots: any = [];
            const chunkSize = 10;

            for (let i = 0; i < kommuneNumbers.length; i += chunkSize) {
              const chunk = kommuneNumbers.slice(i, i + chunkSize);
              const q = query(
                collection(db, "empty_plot"),
                where(
                  "lamdaDataFromApi.searchParameters.kommunenummer",
                  "in",
                  chunk
                )
              );
              const querySnapshot = await getDocs(q);

              querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.CadastreDataFromApi?.presentationAddressApi) {
                  allPlots.push({ id: doc.id, ...data });
                }
              });
            }

            const combinedData: any = [];
            allPlots.forEach((plot: any) => {
              filteredHusmodell.forEach((house) => {
                combinedData.push({
                  plot,
                  house,
                });
              });
            });

            setBelopProperty(combinedData.slice(0, 3));
          }
        } else {
          setBelopProperty([]);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        setBelopProperty([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [db]);

  const [supplierData, setSupplierData] = useState<{ [key: string]: any }>({});

  const getData = async (supplierId: string) => {
    try {
      const supplierDocRef = doc(db, "suppliers", supplierId);
      const docSnap: any = await getDoc(supplierDocRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.error("No document found for ID:", supplierId);
      }
    } catch (error) {
      console.error("Error fetching supplier data:", error);
    }
  };

  useEffect(() => {
    const fetchSupplierDetails = async () => {
      const supplierMap: { [key: string]: any } = {};

      await Promise.all(
        BelopProperty.map(async (property: any) => {
          const supplierId = property?.house?.Husdetaljer?.Leverandører;
          if (supplierId && !supplierMap[supplierId]) {
            supplierMap[supplierId] = await getData(supplierId);
          }
        })
      );

      setSupplierData(supplierMap);
    };

    fetchSupplierDetails();
  }, [BelopProperty]);
  return (
    <>
      <div className="relative">
        <SideSpaceContainer>
          <div
            className="w-full flex flex-col justify-center items-center mb-[40px] md:mb-[52px] lg:mb-[68px] py-4 px-3 lg:p-8 border border-[#EFF1F5] rounded-[8px] md:rounded-[12px] bg-white relative"
            style={{
              zIndex: 999,
              boxShadow:
                "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
            }}
          >
            <div className="flex justify-center gap-2 md:gap-[40px] items-center border-b border-[#EFF1F5] mb-5 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`pb-3 text-xs md:text-sm border-b-[4px] font-base transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-[#6941C6] text-blue"
                      : "border-transparent text-grayText"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label[0]}{" "}
                  <span className="font-semibold">{tab.label[1]}</span>
                </button>
              ))}
            </div>

            <div className="w-full">
              {activeTab === "beløp" && <BeløpTab />}
              {activeTab === "adresse" && <AdresseTab />}
              {activeTab === "husmodell" && <HusmodellTab />}
              {activeTab === "matrikkel" && <MatrikkelTab />}
            </div>
          </div>
          <div
            className="absolute lg:-bottom-9 desktop:-bottom-14 big:bottom-[-100px] left-0 w-full hidden lg:block"
            style={{ zIndex: 9 }}
          >
            <Image
              src={Img_main_bg}
              alt="image"
              className="w-full"
              fetchPriority="auto"
            />
          </div>
        </SideSpaceContainer>
      </div>
      <div className={`${activeTab === "beløp" ? "block" : "hidden"}`}>
        <SideSpaceContainer>
          <h2 className="text-black text-[24px] md:text-[28px] lg:text-[32px] desktop:text-[48px] desktop:leading-[56px] mb-5 lg:mb-[20px] text-center desktop:tracking-[-1px] md:mb-[32px] desktop:mb-[40px]">
            Populære kombinasjoner i{" "}
            <span className="font-bold text-blue">Akershus</span>
          </h2>
          {isLoading ? (
            <div className="relative">
              <Loading />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {BelopProperty.map((property: any, index) => {
                const supplierId = property?.house?.Husdetaljer?.Leverandører;
                const data = supplierData[supplierId] || null;

                return (
                  <div
                    key={index}
                    className="border border-[#EFF1F5] rounded-[8px] p-5"
                    style={{
                      boxShadow:
                        "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
                    }}
                  >
                    <h4 className="text-[#111322] text-sm md:text-base lg:text-lg lg:leading-[30px] two_line_elipse">
                      <span className="font-bold">
                        {property?.house?.Husdetaljer?.husmodell_name}
                      </span>{" "}
                      bygget i{" "}
                      <span className="font-bold">
                        {
                          property?.plot?.CadastreDataFromApi
                            ?.presentationAddressApi?.response?.item?.formatted
                            ?.line1
                        }
                      </span>{" "}
                    </h4>
                    <div className="text-[#10182899] mb-2 text-sm md:text-base lg:text-lg lg:leading-[30px]">
                      (
                      {
                        property?.plot?.CadastreDataFromApi
                          ?.presentationAddressApi?.response?.item?.street
                          ?.municipality?.municipalityName
                      }
                      )
                    </div>
                    <p className="text-grayText text-xs md:text-sm mb-2 md:mb-3 desktop:mb-4">
                      {
                        property?.plot?.CadastreDataFromApi
                          ?.presentationAddressApi?.response?.item?.formatted
                          ?.line2
                      }
                    </p>
                    <div className="flex gap-2 mb-2 md:mb-3 desktop:mb-4 h-[185px]">
                      <div className="w-[63%] relative">
                        <img
                          src={property?.house?.Husdetaljer?.photo}
                          alt="husmodell"
                          className="w-full h-full rounded-[8px] object-cover"
                        />
                        <img
                          src={data?.photo}
                          alt="product-logo"
                          className="absolute top-[12px] left-[12px] bg-[#FFFFFFB2] py-2 px-3 flex items-center justify-center rounded-[32px] w-[107px]"
                        />
                      </div>
                      <div className="w-[37%] rounded-[8px] overflow-hidden h-full">
                        <GoogleMapComponent
                          coordinates={
                            property?.plot?.lamdaDataFromApi?.coordinates
                              ?.convertedCoordinates
                          }
                        />
                      </div>
                    </div>
                    <h5 className="text-[#111322] font-medium text-sm md:text-base mb-2">
                      {property.description}
                    </h5>
                    <div className="flex gap-3 items-center">
                      <div className="text-[#111322] text-xs md:text-sm font-semibold">
                        {
                          property?.plot?.lamdaDataFromApi?.eiendomsInformasjon
                            ?.basisInformasjon?.areal_beregnet
                        }{" "}
                        <span className="text-[#4A5578] font-normal">m²</span>
                      </div>
                      <div className="border-l border-[#EAECF0] h-[12px]"></div>
                      <div className="text-[#111322] text-xs md:text-sm font-semibold">
                        {property?.house?.Husdetaljer?.Soverom}{" "}
                        <span className="text-[#4A5578] font-normal">
                          soverom
                        </span>
                      </div>
                      <div className="border-l border-[#EAECF0] h-[12px]"></div>
                      <div className="text-[#111322] text-xs md:text-sm font-semibold">
                        {property?.house?.Husdetaljer?.Bad}{" "}
                        <span className="text-[#4A5578] font-normal">bad</span>
                      </div>
                    </div>
                    <div className="border-t border-[#EAECF0] w-full my-2 md:my-3 desktop:my-4"></div>
                    <div className="gap-4 md:gap-5 lg:gap-6 flex items-center mb-2 md:mb-3 desktop:mb-4">
                      <div className="w-1/2">
                        <p className="text-[#4A5578] text-xs md:text-sm mb-1 truncate">
                          Pris for{" "}
                          <span className="font-semibold">
                            {property?.house?.Husdetaljer?.husmodell_name}
                          </span>
                        </p>
                        <h6 className="text-xs md:text-sm font-semibold desktop:text-base">
                          {property?.house?.Husdetaljer?.pris
                            ? formatPrice(
                                Math.round(
                                  property?.house?.Husdetaljer?.pris.replace(
                                    /\s/g,
                                    ""
                                  )
                                )
                              )
                            : "0 NOK"}
                        </h6>
                      </div>
                      <div className="w-1/2">
                        <p className="text-[#4A5578] text-xs md:text-sm mb-1">
                          Pris for <span className="font-semibold">tomten</span>
                        </p>
                        <h6 className="text-xs md:text-sm font-semibold desktop:text-base">
                          {property?.plot?.pris
                            ? formatPrice(Math.round(property?.plot?.pris))
                            : "0 NOK"}
                        </h6>
                      </div>
                    </div>
                    <div className="gap-4 md:gap-5 lg:gap-6 flex items-center justify-between">
                      <div>
                        <p className="text-[#4A5578] text-xs md:text-sm mb-1">
                          Totalpris med tomt
                        </p>
                        <h6 className="text-sm md:text-base font-semibold desktop:text-xl">
                          {formatPrice(
                            (property?.house?.Husdetaljer?.pris
                              ? Math.round(
                                  property?.house?.Husdetaljer?.pris.replace(
                                    /\s/g,
                                    ""
                                  )
                                )
                              : 0) +
                              (property?.plot?.pris
                                ? Math.round(property?.plot?.pris)
                                : 0)
                          )}
                        </h6>
                      </div>
                      <Button
                        text="Utforsk"
                        className="border border-[#6941C6] bg-[#6941C6] text-white sm:text-base rounded-[50px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                        onClick={() => {
                          router.push(
                            `husmodell-plot-view?plot=${property?.plot?.id}&&husmodell=${property?.house?.id}`
                          );
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SideSpaceContainer>
      </div>
      <div className={`${activeTab === "adresse" ? "block" : "hidden"}`}>
        <SideSpaceContainer>
          <h2 className="text-black text-[24px] md:text-[28px] lg:text-[32px] desktop:text-[48px] desktop:leading-[56px] mb-5 lg:mb-[20px] text-center desktop:tracking-[-1px] md:mb-[32px] desktop:mb-[40px]">
            Populære tomter i{" "}
            <span className="font-bold text-blue">Akershus</span>
          </h2>
          {isLoading ? (
            <div className="relative">
              <Loading />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {HouseModelProperty.map((property: any, index) => (
                <div
                  key={index}
                  className="border border-[#EFF1F5] rounded-[8px] p-5"
                  style={{
                    boxShadow:
                      "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
                  }}
                >
                  <h4 className="text-[#111322] text-sm md:text-base lg:text-lg lg:leading-[30px] mb-2 font-bold">
                    {
                      property?.CadastreDataFromApi?.presentationAddressApi
                        ?.response?.item?.formatted?.line1
                    }
                  </h4>
                  <p className="text-grayText text-xs md:text-sm mb-2 md:mb-3 desktop:mb-4">
                    {
                      property?.CadastreDataFromApi?.presentationAddressApi
                        ?.response?.item?.formatted?.line2
                    }
                  </p>
                  <div className="relative mb-2 md:mb-3 desktop:mb-4">
                    <div className="w-full h-[234px] rounded-[8px] overflow-hidden">
                      <GoogleMapComponent
                        coordinates={
                          property?.lamdaDataFromApi?.coordinates
                            ?.convertedCoordinates
                        }
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="text-[#111322] text-xs md:text-sm font-semibold">
                      {
                        property?.lamdaDataFromApi?.eiendomsInformasjon
                          ?.basisInformasjon?.areal_beregnet
                      }{" "}
                      <span className="text-[#4A5578] font-normal">m²</span>
                    </div>
                    <div className="border-l border-[#EAECF0] h-[12px]"></div>
                    <div className="text-[#111322] text-xs md:text-sm font-semibold">
                      {
                        property?.additionalData?.answer?.bya_calculations
                          ?.input?.bya_percentage
                      }
                      % <span className="text-[#4A5578] font-normal">BYA</span>
                    </div>
                  </div>
                  <div className="border-t border-[#EAECF0] w-full my-2 md:my-3 desktop:my-4"></div>
                  <div className="gap-4 md:gap-5 lg:gap-6 flex items-center justify-between">
                    <div>
                      <p className="text-[#4A5578] text-xs md:text-sm mb-1">
                        Tilbudpris
                      </p>
                      <h6 className="text-sm md:text-base font-semibold desktop:text-xl">
                        {property.pris ? formatPrice(property.pris) : 0}
                      </h6>
                    </div>
                    <Button
                      text="Utforsk"
                      className="border border-[#6941C6] bg-[#6941C6] text-white sm:text-base rounded-[50px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SideSpaceContainer>
      </div>
      <div className={`${activeTab === "husmodell" ? "block" : "hidden"}`}>
        <SideSpaceContainer>
          <h2 className="text-black text-[24px] md:text-[28px] lg:text-[32px] desktop:text-[48px] desktop:leading-[56px] mb-5 lg:mb-[20px] text-center desktop:tracking-[-1px] md:mb-[32px] desktop:mb-[40px]">
            Populære husmodeller i{" "}
            <span className="font-bold text-blue">Asker</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {husmodellProperties.map((property, index) => (
              <div
                key={index}
                className="border border-[#EFF1F5] rounded-[8px] p-5"
                style={{
                  boxShadow:
                    "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
                }}
              >
                <h4 className="text-[#111322] text-sm md:text-base lg:text-lg lg:leading-[30px] mb-3">
                  <span className="font-bold">{property.name}</span> fra{" "}
                  <span className="font-bold">{property.manufacturer}</span>
                </h4>
                <Image
                  src={property.imagePath}
                  alt="image"
                  className="w-full h-[374px] rounded-[8px] mb-2 md:mb-3 desktop:mb-4"
                  fetchPriority="auto"
                />
                <h5 className="text-[#111322] font-medium text-sm md:text-base mb-2">
                  {property.description}
                </h5>
                <div className="flex gap-3 items-center">
                  <div className="text-[#111322] text-xs md:text-sm font-semibold">
                    {property.area}{" "}
                    <span className="text-[#4A5578] font-normal">m²</span>
                  </div>
                  <div className="border-l border-[#EAECF0] h-[12px]"></div>
                  <div className="text-[#111322] text-xs md:text-sm font-semibold">
                    {property.bedrooms}{" "}
                    <span className="text-[#4A5578] font-normal">BYA</span>
                  </div>
                  <div className="border-l border-[#EAECF0] h-[12px]"></div>
                  <div className="text-[#111322] text-xs md:text-sm font-semibold">
                    {property.bathrooms}{" "}
                    <span className="text-[#4A5578] font-normal">bad</span>
                  </div>
                </div>
                <div className="border-t border-[#EAECF0] w-full my-2 md:my-3 desktop:my-4"></div>
                <div className="gap-4 md:gap-5 lg:gap-6 flex items-center justify-between">
                  <div>
                    <p className="text-[#4A5578] text-xs md:text-sm mb-1">
                      Pris for{" "}
                      <span className="font-semibold">{property.name}</span>
                    </p>
                    <h6 className="text-sm md:text-base font-semibold desktop:text-xl">
                      {property.price ? formatPrice(property.price) : 0}
                    </h6>
                  </div>
                  <Button
                    text="Utforsk"
                    className="border border-[#6941C6] bg-[#6941C6] text-white sm:text-base rounded-[50px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </SideSpaceContainer>
      </div>
      <div className={`${activeTab === "matrikkel" ? "block" : "hidden"}`}>
        <SideSpaceContainer>
          <h2 className="text-black text-[24px] md:text-[28px] lg:text-[32px] desktop:text-[48px] desktop:leading-[56px] mb-5 lg:mb-[20px] text-center desktop:tracking-[-1px] md:mb-[32px] desktop:mb-[40px]">
            Populære tomter i <span className="font-bold text-blue">Asker</span>
          </h2>
          {isMatrikelPropertyLoading ? (
            <div className="relative">
              <Loading />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {MatrikelProperty.map((property: any, index) => (
                <div
                  key={index}
                  className="border border-[#EFF1F5] rounded-[8px] p-5"
                  style={{
                    boxShadow:
                      "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
                  }}
                >
                  <h4 className="text-[#111322] text-sm md:text-base lg:text-lg lg:leading-[30px] mb-2 font-bold">
                    {
                      property?.CadastreDataFromApi?.presentationAddressApi
                        ?.response?.item?.formatted?.line1
                    }
                  </h4>
                  <p className="text-grayText text-xs md:text-sm mb-2 md:mb-3 desktop:mb-4">
                    {
                      property?.CadastreDataFromApi?.presentationAddressApi
                        ?.response?.item?.formatted?.line2
                    }
                  </p>
                  <div className="relative mb-2 md:mb-3 desktop:mb-4">
                    <div className="w-full h-[234px] rounded-[8px] overflow-hidden">
                      <GoogleMapComponent
                        coordinates={
                          property?.lamdaDataFromApi?.coordinates
                            ?.convertedCoordinates
                        }
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="text-[#111322] text-xs md:text-sm font-semibold">
                      {
                        property?.lamdaDataFromApi?.eiendomsInformasjon
                          ?.basisInformasjon?.areal_beregnet
                      }{" "}
                      <span className="text-[#4A5578] font-normal">m²</span>
                    </div>
                    <div className="border-l border-[#EAECF0] h-[12px]"></div>
                    <div className="text-[#111322] text-xs md:text-sm font-semibold">
                      {
                        property?.additionalData?.answer?.bya_calculations
                          ?.input?.bya_percentage
                      }
                      % <span className="text-[#4A5578] font-normal">BYA</span>
                    </div>
                  </div>
                  <div className="border-t border-[#EAECF0] w-full my-2 md:my-3 desktop:my-4"></div>
                  <div className="gap-4 md:gap-5 lg:gap-6 flex items-center justify-between">
                    <div>
                      <p className="text-[#4A5578] text-xs md:text-sm mb-1">
                        Tilbudpris
                      </p>
                      <h6 className="text-sm md:text-base font-semibold desktop:text-xl">
                        {property.pris ? formatPrice(property.pris) : 0}
                      </h6>
                    </div>
                    <Button
                      text="Utforsk"
                      className="border border-[#6941C6] bg-[#6941C6] text-white sm:text-base rounded-[50px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                      onClick={() => {
                        const lamdaDataFromApi = property.lamdaDataFromApi;
                        router.push(
                          `/regulations?kommunenummer=${lamdaDataFromApi.searchParameters.kommunenummer}&gardsnummer=${lamdaDataFromApi.searchParameters.gardsnummer}&bruksnummer=${lamdaDataFromApi.searchParameters.bruksnummer}`
                        );
                        const currIndex = 0;
                        localStorage.setItem("currIndex", currIndex.toString());
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default HomePageSearchTab;
