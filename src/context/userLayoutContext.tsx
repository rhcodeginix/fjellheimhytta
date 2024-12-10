import React, { createContext, useState, useContext, ReactNode } from "react";

type UserLayoutContextType = {
  loginUser: boolean;
  setLoginUser: (value: boolean) => void;
};

export const UserLayoutContext = createContext<
  UserLayoutContextType | undefined
>(undefined);

export const useUserLayoutContext = () => {
  const context = useContext(UserLayoutContext);
  if (!context) {
    throw new Error(
      "useUserLayoutContext must be used within UserLayoutProvider"
    );
  }
  return context;
};

export const UserLayoutProvider = ({ children }: { children: ReactNode }) => {
  const [loginUser, setLoginUser] = useState(false);

  return (
    <UserLayoutContext.Provider value={{ loginUser, setLoginUser }}>
      {children}
    </UserLayoutContext.Provider>
  );
};
