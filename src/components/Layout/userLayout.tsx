import React, { ReactNode, useEffect } from "react";
import Header from "../Ui/navbar";
import Footer from "../Ui/footer";
import { UserLayoutProvider } from "@/context/userLayoutContext";
import { AddressProvider } from "@/context/addressContext";
import Chatbot from "../Ui/chatbot";
import { useRouter } from "next/router";

type Props = {
  children: ReactNode;
};

const UserLayout = ({ children }: Props) => {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const { pathname } = router;

    if (!pathname.startsWith("/belop")) {
      localStorage.removeItem("soverom");
    }
    if (
      !pathname.startsWith("/housemodell-plot") &&
      !pathname.startsWith("/husmodells") &&
      !pathname.startsWith("/regulations")
    ) {
      localStorage.removeItem("customizeHouse");
    }
  }, [router.pathname, router.isReady]);
  return (
    <div>
      <Chatbot />

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
