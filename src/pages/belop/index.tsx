import SideSpaceContainer from "@/components/common/sideSpace";
import BelopFilterSection from "./belopFilterSection";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import BelopProperty from "./belopProperty";
import { useRouter } from "next/router";
import Button from "@/components/common/button";

const Belop: React.FC = () => {
  const router = useRouter();
  const [HouseModelProperty, setHouseModelProperty] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    Eiendomstype: [] as string[],
    TypeHusmodell: [] as string[],
    AntallSoverom: [] as string[],
    minRangeForPlot: 100000,
    maxRangeForPlot: 5000000,
    minRangeForHusmodell: 1000,
    maxRangeForHusmodell: 5000000,
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    const queryPrice = queryParams.get("pris");
    setFormData((prev) => ({
      ...prev,
      maxRangeForPlot: Number(queryPrice) * 0.8,
      maxRangeForHusmodell: Number(queryPrice) * 0.2,
    }));
  }, []);

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
    const fetchProperty = async () => {
      setIsLoading(true);

      try {
        const db = getFirestore();
        const citiesCollectionRef = collection(db, "cities");
        const queryParams = new URLSearchParams(window.location.search);
        const queryPrice = String(formData.maxRangeForPlot);
        const cityQuery = queryParams.get("city");

        const citiesSnapshot = await getDocs(citiesCollectionRef);
        const fetchedCities = citiesSnapshot.docs.map((doc) => ({
          propertyId: doc.id,
          ...doc.data(),
        }));

        const filterProperty: any = cityQuery
          ? fetchedCities.find(
              (property: any) =>
                `${property.name} (${property.total_entries})` === cityQuery
            )
          : null;

        if (!filterProperty || !filterProperty.kommunenummer) {
          console.log("No valid city found or missing kommune numbers.");
          setHouseModelProperty([]);
          return;
        }

        const kommuneNumbers = Object.values(filterProperty.kommunenummer)
          .map((value: any) =>
            typeof value === "string"
              ? value.replace(/"/g, "")
              : value.toString()
          )
          .map((value) => parseInt(value, 10))
          .filter((num) => !isNaN(num));

        if (kommuneNumbers.length === 0) {
          console.log("No kommune numbers found for this city.");
          setHouseModelProperty([]);
          return;
        }

        const plotsRef = collection(db, "empty_plot");
        const allPlots: any[] = [];
        const chunkSize = 10;

        for (let i = 0; i < kommuneNumbers.length; i += chunkSize) {
          const chunk = kommuneNumbers.slice(i, i + chunkSize);

          const q = query(
            plotsRef,
            where(
              "lamdaDataFromApi.searchParameters.kommunenummer",
              "in",
              chunk
            )
          );

          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            allPlots.push({
              id: doc.id,
              ...doc.data(),
            });
          });
        }

        const filteredPlots: any = queryPrice
          ? allPlots.filter((plot) => plot.pris <= parseInt(queryPrice, 10))
          : allPlots;

        setHouseModelProperty(filteredPlots);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setHouseModelProperty([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [db, formData, router.asPath]);

  return (
    <>
      <div className="relative pt-8">
        <SideSpaceContainer>
          <div className="flex items-end justify-between gap-4 mb-[40px]">
            <h3 className="text-[#111322] text-lg md:text-[24px] lg:text-[28px] desktop:text-[2rem] desktop:leading-[44.8px]">
              Kombinasjoner av <span className="font-bold">husmodell</span> og{" "}
              <span className="font-bold">tomt</span> i{" "}
              <span className="font-bold text-blue">Akershus</span>
            </h3>
            <p className="text-[#111322] text-sm md:text-base desktop:text-xl font-light">
              <span className="font-bold">{HouseModelProperty.length}</span>{" "}
              treff i <span className="font-bold">2 606</span> annonser
            </p>
          </div>
          <div className="flex gap-6 relative pb-[56px]">
            <div className="w-[35%]">
              <BelopFilterSection
                formData={formData}
                setFormData={setFormData}
              />
            </div>
            <div className="w-[65%]">
              <BelopProperty
                HouseModelProperty={HouseModelProperty}
                isLoading={isLoading}
              />
            </div>
          </div>
        </SideSpaceContainer>
        <div
          className="sticky bottom-0 bg-white p-6"
          style={{
            boxShadow:
              "0px -4px 6px -2px #10182808, 0px -12px 16px -4px #10182814",
          }}
        >
          <div className="flex justify-end items-center gap-6">
            <Button
              text="Tilbake"
              className="border-2 border-[#6941C6] bg-white text-[#6941C6] sm:text-base rounded-[50px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold desktop:px-[20px] relative desktop:py-[16px]"
            />
            <Button
              text="Neste"
              className="border border-[#6941C6] bg-[#6941C6] text-white sm:text-base rounded-[50px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[20px] desktop:py-[16px]"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Belop;
