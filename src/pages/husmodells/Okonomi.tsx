import React, { useEffect, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Image from "next/image";
import Button from "@/components/common/button";
import PropertyDetailWithPrice from "@/components/Ui/stepperUi/productDetailWithPrice";
import Ic_info_circle from "@/public/images/Ic_info_circle.svg";
import ContactForm from "@/components/Ui/stepperUi/contactForm";
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
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
const Okonomi: React.FC<any> = ({ handleNext, handlePrevious }) => {
  const router = useRouter();

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

  return (
    <div className="relative">
      {loading ? (
        <Loader />
      ) : (
        <>
          <SideSpaceContainer>
            <div className="pt-[24px] pb-[147px]">
              <Illustrasjoner />
              <h3 className="text-black text-2xl font-semibold my-6">
                Økonomisk plan og detaljer
              </h3>
              <div className="mb-[40px]">
                <PropertyDetailWithPrice />
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
                  <ContactForm leadId={leadId} />
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
                  text="Søk finansiering"
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

export default Okonomi;
