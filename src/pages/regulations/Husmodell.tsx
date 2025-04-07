import React from "react";
import AllProperty from "@/components/Ui/RegulationHusmodell/allProperty";

const Husmodell: React.FC<any> = ({
  handleNext,
  lamdaDataFromApi,
  CadastreDataFromApi,
  askData,
  handlePrevious,
}) => {
  return (
    <div className="relative">
      <AllProperty
        lamdaDataFromApi={lamdaDataFromApi}
        CadastreDataFromApi={CadastreDataFromApi}
        askData={askData}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
      />
    </div>
  );
};

export default Husmodell;
