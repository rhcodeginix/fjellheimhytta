import React, { useEffect, useState } from "react";
// import Button from "@/components/common/button";
import Property from "@/components/common/property";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import Loader from "@/components/Loader";
import { useRouter } from "next/router";

const AllProperty: React.FC<any> = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [houseModels, setHouseModels] = useState([]);
  const router = useRouter();

  const fetchHusmodellData = async () => {
    setIsLoading(true);
    try {
      let q = query(
        collection(db, "house_model"),
        orderBy("updatedAt", "desc")
      );

      const querySnapshot = await getDocs(q);

      const data: any = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHouseModels(data);
    } catch (error) {
      console.error("Error fetching husmodell data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchHusmodellData();
  }, []);

  return (
    <>
      <div className="pt-[16px] pb-[146px]">
        <h3 className="text-black text-2xl font-semibold mb-[36px]">
          Følgende kan bygges på denne tomten:
        </h3>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 desktop:grid-cols-4 gap-x-4 lg:gap-x-6 desktop:gap-x-8 gap-y-7 lg:gap-y-9 desktop:gap-y-12">
              <Property propertyList={houseModels} LinkHref={router.asPath} />
            </div>
            {/* <div className="flex justify-center mt-[60px]">
              <Button
                text="Se flere modeller"
                className="border border-lightPurple bg-lightPurple text-blue sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[54px] relative desktop:py-[16px]"
                // path="/"
              />
            </div> */}
          </>
        )}
      </div>
    </>
  );
};

export default AllProperty;
