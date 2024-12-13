import ApiUtils from "@/api";
import React, { createContext, useState, useEffect, ReactNode } from "react";

const AddressContext = createContext<any | undefined>(undefined);

const AddressProvider = ({ children }: { children: ReactNode }) => {
  const [getAddress, setGetAddress] = useState<any | null>(null);
  const [storedAddress, setStoreAddress] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [additionalData, setAdditionalData] = useState<any | undefined>(null);
  const [loadingAdditionalData, setLoadingAdditionalData] = useState(false);
  const [LamdaData, setLamdaData] = useState<any | undefined>(null);
  const [loadingLamdaData, setLoadingLamdaData] = useState(false);

  useEffect(() => {
    const addressFromStorage = localStorage.getItem("IPlot_Address");
    if (addressFromStorage) {
      setStoreAddress(JSON.parse(addressFromStorage));
    } else {
      console.error("No address data found in localStorage");
      setLoading(false);
    }
  }, []);

  const searchAddress = async () => {
    if (!storedAddress) {
      console.error("No address data to search.");
      setLoading(false);
      return;
    }

    const queryParams = storedAddress;
    try {
      const result = await ApiUtils.getSingleAddress(queryParams);
      const matches = result.adresser.find(
        (address: any) =>
          JSON.stringify(address) === JSON.stringify(queryParams)
      );
      const lamdaApiData: any = {
        kommunenummer: matches.kommunenummer,
        gardsnummer: matches.gardsnummer,
        bruksnummer: matches.bruksnummer,
      };

      if (matches) {
        setGetAddress(matches);
        await fetchLamdaData(lamdaApiData);
        await fetchAdditionalData(matches.kommunenavn);
      }
    } catch (error) {
      console.error("Error fetching address data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLamdaData = async (data: any) => {
    setLoadingLamdaData(true);

    try {
      const response = await ApiUtils.LamdaApi(data);
      setLamdaData(response);
    } catch (error: any) {
      console.error("Error fetching additional data:", error.message);
    } finally {
      setLoadingLamdaData(false);
    }
  };

  const fetchAdditionalData = async (kommunenavn: string) => {
    const a = LamdaData?.body?.replace(/```json|```/g, "").trim();

    let areaDetails = "";

    try {
      const parsedData = JSON.parse(a);
      areaDetails = parsedData?.areaDetails || "";

      const data = {
        question: `Hva er tillatt gesims- og mønehøyde, maksimal BYA inkludert parkeringskrav i henhold til parkeringsnormen i ${kommunenavn} kommune, og er det tillatt å bygge en enebolig med flatt tak eller takterrasse i dette området i ${kommunenavn}, sone GB? Tomtestørrelse for denne eiendommen er ${areaDetails}.`,
      };

      setLoadingAdditionalData(true);

      try {
        const response = await ApiUtils.askApi(data);
        setAdditionalData(response);
      } catch (error: any) {
        console.error("Error fetching additional data:", error.message);
      } finally {
        setLoadingAdditionalData(false);
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };
  useEffect(() => {
    if (storedAddress) {
      searchAddress();
    }
  }, [storedAddress]);

  const updateAddress = (newAddress: any) => {
    setStoreAddress(newAddress);
    localStorage.setItem("IPlot_Address", JSON.stringify(newAddress));
  };

  return (
    <AddressContext.Provider
      value={{
        getAddress,
        loading,
        searchAddress,
        additionalData,
        loadingAdditionalData,
        LamdaData,
        loadingLamdaData,
        setStoreAddress,
        updateAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

const useAddress = () => {
  if (AddressContext) {
    const context = React.useContext(AddressContext);
    if (!context) {
      throw new Error("useAddress must be used within an AddressProvider");
    }
    return context;
  }
};

export { AddressProvider, useAddress };
