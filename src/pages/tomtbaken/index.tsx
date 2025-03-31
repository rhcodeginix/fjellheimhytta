import SideSpaceContainer from "@/components/common/sideSpace";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import BelopProperty from "./property";
import { useRouter } from "next/router";

const TomtBaken: React.FC = () => {
  const router: any = useRouter();
  const [HouseModelProperty, setHouseModelProperty] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

        const db = getFirestore();
        const citiesCollectionRef = collection(db, "cities");
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

        const [plotsRef] = [collection(db, "empty_plot")];

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

        setHouseModelProperty(allPlots);
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
          {/* <div className="flex items-end justify-between gap-4 mb-[40px]">
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
                treff i <span className="font-bold">2 606</span> Tomter
              </p>
            )}
          </div> */}
          <div className="relative pb-[56px]">
            <BelopProperty
              HouseModelProperty={HouseModelProperty}
              isLoading={isLoading}
            />
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default TomtBaken;
