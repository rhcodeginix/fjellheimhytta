import React from "react";
import AllProperty from "@/components/Ui/RegulationHusmodell/allProperty";
import { useRouter } from "next/router";
import HouseModelSingleProperty from "@/components/Ui/regulation/houseModelSingleProperty";

const Husmodell: React.FC<any> = ({
  handleNext,
  handlePrevious,
  lamdaDataFromApi,
  CadastreDataFromApi,
  askData,
  loadingAdditionalData,
  loginUser,
  loadingLamdaData,
  supplierData,
  HouseModelData,
}) => {
  const router = useRouter();

  const { husodellId } = router.query;
  return (
    <div className="relative">
      {husodellId ? (
        <HouseModelSingleProperty
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          loadingAdditionalData={loadingAdditionalData}
          loginUser={loginUser}
          loadingLamdaData={loadingLamdaData}
          supplierData={supplierData}
          CadastreDataFromApi={CadastreDataFromApi}
          HouseModelData={HouseModelData}
          askData={askData}
          lamdaDataFromApi={lamdaDataFromApi}
        />
      ) : (
        <div className="relative">
          <AllProperty
            lamdaDataFromApi={lamdaDataFromApi}
            CadastreDataFromApi={CadastreDataFromApi}
            askData={askData}
            handlePrevious={handlePrevious}
          />
        </div>
      )}
    </div>
  );
};

export default Husmodell;
