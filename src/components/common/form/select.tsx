import React, { useEffect, useRef, useState } from "react";
import Ic_chevron_down from "@/public/images/Ic_chevron_down.svg";
import Image from "next/image";

interface SelectDropDownProps {
  label: string;
  name: string;
  id: string;
  placeholder: string;
  errors?: any;
  touched?: any;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  value?: string;
}

const SelectDropDown: React.FC<SelectDropDownProps> = ({
  label,
  name,
  id,
  placeholder,
  errors,
  touched,
  onChange,
  options,
  value,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(placeholder);
  const popup = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: { value: string; label: string }) => {
    setSelectedLabel(option.label);
    onChange(option.value);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popup.current && !popup.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <label htmlFor={id} className={`text-[#111322] text-sm font-semibold`}>
        {label}
      </label>
      <div
        id={id}
        className={`border mt-2 rounded-[8px] py-[13px] px-[16px] h-[48px] relative flex items-center justify-between ${isOpen ? "open" : ""} ${errors && touched && errors[name] && touched[name] ? "border-red" : "border-[#B9C0D4]"}`}
        onClick={handleToggle}
      >
        <div
          className={`truncate ${selectedLabel == placeholder ? "text-[#4A5578]" : "text-[#111322]"}`}
        >
          {selectedLabel}
        </div>
        <Image
          src={Ic_chevron_down}
          className={`${isOpen ? "rotate-180" : ""}`}
          alt="arrow"
        />
      </div>
      {isOpen && (
        <div
          className="absolute bg-white w-full shadow-shadow1"
          style={{ zIndex: 999 }}
          ref={popup}
        >
          <ul>
            {options.map((option, index) => (
              <li
                key={index}
                className={`truncate cursor-pointer w-full px-4 py-2.5 ${value === option.value ? "font-medium bg-lightPurple" : ""}`}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
      {errors && touched && errors[name] && touched[name] && (
        <div className="error-message">{errors[name]}</div>
      )}
    </div>
  );
};

export default SelectDropDown;
