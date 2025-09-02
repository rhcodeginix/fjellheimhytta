import React from "react";
import HusmodellPropertyPage from "@/components/Ui/regulation";

const Husmodell: React.FC<any> = ({
  handleNext,
  lamdaDataFromApi,
  CadastreDataFromApi,
  askData,
  handlePrevious,
  resultsLoading,
  BoxData,
  results,
}) => {
  return (
    <div className="relative">
      <HusmodellPropertyPage
        CadastreDataFromApi={CadastreDataFromApi}
        lamdaDataFromApi={lamdaDataFromApi}
        askData={askData}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        resultsLoading={resultsLoading}
        BoxData={BoxData}
        results={results}
      />
    </div>
  );
};

export default Husmodell;
