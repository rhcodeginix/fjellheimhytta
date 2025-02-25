import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Ic_search from "@/public/images/Ic_search.svg";
import Ic_close from "@/public/images/Ic_close.svg";
import Ic_chevron_down from "@/public/images/Ic_chevron_down.svg";

const HusmodellTab = () => {
  const [formData, setFormData] = useState({
    amount: "",
    Kommue: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<{
    Kommue: boolean;
    amount: boolean;
  }>({
    Kommue: false,
    amount: false,
  });

  const options = [
    { name: "Agder", count: 180 },
    { name: "Akershus", count: 320 },
    { name: "Buskerud", count: 106 },
    { name: "Finnmark", count: 31 },
    { name: "Innlandet", count: 153 },
    { name: "Møre og Romsdal", count: 153 },
    { name: "Nordland", count: 71 },
    { name: "Oslo", count: 18 },
    { name: "Rogaland", count: 159 },
    { name: "Telemark", count: 75 },
    { name: "Troms", count: 79 },
    { name: "Trøndelag", count: 180 },
    { name: "Vestfold", count: 94 },
    { name: "Vestland", count: 300 },
    { name: "Østfold", count: 144 },
  ];

  const dropdownRef = useRef<HTMLDivElement>(null);
  const kartInputRef = useRef<HTMLInputElement | null>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option: string) => {
    setFormData((prev) => ({ ...prev, Kommue: option }));
    setErrors((prev) => ({ ...prev, Kommue: false }));
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKartInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, amount: value }));
    setErrors((prev) => ({ ...prev, amount: false }));
  };

  const handleClearKartInput = () => {
    setFormData((prev) => ({ ...prev, amount: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!formData.Kommue) {
      setErrors((prev) => ({ ...prev, Kommue: true }));
      hasError = true;
    }
    if (!formData.amount) {
      setErrors((prev) => ({ ...prev, amount: true }));
      hasError = true;
    }

    if (hasError) return;

    console.log("data-----------", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="lg:h-[80px] bg-[#F9F9FB] shadow-shadow1 border-[#EFF1F5] border rounded-[8px] lg:rounded-[100px] flex flex-col lg:flex-row lg:items-center relative justify-between">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full lg:w-11/12 lg:h-[80px]">
          <div className="relative min-w-[30%] w-auto h-full" ref={dropdownRef}>
            <div
              className={`bg-[#F4EBFF] rounded-[8px] lg:rounded-[40px] desktop:rounded-[70px] py-3 px-2 lg:py-4 lg:px-5 desktop:px-[40px] ${
                errors.Kommue ? "border border-red-500" : ""
              }`}
            >
              <div className="text-[#5D6B98] mb-1 text-sm">
                Velg <span className="font-bold">Kommue</span>
              </div>
              <button
                type="button"
                onClick={toggleDropdown}
                className="text-[#111322] text-base font-medium flex items-center justify-between w-full"
              >
                {formData.Kommue || "Velg et alternativ"}
                <Image src={Ic_chevron_down} alt="arrow" />
              </button>
            </div>
            {errors.Kommue && (
              <p className="text-red-500 text-xs mt-1">
                Valgt Kommue er påkrevd.
              </p>
            )}
            {isOpen && (
              <ul
                className="absolute left-0 w-full bg-white rounded-[8px] overflow-hidden h-auto max-h-[238px] overflow-y-auto overFlowYAuto"
                style={{
                  boxShadow:
                    "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
                  zIndex: 99999,
                }}
              >
                {options.map((option, index) => (
                  <li
                    key={index}
                    onClick={() =>
                      handleSelect(`${option.name} (${option.count})`)
                    }
                    className={`text-sm text-[#111322] px-4 py-[14px] cursor-pointer 
                      ${
                        formData.Kommue === `${option.name} (${option.count})`
                          ? "bg-[#F9F5FF] font-semibold"
                          : "bg-white"
                      }`}
                  >
                    <span>{option.name}</span>
                    <span className="text-[#4A5578]"> ({option.count})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="w-full rounded-[12px] lg:rounded-[88px] py-3 px-2 lg:px-4 desktop:px-8 lg:items-center flex lg:justify-between relative">
            <div className="w-[92%] lg:w-auto">
              <div className="text-[#111322] mb-1 text-sm">
                Søk opp kommunen der du ønsker å bygge din nye bolig
              </div>
              <input
                ref={kartInputRef}
                type="number"
                className={`focus:outline-none text-black text-base desktop:text-xl font-medium bg-transparent w-full
                  ${errors.amount ? "border border-red-500" : ""}`}
                placeholder="Fyll inn beløp i NOK"
                onChange={handleKartInputChange}
                value={formData.amount}
              />
            </div>
            {formData.amount && (
              <Image
                src={Ic_close}
                alt="close"
                className="cursor-pointer"
                onClick={handleClearKartInput}
              />
            )}
          </div>
          {errors.amount && (
            <p className="text-red-500 text-xs mt-1">Beløp kreves.</p>
          )}
        </div>

        <button
          className={`p-3 lg:p-5 cursor-pointer flex justify-center items-center bg-primary rounded-full gap-[10px] transition-all duration-300 ease-out h-[48px] w-[48px] lg:h-[64px] lg:w-[64px] m-2 ${
            !formData.Kommue || !formData.amount
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          type="submit"
          disabled={!formData.Kommue || !formData.amount}
        >
          <Image src={Ic_search} alt="search" className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
};

export default HusmodellTab;
