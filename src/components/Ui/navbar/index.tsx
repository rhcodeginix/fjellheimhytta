import React, { useEffect } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Button from "@/components/common/button";
import Link from "next/link";
import Ic_logo from "@/public/images/Ic_logo.svg";
import Ic_Avatar from "@/public/images/Ic_Avatar.png";
import Image from "next/image";
import { useUserLayoutContext } from "@/context/userLayoutContext";

const Header = () => {
  const { loginUser, setLoginUser } = useUserLayoutContext();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("min_tomt_login") === "true";
    setLoginUser(isLoggedIn);
  }, []);

  const handleLogin = () => {
    localStorage.setItem("min_tomt_login", "true");
    setLoginUser(true);
  };

  return (
    <>
      <div
        className="sticky w-full top-0 bg-[#fff] border-b border-[#F2F4F7]"
        style={{ zIndex: 9999 }}
      >
        <SideSpaceContainer>
          <div className="py-[12px] md:py-[20px] flex justify-between gap-[32px] items-center">
            <Link href={"/"} className="">
              <Image src={Ic_logo} alt="logo" />
            </Link>
            <div
              className="items-center justify-between flex"
              style={{ flexGrow: "1" }}
            >
              <div className="items-center gap-10 hidden md:flex">
                <Link
                  href={""}
                  className="text-base text-secondary font-medium"
                >
                  Hvordan fungerer MinTomt?
                </Link>
                <Link
                  href={""}
                  className="text-base text-secondary font-medium"
                >
                  Priser
                </Link>
                <Link
                  href={""}
                  className="text-base text-secondary font-medium"
                >
                  Referanser
                </Link>
                <Link
                  href={""}
                  className="text-base text-secondary font-medium"
                >
                  Kontakt
                </Link>
              </div>

              {loginUser ? (
                <div className="flex items-center gap-3">
                  <Image
                    src={Ic_Avatar}
                    alt="avatar"
                    className="rounded-full"
                  />
                  <span className="text-black font-medium text-base">
                    André Fenger
                  </span>
                </div>
              ) : (
                <Button
                  text="Logg inn"
                  className="border border-primary bg-primary text-white sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative"
                  onClick={handleLogin}
                />
              )}
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default Header;
