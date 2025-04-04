import React from "react";
// import Button from "@/components/common/button";
import HusmodellPropertyPage from "../regulation";

const AllProperty: React.FC<any> = ({
  CadastreDataFromApi,
  lamdaDataFromApi,
  askData,
  handleNext,
}) => {
  return (
    <>
      <div className="relative">
        <HusmodellPropertyPage
          CadastreDataFromApi={CadastreDataFromApi}
          lamdaDataFromApi={lamdaDataFromApi}
          askData={askData}
          handleNext={handleNext}
        />
      </div>
    </>
  );
};

export default AllProperty;
