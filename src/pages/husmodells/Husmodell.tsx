import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import HusmodellPropertyPage from "../husmodell";
import HusmodellDetail from "./husmodell-details";

const Husmodell: React.FC<any> = ({
  handleNext,
  loading,
  HouseModelData,
  pris,
  lamdaDataFromApi,
  supplierData,
  user,
}) => {
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();
  const { husmodellId } = router.query;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <div className="relative">
      {!husmodellId ? (
        <HusmodellPropertyPage />
      ) : (
        <HusmodellDetail
          handleNext={handleNext}
          HouseModelData={HouseModelData}
          loading={loading}
          pris={pris}
          lamdaDataFromApi={lamdaDataFromApi}
          supplierData={supplierData}
          user={user}
        />
      )}
    </div>
  );
};

export default Husmodell;
