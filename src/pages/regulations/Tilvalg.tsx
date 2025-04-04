import React, { useEffect, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Image from "next/image";
import ContactForm from "@/components/Ui/stepperUi/contactForm";
import Button from "@/components/common/button";
import Ic_inside_Elektro from "@/public/images/Ic_inside_Elektro.svg";
import Ic_inside_Fliser from "@/public/images/Ic_inside_Fliser.svg";
import Ic_inside_Kjøkken from "@/public/images/Ic_inside_Kjøkken.svg";
import Ic_inside_Parkett from "@/public/images/Ic_inside_Parkett.svg";
import Ic_inside_peis from "@/public/images/Ic_inside_peis.svg";
import Ic_inside_Sparkel_Maling from "@/public/images/Ic_inside_Sparkel_Maling.svg";
import Ic_inside_trapp from "@/public/images/Ic_inside_trapp.svg";
import Ic_inside_VVS from "@/public/images/Ic_inside_VVS.svg";
import PropertyOptionDrawer from "@/components/Ui/drawer/product_option_drawer";
import { useRouter } from "next/router";
import Ic_outside_Anleggsgartner from "@/public/images/Ic_outside_Anleggsgartner.svg";
import Ic_outside_elektro from "@/public/images/Ic_outside_elektro.svg";
import Ic_outside_garasje from "@/public/images/Ic_outside_garasje.svg";
import Ic_outside_Maling from "@/public/images/Ic_outside_Maling.svg";
import Ic_outside_terrasse from "@/public/images/Ic_outside_terrasse.svg";
import Ic_outside_vvs from "@/public/images/Ic_outside_vvs.svg";
import Illustrasjoner, {
  formatCurrency,
} from "@/components/Ui/RegulationHusmodell/Illustrasjoner";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import Loader from "@/components/Loader";

const Tilvalg: React.FC<any> = ({ handleNext, handlePrevious }) => {
  const insideItems = [
    {
      id: 1,
      imageSrc: Ic_inside_Parkett,
      title: "Parkett",
      price: "18.900 NOK",
    },
    {
      id: 2,
      imageSrc: Ic_inside_Fliser,
      title: "Fliser",
      price: "19.899 NOK",
    },
    {
      id: 3,
      imageSrc: Ic_inside_Kjøkken,
      title: "Kjøkken",
      price: "97.000 NOK",
    },
    {
      id: 4,
      imageSrc: Ic_inside_Elektro,
      title: "Elektro",
      price: "899 NOK",
    },
    {
      id: 5,
      imageSrc: Ic_inside_Sparkel_Maling,
      title: "Sparkel & Maling",
      price: "4.900 NOK",
    },
    {
      id: 6,
      imageSrc: Ic_inside_VVS,
      title: "VVS",
      price: "750 NOK",
    },
    {
      id: 7,
      imageSrc: Ic_inside_peis,
      title: "Peis",
      price: "44.750 NOK",
    },
    {
      id: 8,
      imageSrc: Ic_inside_trapp,
      title: "Trapp",
      price: "75.000 NOK",
    },
  ];
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { query } = router;

  useEffect(() => {
    if (query.product_option) {
      setDrawerOpen(true);
    } else {
      setDrawerOpen(false);
    }
  }, [query.product_option]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const outsideItems = [
    {
      id: 1,
      imageSrc: Ic_outside_Maling,
      title: "Maling",
      price: "7.490 NOK",
    },
    {
      id: 2,
      imageSrc: Ic_outside_garasje,
      title: "Garasje",
      price: "295.899 NOK",
    },
    {
      id: 3,
      imageSrc: Ic_outside_terrasse,
      title: "Terrasse",
      price: "41.000 NOK",
    },
    {
      id: 4,
      imageSrc: Ic_outside_elektro,
      title: "Elektro",
      price: "1.899 NOK",
    },
    {
      id: 5,
      imageSrc: Ic_outside_Anleggsgartner,
      title: "Anleggsgartner",
      price: "950 NOK",
    },
    {
      id: 6,
      imageSrc: Ic_outside_vvs,
      title: "VVS",
      price: "1.390 NOK",
    },
  ];
  const id = router.query["husodellId"];
  const leadId = router.query["leadId"];

  const [finalData, setFinalData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const husmodellDocRef = doc(db, "house_model", String(id));
        const husmodellDocSnap = await getDoc(husmodellDocRef);

        if (husmodellDocSnap.exists()) {
          setFinalData(husmodellDocSnap.data());
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
  }, [id]);
  const husmodellData = finalData?.Husdetaljer;

  const [supplierData, setSupplierData] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const supplierDocRef = doc(
          db,
          "suppliers",
          husmodellData?.Leverandører
        );
        const docSnap: any = await getDoc(supplierDocRef);

        if (docSnap.exists()) {
          setSupplierData(docSnap.data());
        } else {
          console.error(
            "No document found for ID:",
            husmodellData?.Leverandører
          );
        }
      } catch (error) {
        console.error("Error fetching supplier data:", error);
      }
    };
    getData();
  }, [husmodellData?.Leverandører]);
  return (
    <div className="relative">
      {loading ? (
        <Loader />
      ) : (
        <>
          <SideSpaceContainer>
            <div className="pt-[24px] pb-[147px]">
              <Illustrasjoner />
              <div className="w-full flex gap-[60px] mt-8">
                <div className="w-[43%]">
                  <h4 className="text-black mb-6 font-semibold text-2xl">
                    Tilvalg
                  </h4>
                  <div className="relative">
                    <img
                      src={husmodellData?.photo}
                      alt="image"
                      className="w-full h-[262px] object-cover rounded-[12px] overflow-hidden"
                    />
                    <img
                      src={supplierData?.photo}
                      alt="image"
                      className="absolute top-[12px] left-[12px] bg-[#FFFFFFB2] py-2 px-3 flex items-center justify-center rounded-[32px] w-[130px]"
                    />
                  </div>
                  <h4 className="text-black my-[20px] text-lg font-medium">
                    {husmodellData?.Hustittel}
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <p className="text-secondary text-base">Pris fra</p>
                      <h4 className="text-xl font-semibold text-black">
                        {formatCurrency(husmodellData?.pris)}
                      </h4>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-secondary text-sm">
                        <span className="text-black font-semibold">
                          {husmodellData?.BRATotal}
                        </span>{" "}
                        m<sup>2</sup>
                      </div>
                      <div className="h-[12px] w-[1px] border-l border-gray"></div>
                      <div className="text-secondary text-sm">
                        <span className="text-black font-semibold">
                          {husmodellData?.Soverom}
                        </span>{" "}
                        soverom
                      </div>
                      <div className="h-[12px] w-[1px] border-l border-gray"></div>
                      <div className="text-secondary text-sm">
                        <span className="text-black font-semibold">
                          {husmodellData?.Bad}
                        </span>{" "}
                        bad
                      </div>
                    </div>
                  </div>
                  <div
                    className="my-8 rounded-[8px] p-6 flex flex-col gap-6"
                    style={{
                      boxShadow:
                        "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
                    }}
                  >
                    <div className="flex flex-col gap-4">
                      <h4 className="text-black font-semibold text-xl">
                        Dine tilvalg:
                      </h4>
                      <div className="flex items-center justify-between">
                        <div className="text-secondary text-base">Parkett</div>
                        <div className="text-black text-base font-semibold">
                          +18.900 NOK
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-secondary text-base">Fliser</div>
                        <div className="text-black text-base font-semibold">
                          +23.650 NOK
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-secondary text-base">Kjøkken</div>
                        <div className="text-black text-base font-semibold">
                          +123.650 NOK
                        </div>
                      </div>
                    </div>
                    <div className="border w-full border-t border-b-0 border-r-0 border-l-0 border-darkGray"></div>
                    <div className="flex items-center justify-between">
                      <div className="text-black text-base">
                        Foreløpig pris uten tomt
                      </div>
                      <div className="text-black text-xl font-semibold">
                        6.030.950 NOK
                      </div>
                    </div>
                  </div>
                  <ContactForm leadId={leadId} />
                </div>
                <div className="w-[57%]">
                  <div>
                    <h2 className="text-black text-xl font-semibold mb-6">
                      Her kan du gjøre dine tilvalg{" "}
                      <span className="font-extrabold">(innvendig)</span>
                    </h2>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {insideItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            toggleDrawer();
                            router.push(
                              `regulations?product_option=${item.title}`
                            );
                          }}
                          style={{
                            boxShadow:
                              "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
                          }}
                          className={`rounded-[8px] p-4 cursor-pointer flex items-center gap-3 border-2 ${router.query.product_option === item.title ? "border-purple" : "border-transparent"} `}
                        >
                          <Image
                            fetchPriority="auto"
                            src={item.imageSrc}
                            alt={item.title}
                            className="rounded-full overflow-hidden w-[60px] h-[60px]"
                          />
                          <div>
                            <h6 className="text-black font-medium text-lg mb-2">
                              {item.title}
                            </h6>
                            <div className="gap-4 flex items-center justify-between">
                              <p className="text-secondary text-sm">Pris fra</p>
                              <h5 className="text-black text-base font-semibold">
                                {item.price}
                              </h5>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-black text-xl font-semibold mb-6">
                      Her kan du gjøre dine tilvalg{" "}
                      <span className="font-extrabold">(utvendig)</span>
                    </h2>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {outsideItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            toggleDrawer();
                            router.push(
                              `regulations?product_option=${item.title}`
                            );
                          }}
                          style={{
                            boxShadow:
                              "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
                          }}
                          className={`rounded-[8px] p-4 cursor-pointer flex items-center gap-3 border-2 ${router.query.product_option === item.title ? "border-purple" : "border-transparent"} `}
                        >
                          <Image
                            fetchPriority="auto"
                            src={item.imageSrc}
                            alt={item.title}
                            className="rounded-full overflow-hidden w-[60px] h-[60px]"
                          />
                          <div>
                            <h6 className="text-black font-medium text-lg mb-2">
                              {item.title}
                            </h6>
                            <div className="gap-4 flex items-center justify-between">
                              <p className="text-secondary text-sm">Pris fra</p>
                              <h5 className="text-black text-base font-semibold">
                                {item.price}
                              </h5>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
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
                  className="border-2 border-[#6927DA] text-[#6927DA] sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[46px] relative desktop:py-[16px]"
                  onClick={() => {
                    handlePrevious();
                    router.push(router.asPath);
                  }}
                />
                <Button
                  text="Se tilbud"
                  className="border border-primary bg-primary text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                  onClick={() => {
                    handleNext();
                  }}
                />
              </div>
            </SideSpaceContainer>
          </div>

          {drawerOpen && (
            <PropertyOptionDrawer
              open={drawerOpen}
              setOpen={setDrawerOpen}
              route={router.asPath}
              // handleNext={handleNext}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Tilvalg;
