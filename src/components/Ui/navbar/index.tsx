import React, { useEffect, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Button from "@/components/common/button";
import Link from "next/link";
import Ic_logo from "@/public/images/Ic_logo.svg";
import Ic_Avatar from "@/public/images/Ic_Avatar.png";
import Ic_chevron_down from "@/public/images/Ic_chevron_down.svg";
import Image from "next/image";
import { useUserLayoutContext } from "@/context/userLayoutContext";
import { useRouter } from "next/router";

const Header = () => {
  const { loginUser, setLoginUser } = useUserLayoutContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("min_tomt_login") === "true";
    setLoginUser(isLoggedIn);
  }, []);
  const router = useRouter();
  const handleLogin = () => {
    localStorage.setItem("min_tomt_login", "true");
    setLoginUser(true);
  };
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
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
                <div className="relative">
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={toggleDropdown}
                  >
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
                    <Image src={Ic_chevron_down} alt="arrow" />
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-primary rounded-md shadow-lg">
                      <button
                        className="block px-4 py-2 text-sm text-black w-full text-left"
                        onClick={() => {
                          localStorage.removeItem("min_tomt_login");
                          localStorage.removeItem("Iplot_email");
                          setLoginUser(false);
                          router.push("/login");
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
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
