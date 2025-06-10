import React, { useEffect } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Button from "@/components/common/button";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";
import Link from "next/link";
import Image from "next/image";
import HouseDetailsection from "@/components/Ui/houseDetail/houseDetailSection";
import HouseDetailPage from "@/components/Ui/houseDetail";
import PropertyHouseDetails from "@/components/Ui/husmodellPlot/PropertyHouseDetails";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

const HusmodellDetail: React.FC<{
  handleNext: any;
  HouseModelData: any;
  loading: any;
  pris: any;
  lamdaDataFromApi: any;
  supplierData: any;
  user: any;
}> = ({
  handleNext,
  HouseModelData,
  loading,
  pris,
  lamdaDataFromApi,
  supplierData,
  user,
}) => {
  const router = useRouter();

  const id = router.query["husmodellId"];

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const queryParams = new URLSearchParams(window.location.search);
      const currentLeadId = queryParams.get("leadId");
      queryParams.delete("leadId");

      try {
        const [husmodellDocSnap] = await Promise.all([
          getDoc(doc(db, "house_model", String(id))),
        ]);

        const finalData = {
          husmodell: { id: String(id), ...husmodellDocSnap.data() },
          plot: null,
        };

        // const leadsQuerySnapshot: any = await getDocs(
        //   query(
        //     collection(db, "leads"),
        //     where("finalData.husmodell.id", "==", String(id)),
        //     where("finalData.plot", "==", null)
        //   )
        // );

        let leadsQueryRef = query(
          collection(db, "leads"),
          where("finalData.husmodell.id", "==", String(id)),
          where("finalData.plot", "==", null)
        );

        if (user?.id) {
          leadsQueryRef = query(leadsQueryRef, where("user.id", "==", user.id));
        }

        const leadsQuerySnapshot: any = await getDocs(leadsQueryRef);
        if (!leadsQuerySnapshot.empty) {
          const existingLeadId = leadsQuerySnapshot.docs[0].id;
          await updateDoc(doc(db, "leads", existingLeadId), {
            updatedAt: new Date(),
          });

          if (currentLeadId !== existingLeadId) {
            queryParams.set("leadId", existingLeadId);
            router.replace({
              pathname: router.pathname,
              query: Object.fromEntries(queryParams),
            });
          }
          return;
        }

        const newDocRef = await addDoc(collection(db, "leads"), {
          finalData,
          ...(user && { user }),
          Isopt: false,
          IsoptForBank: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        queryParams.set("leadId", newDocRef.id);
        router.replace({
          pathname: router.pathname,
          query: Object.fromEntries(queryParams),
        });
      } catch (error) {
        console.error("Firestore operation failed:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, user]);

  return (
    <>
      <div className="relative">
        <div className="bg-lightBlue py-2 md:py-4">
          <SideSpaceContainer>
            <div className="flex items-center flex-wrap gap-1 mb-4 md:mb-6">
              <Link
                href={"/"}
                className="text-primary text-xs md:text-sm font-bold"
              >
                Hjem
              </Link>
              <Image src={Ic_breadcrumb_arrow} alt="arrow" />
              <span className="text-secondary2 text-xs md:text-sm">
                Hyttemodell
              </span>
            </div>
            <PropertyHouseDetails
              HouseModelData={HouseModelData}
              lamdaDataFromApi={lamdaDataFromApi}
              supplierData={supplierData}
              pris={pris}
              loading={loading}
            />
          </SideSpaceContainer>
        </div>
        <HouseDetailsection HouseModelData={HouseModelData} loading={loading} />
        <SideSpaceContainer className="relative pt-[38px]">
          <HouseDetailPage />
        </SideSpaceContainer>
        <div
          className="sticky bottom-0 bg-white py-4"
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
                className="border-2 border-primary text-primary hover:border-[#1E5F5C] hover:text-[#1E5F5C] focus:border-[#003A37] focus:text-[#003A37] sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[46px] relative desktop:py-[16px]"
                onClick={() => {
                  const router_query: any = { ...router.query };

                  delete router_query.husmodellId;
                  delete router_query.leadId;

                  router.push(
                    {
                      pathname: router.pathname,
                      query: router_query,
                    },
                    undefined,
                    { shallow: true }
                  );
                }}
              />
              <Button
                text={`Tilpass ${HouseModelData?.Husdetaljer?.husmodell_name} her`}
                className="border border-primary bg-primary hover:bg-[#1E5F5C] hover:border-[#1E5F5C] focus:bg-[#003A37] focus:border-[#003A37] text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                onClick={() => {
                  handleNext();
                }}
              />
            </div>
          </SideSpaceContainer>
        </div>
      </div>
    </>
  );
};

export default HusmodellDetail;
