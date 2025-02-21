import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Ic_search from "@/public/images/Ic_search.svg";
import Ic_close from "@/public/images/Ic_close.svg";
import Ic_search_location from "@/public/images/Ic_search_location.svg";
import Link from "next/link";
import ApiUtils from "@/api";
import { useAddress } from "@/context/addressContext";

const HusmodellTab = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { setStoreAddress } = useAddress();
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [data, setData] = useState<any>(null);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    if (e.target.value) {
      try {
        const response = await ApiUtils.getMunicipality();
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        const filteredData = json.filter(
          (item: { kommunenavn: string; kommunenavnNorsk: string }) =>
            item.kommunenavn.toLowerCase().includes(inputValue.toLowerCase()) ||
            item.kommunenavnNorsk
              .toLowerCase()
              .includes(inputValue.toLowerCase())
        );
        setData(filteredData);
      } catch (error: any) {
        console.error(error?.message);
      }
    }
  };

  const handleClearInput = () => {
    setInputValue("");
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (inputValue === "") {
      setIsFocused(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  if (!hasMounted) return null;

  return (
    <>
      <div
        className={`shadow-shadow1 border-gray border rounded-[24px] desktop:rounded-[112px] flex flex-col desktop:flex-row desktop:items-center relative justify-between p-3 ${isFocused ? "bg-lightGreen" : "bg-[#fff]"}`}
        ref={containerRef}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex flex-col lg:flex-row desktop:items-center desktop:justify-between w-full desktop:w-10/12">
          <div
            className="w-full rounded-[12px] desktop:rounded-[88px] py-2 px-2 desktop:px-9 desktop:items-center flex desktop:justify-between bg-white relative"
            style={{
              boxShadow: isFocused
                ? "0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.1)"
                : "",
            }}
          >
            <div className="w-[92%] desktop:w-auto">
              <div className="text-black mb-2 text-sm desktop:text-base">
                Velg kommune du vurderer å bygge i:
              </div>
              <input
                ref={inputRef}
                type="text"
                className="focus:border-0 focus-within:border-0 focus:outline-none text-black text-base desktop:text-xl font-medium bg-transparent"
                placeholder="Velg kommune"
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleInputChange}
                value={inputValue}
              />
            </div>
            {isFocused && (
              <Image
                src={Ic_close}
                alt="close"
                className="cursor-pointer"
                onClick={handleClearInput}
              />
            )}
          </div>
        </div>
        {inputValue && isFocused && data && data.length > 0 && (
          <div
            className="absolute top-[90px] desktop:top-[108px] left-0 bg-white rounded-[8px] py-[12px]  p-2.5 desktop:px-[16px] w-full h-auto max-h-[400px] overflow-auto"
            style={{
              boxShadow:
                "rgba(16, 24, 40, 0.09) 0px 4px 6px -2px, rgba(16, 24, 40, 0.09) 0px 12px 16px -4px",
              zIndex: 99999,
            }}
          >
            {data &&
              data.map((address: any, index: number) => (
                <Link
                  href={`/husmodell`}
                  // href="/husmodell?kommunenummer=${address.kommunenummer}"
                  // href={`/husmodell?kommunenummer=${address.kommunenummer}&gardsnummer=${address.gardsnummer}&bruksnummer=${address.bruksnummer}&kommunenavn=${address.kommunenavn}`}
                  className="p-2 desktop:p-3 flex items-center gap-2.5 desktop:gap-4 hover:bg-lightGreen"
                  key={index}
                  onClick={() => {
                    localStorage.setItem(
                      "IPlot_Address",
                      JSON.stringify(address)
                    );
                    const currIndex = 0;
                    localStorage.setItem("currIndex", currIndex.toString());
                    setStoreAddress(address);
                  }}
                >
                  <Image src={Ic_search_location} alt="location" />
                  <div>
                    <span className="text-secondary text-sm desktop:text-base font-medium">
                      Kommune:
                    </span>{" "}
                    <span className="text-black font-medium text-base desktop:text-lg">
                      {`${address.kommunenavn} Kommune (${address.kommunenummer})` ||
                        "N/A"}
                    </span>
                  </div>
                </Link>
              ))}
            {/* <Link
              href="/husmodell"
              className="p-3 flex items-center gap-4 hover:bg-lightGreen"
              onClick={() => {
                // localStorage.setItem("IPlot_Address", JSON.stringify("Olso"));
                setStoreAddress("Olso");
              }}
            >
              <Image src={Ic_search_location} alt="location" />
              <div>
                <span className="text-black font-medium text-lg">Asker</span>
              </div>
            </Link> */}
          </div>
        )}
        <div
          className={`ml-auto desktop:ml-0 mt-4 desktop:mt-0 p-3 desktop:p-[22px] cursor-pointer flex justify-center items-center bg-primary rounded-[12px] desktop:rounded-full gap-[10px] transition-all duration-300 ease-out ${
            isFocused
              ? "w-[120px] desktop:w-[180px]"
              : "w-[48px] desktop:w-[76px]"
          }`}
        >
          <Image
            src={Ic_search}
            alt="search"
            className="w-6 h-6 desktop:w-auto desktop:h-auto"
          />
          {isFocused && (
            <span
              className={`text-white font-medium text-lg desktop:text-xl slide-in-text`}
            >
              Search
            </span>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInFromRight {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .slide-in-text {
          animation: slideInFromRight 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default HusmodellTab;
