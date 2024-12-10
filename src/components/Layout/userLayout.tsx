import React, { ReactNode } from "react";
import Header from "../Ui/navbar";
import Footer from "../Ui/footer";
import { UserLayoutProvider } from "@/context/userLayoutContext";
import { AddressProvider } from "@/context/addressContext";

type Props = {
  children: ReactNode;
};

const UserLayout = ({ children }: Props) => {
  return (
    <div>
      <UserLayoutProvider>
        <AddressProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AddressProvider>
      </UserLayoutProvider>
    </div>
  );
};

export default UserLayout;
