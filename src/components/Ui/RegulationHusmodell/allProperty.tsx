import React from "react";
// import Button from "@/components/common/button";
import HusmodellPropertyPage from "../regulation";
import Button from "@/components/common/button";

const AllProperty: React.FC<any> = ({
  handlePrevious,
  CadastreDataFromApi,
  lamdaDataFromApi,
  askData,
}) => {
  return (
    <>
      <HusmodellPropertyPage
        CadastreDataFromApi={CadastreDataFromApi}
        lamdaDataFromApi={lamdaDataFromApi}
        askData={askData}
      />
      <div className="flex justify-center mt-[60px]">
        <Button
          text="Se flere modeller"
          className="border border-lightPurple bg-lightPurple text-blue sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[54px] relative desktop:py-[16px]"
          onClick={() => {
            handlePrevious();
            const currIndex = 0;
            localStorage.setItem("currIndex", currIndex.toString());
          }}
        />
      </div>
    </>
  );
};

export default AllProperty;
