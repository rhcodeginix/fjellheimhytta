import React from "react";
import HusmodellPropertyPage from "../regulation";

const AllProperty: React.FC<any> = ({
  CadastreDataFromApi,
  lamdaDataFromApi,
  askData,
  handleNext,
  handlePrevious,
}) => {
  return (
    <>
      <div className="relative">
        <HusmodellPropertyPage
          CadastreDataFromApi={CadastreDataFromApi}
          lamdaDataFromApi={lamdaDataFromApi}
          askData={askData}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
        />
      </div>
    </>
  );
};

export default AllProperty;
