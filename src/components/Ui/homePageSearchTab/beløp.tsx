import React, { useState, useRef } from "react";
import Image from "next/image";
import Ic_Search2 from "@/public/images/Ic_Search2.svg";
import Ic_close from "@/public/images/Ic_close.svg";
import { useRouter } from "next/router";

const BeløpTab = () => {
  const [formData, setFormData] = useState({
    amount: "",
  });

  const [errors, setErrors] = useState<{
    amount: boolean;
  }>({
    amount: false,
  });
  const router = useRouter();
  const kartInputRef = useRef<HTMLInputElement | null>(null);

  const handleKartInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.replace(/\D/g, "");

    if (rawValue) {
      const formattedValue = new Intl.NumberFormat("no-NO").format(
        Number(rawValue)
      );
      setFormData((prev) => ({ ...prev, amount: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, amount: "" }));
    }

    setErrors((prev) => ({ ...prev, amount: false }));
  };

  const handleClearKartInput = () => {
    setFormData((prev) => ({ ...prev, amount: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!formData?.amount) {
      setErrors((prev) => ({ ...prev, amount: true }));
      hasError = true;
    }

    if (hasError) return;
    router.push(
      `housemodell-plot?pris=${formData?.amount.replace(/\s+/g, "")}`
    );
    const currIndex = 0;
    localStorage.setItem("currIndex", currIndex.toString());
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="lg:h-[80px] bg-white border-gray3 border rounded-[8px] lg:rounded-[98px] flex flex-col lg:flex-row lg:items-center relative justify-between"
        style={{
          boxShadow: "0px 32px 82px -12px #10182812",
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full lg:w-11/12 lg:h-[80px]">
          {/* <div className="relative min-w-[24%] w-auto h-full">
            <div
              className={`bg-[#F4F3F1] py-3 px-2 lg:py-4 lg:px-5 desktop:px-8 h-full flex flex-col justify-center lg:rounded-l-[98px] overflow-hidden`}
            >
               <div className="text-darkBlack2 mb-2 text-sm text:base desktop:text-lg font-bold">
                Jeg vil bygge
              </div>
              <div className="text-xs md:text-sm font-medium">
                <span className="text-black">hytte</span>
              </div> 
            </div>
          </div> */}

          <div className="w-full rounded-[12px] lg:rounded-[88px] py-3 px-2 lg:px-4 desktop:px-8 lg:items-center flex lg:justify-between relative">
            <div className="w-[92%]">
              <div className="text-[#30374F] mb-2 text-xs md:text-sm">
                Hvor mye vil du bruke totalt for både tomt og bolig?
              </div>
              <input
                ref={kartInputRef}
                className={`focus:outline-none text-black text-sm md:text-base desktop:text-lg font-medium bg-transparent w-full
                  ${errors.amount ? "border border-red-500" : ""}`}
                placeholder="Fyll inn beløp i NOK"
                onChange={handleKartInputChange}
                value={formData?.amount}
                type="text"
                inputMode="numeric"
              />
            </div>
            {formData?.amount && (
              <Image
                src={Ic_close}
                alt="close"
                className="cursor-pointer"
                onClick={handleClearKartInput}
                fetchPriority="auto"
              />
            )}
          </div>
          {errors.amount && (
            <p className="text-red-500 text-xs mt-1">Beløp kreves.</p>
          )}
        </div>

        <div className="border-t border-gray3 w-full lg:hidden"></div>

        <button
          className={`p-3 lg:px-5 lg:py-4 cursor-pointer flex justify-center items-center bg-primary border border-primary hover:bg-[#1E5F5C] hover:border-[#1E5F5C] focus:bg-[#003A37] focus:border-[#003A37] rounded-[40px] transition-all duration-300 ease-out h-[40px] lg:h-[56px] m-4 gap-2 ${
            !formData?.amount ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="submit"
          disabled={!formData?.amount}
        >
          <Image
            src={Ic_Search2}
            alt="search"
            className="w-5 h-5"
            fetchPriority="auto"
          />
          <span className="text-white font-medium text-base">Søk</span>
        </button>
      </div>
    </form>
  );
};

export default BeløpTab;
