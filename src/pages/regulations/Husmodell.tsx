import React from "react";
import AllProperty from "@/components/Ui/RegulationHusmodell/allProperty";

const Husmodell: React.FC<any> = ({
  handleNext,
  lamdaDataFromApi,
  CadastreDataFromApi,
  askData,
}) => {
  return (
    <div className="relative">
      <AllProperty
        lamdaDataFromApi={lamdaDataFromApi}
        CadastreDataFromApi={CadastreDataFromApi}
        askData={askData}
        handleNext={handleNext}
      />
    </div>
  );
};

export default Husmodell;
