import React, { useEffect, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import HomePageSearchTab from "@/components/Ui/homePageSearchTab";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import Loading from "@/components/Loading";

const MainSection = () => {
  const [Cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      const citiesCollectionRef = collection(db, "cities");

      try {
        const citiesSnapshot = await getDocs(citiesCollectionRef);
        const fetchedProperties: any = citiesSnapshot.docs.map((doc) => ({
          propertyId: doc.id,
          ...doc.data(),
        }));

        setCities(fetchedProperties);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [db]);
  return (
    <>
      <div
        className="py-[44px] md:py-[52px] desktop:py-[60px] overflow-hidden relative"
        style={{ zIndex: 999 }}
      >
        <SideSpaceContainer className="relative">
          <div className="mb-[40px] flex flex-col justify-center items-center">
            <h1 className="text-purple text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] desktop:text-[52px] big:text-[60px] font-semibold leading-tight text-center mb-3 md:mb-4 desktop:mb-5">
              Bygg ditt drømmehus <br />
              <span className="text-black">trygt og enkelt</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl big:text-2xl text-secondary text-center">
              Få umiddelbar tomteanalyse og oppdag hva du kan bygge.
            </p>
          </div>
        </SideSpaceContainer>
        <HomePageSearchTab />
      </div>
      <div className="bg-gray3 py-[60px]">
        <SideSpaceContainer>
          {isLoading ? (
            <div className="relative">
              <Loading />
            </div>
          ) : (
            <div className="flex items-start gap-5">
              <h5 className="text-[#101828] font-semibold text-sm md:text-base">
                Tomte<span className="text-[#6941C6]">Banken</span>:
              </h5>
              <div className="flex gap-3 flex-wrap">
                {Cities.map((city: any, index) => (
                  <div
                    key={index}
                    className="border border-[#D6BBFB] rounded-[50px] text-sm py-[6px] px-3"
                  >
                    <span className="text-[#101828]">{city?.name}</span>{" "}
                    <span className="text-[#667085]">
                      ({city?.total_entries})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default MainSection;
