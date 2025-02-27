import React, { useEffect, useState } from "react";
// import PropertyHusmodellDetail from "@/components/Ui/stepperUi/propertyHusmodellDetail";
import PropertyDetailPage from "@/components/Ui/Husmodell/propertyDetailPage";

const Husmodell: React.FC<any> = ({ handleNext, handlePrevious }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <div className="relative">
      {/* <PropertyHusmodellDetail isShow={false} /> */}
      <PropertyDetailPage
        handleNext={handleNext}
        handlePrevious={handlePrevious}
      />
    </div>
  );
};

export default Husmodell;
