import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Ic_search from "@/public/images/Ic_search.svg";
import Ic_chevron_down from "@/public/images/Ic_chevron_down.svg";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import Loading from "@/components/Loading";
import { useRouter } from "next/router";

const HusmodellTab = () => {
  const [formData, setFormData] = useState({
    Kommue: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<{
    Kommue: boolean;
  }>({
    Kommue: false,
  });

  const [Cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      const citiesCollectionRef = collection(db, "cities");

      try {
        const citiesSnapshot = await getDocs(citiesCollectionRef);
        const fetchedProperties: any = citiesSnapshot.docs.map((doc) => ({
          propertyId: doc.id,
          ...doc.data(),
        }));

        const mergedCities = fetchedProperties.flatMap((property: any) =>
          Array.isArray(property.kommunerList) ? property.kommunerList : []
        );

        setCities(mergedCities);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [db]);

  const options = Cities.map((city: any) => ({
    name: city?.name,
    number: city?.number,
  }));

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!formData.Kommue) {
      setErrors((prev) => ({ ...prev, Kommue: true }));
      hasError = true;
    }

    if (hasError) return;

    router.push(`husmodell?Kommue=${formData.Kommue}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="lg:h-[80px] bg-[#F9F9FB] border-[#EFF1F5] border rounded-[8px] lg:rounded-[100px] flex flex-col lg:flex-row lg:items-center relative justify-between">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full lg:w-11/12 lg:h-[80px]">
          <div className="w-full rounded-[12px] lg:rounded-[88px] py-3 px-2 lg:px-4 desktop:px-8 lg:items-center flex lg:justify-between">
            <div className="w-full cursor-pointer" onClick={toggleDropdown}>
              <div className="text-[#111322] mb-1 text-sm">
                Se hvilke husmodeller som tilbys i kommunen der du ønsker å
                bygge:
              </div>
              <button
                type="button"
                className="text-base flex items-center justify-between gap-5"
              >
                {formData.Kommue ? (
                  <span className="text-[#111322] font-medium">
                    {formData.Kommue}
                  </span>
                ) : (
                  <span className="text-[#5D6B98]">Søk opp kommune</span>
                )}
                <Image src={Ic_chevron_down} alt="arrow" fetchPriority="auto" />
              </button>
              {isOpen && (
                <ul
                  className="absolute top-20 left-0 w-full bg-white rounded-[8px] overflow-hidden h-auto max-h-[238px] overflow-y-auto overFlowYAuto"
                  style={{
                    boxShadow:
                      "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
                    zIndex: 99999,
                  }}
                >
                  {isLoading ? (
                    <div className="relative h-[100px]">
                      <Loading />
                    </div>
                  ) : (
                    <>
                      {options.map((option, index) => (
                        <li
                          key={index}
                          onClick={() =>
                            handleSelect(`${option.name} (${option.number})`)
                          }
                          className={`text-sm text-[#111322] px-4 py-[14px] cursor-pointer 
                      ${
                        formData.Kommue === `${option.name} (${option.number})`
                          ? "bg-[#F9F5FF] font-semibold"
                          : "bg-white"
                      }`}
                        >
                          <span>
                            {option.name}{" "}
                            <span className="text-grayText font-normal">
                              ({option.number})
                            </span>
                          </span>
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              )}
            </div>
          </div>
          {errors.Kommue && (
            <p className="text-red-500 text-xs mt-1">
              Valgt Kommue er påkrevd.
            </p>
          )}
        </div>

        <button
          className={`p-3 lg:p-5 cursor-pointer flex justify-center items-center bg-primary rounded-full gap-[10px] transition-all duration-300 ease-out h-[48px] w-[48px] lg:h-[64px] lg:w-[64px] m-2 ${
            !formData.Kommue ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="submit"
          disabled={!formData.Kommue}
        >
          <Image
            src={Ic_search}
            alt="search"
            className="w-6 h-6"
            fetchPriority="auto"
          />
        </button>
      </div>
    </form>
  );
};

export default HusmodellTab;
