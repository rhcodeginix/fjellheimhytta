import ApiUtils from "@/api";
import React, { createContext, useState, useEffect, ReactNode } from "react";

const AddressContext = createContext<any | undefined>(undefined);

const AddressProvider = ({ children }: { children: ReactNode }) => {
  const [getAddress, setGetAddress] = useState<any | null>(null);
  const [storedAddress, setStoreAddress] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

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

      if (matches) {
        setGetAddress(matches);
      }
    } catch (error) {
      console.error("Error fetching address data:", error);
    } finally {
      setLoading(false);
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
        setStoreAddress,
        updateAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

const useAddress = () => {
  const context = React.useContext(AddressContext);
  if (!context) {
    throw new Error("useAddress must be used within an AddressProvider");
  }
  return context;
};

export { AddressProvider, useAddress };
