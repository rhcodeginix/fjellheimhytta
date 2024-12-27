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

  // const searchAddress = async () => {
  //   if (!storedAddress) {
  //     console.error("No address data to search.");
  //     setLoading(false);
  //     return;
  //   }

  //   const queryParams = storedAddress;
  //   try {
  //     const result = await ApiUtils.getSingleAddress(queryParams);
  //     const matches = result.adresser.find(
  //       (address: any) =>
  //         JSON.stringify(address) === JSON.stringify(queryParams)
  //     );
  //     const lamdaApiData: any = {
  //       kommunenummer: matches.kommunenummer,
  //       gardsnummer: matches.gardsnummer,
  //       bruksnummer: matches.bruksnummer,
  //     };

  //     if (matches) {
  //       setGetAddress(matches);
  //       await fetchLamdaData(lamdaApiData);
  //       await fetchAdditionalData(matches.kommunenavn);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching address data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

      if (matches) {
        setGetAddress(matches);

        // Fetch Lamda Data
        const lamdaApiData: any = {
          kommunenummer: matches.kommunenummer,
          gardsnummer: matches.gardsnummer,
          bruksnummer: matches.bruksnummer,
        };

        await fetchLamdaData(lamdaApiData);

        // Extract areaDetails from LamdaData if available
        const bodyContent = LamdaData?.body?.replace(/```json|```/g, "").trim();

        if (bodyContent) {
          const parsedData = JSON.parse(bodyContent);

          const areaDetails = parsedData?.areaInformation?.beregnetAreal || "";

          // Fetch additional data with areaDetails
          await fetchAdditionalData(matches.kommunenavn, areaDetails);
        } else {
          console.warn("LamdaData does not contain valid body content.");
        }
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
      localStorage.setItem("LamdaData", JSON.stringify(response));
    } catch (error: any) {
      console.error("Error fetching additional data:", error?.message);
    } finally {
      setLoadingLamdaData(false);
    }
  };
  // useEffect(() => {
  //   const savedLamdaData = localStorage.getItem("LamdaData");
  //   if (savedLamdaData) {
  //     setLamdaData(JSON.parse(savedLamdaData));
  //   }
  // }, []);
  useEffect(() => {
    const savedLamdaData = localStorage.getItem("LamdaData");
    if (savedLamdaData) {
      try {
        setLamdaData(JSON.parse(savedLamdaData));
      } catch (error) {
        console.error(
          "Failed to parse savedLamdaData from localStorage:",
          error
        );
        // Optionally clear the invalid data from localStorage to avoid repeated errors
        localStorage.removeItem("LamdaData");
      }
    }
  }, []);

  // const fetchAdditionalData = async (kommunenavn: string) => {

  //   const bodyContent = LamdaData?.body?.replace(/```json|```/g, "").trim();

  //   if (!bodyContent) {
  //     console.error("LamdaData body is empty or undefined");
  //     return;
  //   }

  //   let areaDetails = "";

  //   try {
  //     const parsedData = JSON.parse(bodyContent); // Parse JSON safely
  //     areaDetails = parsedData?.areaDetails || "";

  //     if (!areaDetails) {
  //       console.warn("Parsed data does not contain 'areaDetails'");
  //       return;
  //     }

  //     const data = {
  //       question: `Hva er tillatt gesims- og mønehøyde, maksimal BYA inkludert parkeringskrav i henhold til parkeringsnormen i ${kommunenavn} kommune, og er det tillatt å bygge en enebolig med flatt tak eller takterrasse i dette området i ${kommunenavn}, sone GB? Tomtestørrelse for denne eiendommen er ${areaDetails}.`,
  //     };

  //     setLoadingAdditionalData(true);

  //     try {
  //       const response = await ApiUtils.askApi(data);
  //       setAdditionalData(response); // Store API response in state
  //     } catch (error: any) {
  //       console.error(
  //         "Error fetching additional data from askApi:",
  //         error?.message
  //       );
  //     } finally {
  //       setLoadingAdditionalData(false);
  //     }
  //   } catch (error) {
  //     console.error("Error parsing JSON from LamdaData body:", error);
  //   }
  // };
  const fetchAdditionalData = async (
    kommunenavn: string,
    areaDetails: string
  ) => {
    if (!areaDetails) {
      console.warn("Cannot fetch additional data without areaDetails.");
      return;
    }

    const data = {
      question: `Hva er tillatt gesims- og mønehøyde, maksimal BYA inkludert parkeringskrav i henhold til parkeringsnormen i ${kommunenavn} kommune, og er det tillatt å bygge en enebolig med flatt tak eller takterrasse i dette området i ${kommunenavn}, sone GB? Tomtestørrelse for denne eiendommen er ${areaDetails}.`,
    };

    setLoadingAdditionalData(true);

    try {
      const response = await ApiUtils.askApi(data);
      setAdditionalData(response); // Store API response in state
    } catch (error: any) {
      console.error(
        "Error fetching additional data from askApi:",
        error?.message
      );
    } finally {
      setLoadingAdditionalData(false);
    }
  };
  useEffect(() => {
    if (storedAddress) {
      searchAddress();
    }
  }, [storedAddress]);

  const updateAddress = (newAddress: any) => {
    setStoreAddress(newAddress);
    if (newAddress) {
      localStorage.setItem("IPlot_Address", JSON.stringify(newAddress));
    }
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
