import React, { useEffect, useState } from "react";
import Plots from "@/components/Ui/Husmodell/plot";

const Tomt: React.FC<any> = ({ handleNext, handlePrevious }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <div className="relative">
      <Plots handleNext={handleNext} handlePrevious={handlePrevious} />
    </div>
  );
};

export default Tomt;
