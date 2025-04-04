import SideSpaceContainer from "@/components/common/sideSpace";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { useRouter } from "next/router";
import Button from "@/components/common/button";
import PlotFilterSection from "./plotFilterSection";
import PlotProperty from "./plotProperty";

const Plots: React.FC<{
  handlePrevious: any;
  handleNext: any;
  HouseModelData: any;
}> = ({ handlePrevious, handleNext, HouseModelData }) => {
  const router: any = useRouter();
  const [HouseModelProperty, setHouseModelProperty] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { hasReload } = router.query;

  const [formData, setFormData] = useState({
    address: "",
    Eiendomstype: [] as string[],
    TypeHusmodell: [] as string[],
    minRangeForPlot: 0,
    maxRangeForPlot: 10000000,
  });

  useEffect(() => {
    if (hasReload) {
      const newQuery: any = { ...router.query };
      delete newQuery.hasReload;

      const newUrl = `${router.pathname}?${new URLSearchParams(newQuery).toString()}`;
      window.history.replaceState(null, "", newUrl);

      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }, [hasReload]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    const maxRangePlot = queryParams.get("maxRangePlot");
    const minRangePlot = queryParams.get("minRangePlot");

    setFormData((prev) => ({
      ...prev,
      maxRangeForPlot: maxRangePlot
        ? Number(maxRangePlot)
        : prev.maxRangeForPlot,
      minRangeForPlot: minRangePlot
        ? Number(minRangePlot)
        : prev.minRangeForPlot,
    }));
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams(window.location.search);

        const maxRangePlot: any = queryParams.get("maxRangePlot");
        const minRangePlot: any = queryParams.get("minRangePlot");

        const db = getFirestore();
        const citiesCollectionRef = collection(db, "cities");
        const cityQuery = queryParams.get("Kommue");
        const husodellId = queryParams.get("husodellId");
        const citiesSnapshot = await getDocs(citiesCollectionRef);
        const fetchedCities = citiesSnapshot.docs.map((doc) => ({
          propertyId: doc.id,
          ...doc.data(),
        }));

        const filterProperty: any = cityQuery
          ? fetchedCities.find((property: any) =>
              property.kommunerList.some(
                (kommune: any) => kommune.name === cityQuery
              )
            )
          : null;

        if (!filterProperty || !filterProperty.kommunenummer)
          return setHouseModelProperty([]);

        const kommuneNumbers = Object.values(filterProperty.kommunenummer)
          .map((value: any) =>
            parseInt(
              (typeof value === "string"
                ? value.replace(/"/g, "")
                : value
              ).toString(),
              10
            )
          )
          .filter((num) => !isNaN(num));

        if (kommuneNumbers.length === 0) return setHouseModelProperty([]);

        const husmodellDocRef = doc(db, "house_model", String(husodellId));

        const plotsRef = collection(db, "empty_plot");
        const husmodellDocSnap = await getDoc(husmodellDocRef);

        if (!husmodellDocSnap.exists()) {
          console.error("No such document!");
          return [];
        }

        const allHusmodell = [
          { propertyId: husmodellDocSnap.id, ...husmodellDocSnap.data() },
        ];

        const allPlots: any = [];
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
            const data = doc.data();
            if (data?.CadastreDataFromApi?.presentationAddressApi)
              allPlots.push({ id: doc.id, ...data });
          });
        }

        const filteredPlots = allPlots.filter((plot: any) => {
          const minValue = minRangePlot ? Number(minRangePlot) : 0;
          const maxValue = maxRangePlot ? Number(maxRangePlot) : Infinity;

          return plot.pris >= minValue && plot.pris <= maxValue;
        });

        const combinedData = filteredPlots.flatMap((plot: any) =>
          allHusmodell.map((house) => ({ plot, house }))
        );

        setHouseModelProperty(combinedData);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setHouseModelProperty([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [db, router.asPath]);

  return (
    <>
      <div className="relative pt-8">
        <SideSpaceContainer>
          <div className="flex items-end justify-between gap-4 mb-[40px]">
            <h3 className="text-darkBlack text-lg md:text-[24px] lg:text-[28px] desktop:text-[2rem] desktop:leading-[44.8px]">
              <span className="font-bold">Tomter</span> der du kan bygge{" "}
              <span className="text-[#6938EF] font-bold">
                {HouseModelData?.Husdetaljer?.husmodell_name}
              </span>{" "}
              <span className="font-bold text-blue">
                {router.query.city
                  ? router.query.city.replace(/\s*\(\d+\)/, "")
                  : ""}
              </span>
            </h3>
            {!isLoading && (
              <p className="text-darkBlack text-sm md:text-base desktop:text-xl font-light">
                <span className="font-bold">{HouseModelProperty.length}</span>{" "}
                treff i <span className="font-bold">2 206</span> annonser
              </p>
            )}
          </div>
          <div className="flex gap-6 relative pb-[56px]">
            <div className="w-[35%]">
              <PlotFilterSection
                formData={formData}
                setFormData={setFormData}
              />
            </div>
            <div className="w-[65%]">
              <PlotProperty
                HouseModelProperty={HouseModelProperty}
                isLoading={isLoading}
                handleNext={handleNext}
              />
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
                  window.location.reload();
                }}
              />
              {/* <Button
                text="Neste: Tilbud"
                className="border border-primary bg-primary text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                onClick={() => {
                  handleNext();
                }}
              /> */}
            </div>
          </SideSpaceContainer>
        </div>
      </div>
    </>
  );
};

export default Plots;
