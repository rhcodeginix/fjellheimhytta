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
  const router: any = useRouter();
  const [HouseModelProperty, setHouseModelProperty] = useState([]);
  const [total, setTotal] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    Eiendomstype: [] as string[],
    TypeHusmodell: [] as string[],
    AntallSoverom: [] as string[],
    minRangeForPlot: 0,
    maxRangeForPlot: 5000000,
    minRangeForHusmodell: 0,
    maxRangeForHusmodell: 5000000,
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    const queryPrice = queryParams.get("pris");
    const maxRangePlot = queryParams.get("maxRangePlot");
    const maxRangeHusmodell = queryParams.get("maxRangeHusmodell");
    setFormData((prev) => ({
      ...prev,
      maxRangeForPlot: maxRangePlot
        ? Number(maxRangePlot)
        : Number(queryPrice) * 0.4,
      maxRangeForHusmodell: maxRangeHusmodell
        ? Number(maxRangeHusmodell)
        : Number(queryPrice) * 0.6,
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
        const queryParams = new URLSearchParams(window.location.search);
        const soveromFormLocalStorage = JSON.parse(
          localStorage.getItem("soverom") || "[]"
        );
        setFormData((prev) => ({
          ...prev,
          AntallSoverom: soveromFormLocalStorage,
        }));
        const soveromValues = soveromFormLocalStorage.map((item: any) =>
          parseInt(item.replace(" Soverom", ""), 10)
        );
        const maxRangePlot: any = queryParams.get("maxRangePlot");
        const maxRangeHusmodell = queryParams.get("maxRangeHusmodell");
        setFormData((prev) => ({
          ...prev,
          AntallSoverom: soveromFormLocalStorage,
        }));

        const db = getFirestore();
        const citiesCollectionRef = collection(db, "cities");
        const queryPrice = queryParams.get("pris");
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

        const [plotsRef, husmodellRef] = [
          collection(db, "empty_plot"),
          collection(db, "house_model"),
        ];
        const allHusmodell = (await getDocs(husmodellRef)).docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const filteredHusmodell = queryPrice
          ? allHusmodell.filter(
              (plot: any) =>
                (maxRangeHusmodell
                  ? (plot?.Husdetaljer?.pris.replace(/\s/g, ""), 10) <=
                    parseInt(maxRangeHusmodell)
                  : parseInt(plot?.Husdetaljer?.pris.replace(/\s/g, ""), 10) <=
                    parseInt(queryPrice.replace(/\s/g, ""), 10) * 0.4) &&
                (soveromValues.length > 0
                  ? soveromValues.includes(plot?.Husdetaljer?.Soverom)
                  : true)
            )
          : allHusmodell;

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
            if (data.CadastreDataFromApi?.presentationAddressApi)
              allPlots.push({ id: doc.id, ...data });
          });
        }
        setTotal(allPlots);

        const filteredPlots = queryPrice
          ? allPlots.filter(
              (plot: any) =>
                plot.pris <=
                (maxRangePlot && parseInt(maxRangePlot, 10)
                  ? Number(maxRangePlot)
                  : parseInt(queryPrice, 10) * 0.6)
            )
          : allPlots;
        const combinedData = filteredPlots.flatMap((plot: any) =>
          filteredHusmodell.map((house) => ({ plot, house }))
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
  }, [db, router.asPath, total]);

  return (
    <>
      <div className="relative pt-8">
        <SideSpaceContainer>
          <div className="flex items-end justify-between gap-4 mb-[40px]">
            <h3 className="text-[#111322] text-lg md:text-[24px] lg:text-[28px] desktop:text-[2rem] desktop:leading-[44.8px]">
              Kombinasjoner av <span className="font-bold">husmodell</span> og{" "}
              <span className="font-bold">tomt</span> i{" "}
              <span className="font-bold text-blue">
                {router.query.city
                  ? router.query.city.replace(/\s*\(\d+\)/, "")
                  : ""}
              </span>
            </h3>
            {!isLoading && (
              <p className="text-[#111322] text-sm md:text-base desktop:text-xl font-light">
                <span className="font-bold">{HouseModelProperty.length}</span>{" "}
                treff i <span className="font-bold">{total}</span> Tomter
              </p>
            )}
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
