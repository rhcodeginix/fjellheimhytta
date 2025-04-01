import React, { useEffect, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Image from "next/image";
import ContactForm from "@/components/Ui/stepperUi/contactForm";
import Button from "@/components/common/button";
import Ic_inside_Kjøkken from "@/public/images/Ic_inside_Kjøkken.svg";
import Ic_inside_Parkett from "@/public/images/Ic_inside_Parkett.svg";
import Ic_Tegning_og_byggesøknad from "@/public/images/Ic_Tegning_og_byggesøknad.svg";
import Ic_inside_VVS from "@/public/images/Ic_inside_VVS.svg";
import Ic_outside_elektro from "@/public/images/Ic_outside_elektro.svg";
import Ic_outside_garasje from "@/public/images/Ic_outside_garasje.svg";
import Ic_Tilbud_line from "@/public/images/Ic_Tilbud_line.svg";
import Ic_Graving_og_terrengarbeider from "@/public/images/Ic_Graving_og_terrengarbeider.svg";
import Ic_Betongarbeider from "@/public/images/Ic_Betongarbeider.svg";
import { useRouter } from "next/router";
import Illustrasjoner from "@/components/Ui/RegulationHusmodell/Illustrasjoner";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/config/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Loader from "@/components/Loader";
import { addDaysToDate } from "../husmodell-plot-view";

const Tilbud: React.FC<any> = ({ handleNext, handlePrevious }) => {
  const router = useRouter();

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("hasReloaded");

    if (!hasReloaded) {
      setTimeout(() => {
        window.location.reload();
        sessionStorage.setItem("hasReloaded", "true");
      }, 2);
    } else {
      sessionStorage.removeItem("hasReloaded");
    }
  }, []);

  const offerInclude = [
    {
      id: 1,
      imageSrc: Ic_inside_Parkett,
      title: "Almgaard",
      description: "BoligPartner",
    },
    {
      id: 2,
      imageSrc: Ic_inside_Kjøkken,
      title: "Kjøkken",
      description: "Drømmekjøkkenet",
    },
    {
      id: 3,
      imageSrc: Ic_outside_elektro,
      title: "Elektro",
      description: "Inkludert",
    },
    {
      id: 4,
      imageSrc: Ic_inside_VVS,
      title: "VVS",
      description: "Inkludert",
    },
    {
      id: 5,
      imageSrc: Ic_Betongarbeider,
      title: "Betongarbeider",
      description: "Inkludert",
    },
    {
      id: 6,
      imageSrc: Ic_Tegning_og_byggesøknad,
      title: "Tegning og byggesøknad",
      description: "Søknad uten dispenensjoner",
    },
  ];
  const outsideItems = [
    {
      id: 1,
      imageSrc: Ic_Graving_og_terrengarbeider,
      title: "Graving og terrengarbeider",
      description: "BoligPartner",
    },
    {
      id: 2,
      imageSrc: Ic_outside_garasje,
      title: "Tomt",
      description: "Pris fra",
    },
  ];
  const [plotId, setPlotId] = useState<string | null>(null);
  const [husmodellId, setHusmodellId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      setPlotId(queryParams.get("plotId"));
      setHusmodellId(queryParams.get("husodellId"));
    }
  }, []);
  const [finalData, setFinalData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const husmodellData = finalData?.husmodell?.Husdetaljer;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let plotCollectionRef = collection(db, "empty_plot");

        const plotDocRef = doc(plotCollectionRef, String(plotId));
        const plotDocSnap = await getDoc(plotDocRef);

        const husmodellDocRef = doc(db, "house_model", String(husmodellId));
        const husmodellDocSnap = await getDoc(husmodellDocRef);

        if (plotDocSnap.exists() && husmodellDocSnap.exists()) {
          let plotData = plotDocSnap.data();
          let husmodellData = husmodellDocSnap.data();
          setFinalData({
            plot: { id: plotId, ...plotData },
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
  }, [husmodellId, plotId]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUser(userData);
          } else {
            console.error("No such document in Firestore!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  const [leadId, setLeadId] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !plotId || !husmodellId) {
        return;
      }

      const queryParams = new URLSearchParams(window.location.search);
      const isEmptyPlot = queryParams.get("empty");
      queryParams.delete("leadId");

      try {
        let plotCollectionRef = collection(db, "empty_plot");

        const plotDocRef = doc(plotCollectionRef, plotId);
        const plotDocSnap = await getDoc(plotDocRef);

        const husmodellDocRef = doc(db, "house_model", husmodellId);
        const husmodellDocSnap = await getDoc(husmodellDocRef);

        const finalData = {
          plot: { id: plotId, ...plotDocSnap.data() },
          husmodell: { id: husmodellId, ...husmodellDocSnap.data() },
        };
        const leadsCollectionRef = collection(db, "leads");
        const querySnapshot: any = await getDocs(
          query(
            leadsCollectionRef,
            where("finalData.plot.id", "==", plotId),
            where("finalData.husmodell.id", "==", husmodellId)
          )
        );
        if (!querySnapshot.empty) {
          setLeadId(querySnapshot.docs[0].id);
          router.push(`${router.asPath}&leadId=${querySnapshot.docs[0].id}`);
          queryParams.set("leadId", querySnapshot.docs[0].id);
          router.replace({
            pathname: router.pathname,
            query: Object.fromEntries(queryParams),
          });
          return;
        }

        const docRef: any = await addDoc(leadsCollectionRef, {
          finalData,
          user,
          Isopt: false,
          IsoptForBank: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          IsEmptyPlot: isEmptyPlot === "true",
        });

        queryParams.set("leadId", querySnapshot.docs[0].id);
        router.replace({
          pathname: router.pathname,
          query: Object.fromEntries(queryParams),
        });
        setLeadId(docRef.id);
      } catch (error) {
        console.error("Firestore operation failed:", error);
      }
    };

    fetchData();
  }, [plotId, husmodellId, user, leadId]);
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
  const totalDays = [
    husmodellData?.signConractConstructionDrawing +
      husmodellData?.neighborNotification +
      husmodellData?.appSubmitApprove +
      husmodellData?.constuctionDayStart +
      husmodellData?.foundationWork +
      husmodellData?.concreteWork +
      husmodellData?.deliveryconstuctionKit +
      husmodellData?.denseConstuction +
      husmodellData?.completeInside +
      husmodellData?.preliminaryInspection +
      husmodellData?.takeOver,
  ].reduce((acc, curr) => acc + (curr || 0), 0);
  return (
    <div className="relative">
      {loading ? (
        <Loader />
      ) : (
        <>
          <SideSpaceContainer>
            <div className="pt-[24px] pb-[147px]">
              <Illustrasjoner />
              <h4 className="text-black mb-6 mt-8 font-semibold text-2xl">
                Tilbud
              </h4>
              <div className="w-full flex gap-[60px]">
                <div className="w-[43%]">
                  <div
                    style={{
                      boxShadow:
                        "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
                    }}
                    className="rounded-[8px] overflow-hidden mb-8"
                  >
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
                    <div className="p-6">
                      <h4 className="text-black mb-2 text-lg font-medium">
                        {husmodellData?.Hustittel}
                      </h4>
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
                    <div className="px-6 flex items-center gap-1 mb-5">
                      <div className="flex flex-col gap-1 w-max">
                        <p className="text-secondary text-sm whitespace-nowrap">
                          ESTIMERT BYGGESTART
                        </p>
                        <h5 className="text-black text-xl font-semibold whitespace-nowrap">
                          {addDaysToDate(
                            finalData?.husmodell?.createdAt,
                            husmodellData?.appSubmitApprove
                          )}
                        </h5>
                      </div>
                      <div className="w-full">
                        <Image
                          fetchPriority="auto"
                          src={Ic_Tilbud_line}
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
                    <div className="bg-lightPurple p-3">
                      <p className="text-base text-secondary text-center">
                        Tilbudpris
                      </p>
                      <h3 className="text-black font-semibold text-[32px] text-center">
                        8.300.000 NOK
                      </h3>
                      <div className="text-secondary text-base text-center">
                        Tilbudet er gyldig til{" "}
                        <span className="font-semibold text-black">
                          01.12.2024
                        </span>
                      </div>
                    </div>
                  </div>
                  <ContactForm leadId={leadId} />
                </div>
                <div className="w-[57%]">
                  <div>
                    <h2 className="text-black text-xl mb-6">
                      Ditt tilbud på Almgaard{" "}
                      <span className="font-semibold">(Almgaard)</span>{" "}
                      inkluderer
                    </h2>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {offerInclude.map((item) => (
                        <div
                          key={item.id}
                          className={`rounded-[8px] p-4 flex items-center gap-3`}
                        >
                          <Image
                            fetchPriority="auto"
                            src={item.imageSrc}
                            alt={item.title}
                            className="rounded-full overflow-hidden w-[80px] h-[80px]"
                          />
                          <div>
                            <h6 className="text-black font-medium text-lg mb-2">
                              {item.title}
                            </h6>
                            <h5 className="text-secondary text-sm">
                              {item.description}
                            </h5>
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
                          className={`rounded-[8px] p-4 flex items-center gap-3`}
                        >
                          <Image
                            fetchPriority="auto"
                            src={item.imageSrc}
                            alt={item.title}
                            className="rounded-full overflow-hidden w-[80px] h-[80px]"
                          />
                          <div>
                            <h6 className="text-black font-medium text-lg mb-2">
                              {item.title}
                            </h6>
                            <h5 className="text-secondary text-sm">
                              {item.description}
                            </h5>
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
                  className="border border-lightPurple bg-lightPurple text-blue sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[46px] relative desktop:py-[16px]"
                  onClick={() => {
                    handlePrevious();
                  }}
                />
                <Button
                  text="Se detaljer"
                  className="border border-primary bg-primary text-white sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                  onClick={() => {
                    handleNext();
                  }}
                />
              </div>
            </SideSpaceContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Tilbud;
