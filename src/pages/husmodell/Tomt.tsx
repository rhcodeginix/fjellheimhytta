import React, { useEffect, useState } from "react";
import PropertyHusmodellDetail from "@/components/Ui/stepperUi/propertyHusmodellDetail";
import TomtTab from "@/components/Ui/homePageSearch/tomt";
import SideSpaceContainer from "@/components/common/sideSpace";
import PlotAllProperty from "@/components/Ui/Husmodell/plotAllProperty";

const Tomt: React.FC<any> = ({
  handleNext,
  lamdaDataFromApi,
  loadingAdditionalData,
  additionalData,
}) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <div className="relative">
      <PropertyHusmodellDetail
        isShow={false}
        loadingAdditionalData={loadingAdditionalData}
        additionalData={additionalData}
      />
      <div className="py-4">
        <SideSpaceContainer>
          <TomtTab />
        </SideSpaceContainer>
      </div>
      <PlotAllProperty
        handleNext={handleNext}
        lamdaDataFromApi={lamdaDataFromApi}
      />
    </div>
  );
};

export default Tomt;
