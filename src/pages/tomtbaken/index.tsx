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
