import React, { useEffect, useRef, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Button from "@/components/common/button";
import Link from "next/link";
import Ic_logo from "@/public/images/Ic_logo.svg";
import Ic_chevron_down from "@/public/images/Ic_chevron_down.svg";
import Image from "next/image";
import { useUserLayoutContext } from "@/context/userLayoutContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const Header = () => {
  const { loginUser, setLoginUser } = useUserLayoutContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("min_tomt_login") === "true";
    setLoginUser(isLoggedIn);
  }, []);
  const handleLogin = () => {
    localStorage.setItem("min_tomt_login", "true");
    setLoginUser(true);
  };
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const [userName, setUserName] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUserName(userData.name);
          } else {
            console.log("No such document in Firestore!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserName(null);
      }
    });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
                  {userName && (
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={toggleDropdown}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-[40px] h-[40px] flex items-center justify-center rounded-full border border-primary bg-lightPurple font-semibold">
                          {userName[0]}
                        </div>
                        <span className="text-black font-medium text-base">
                          {userName}
                        </span>
                      </div>
                      <Image src={Ic_chevron_down} alt="arrow" />
                    </div>
                  )}
                  {isDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white shadow-shadow1 rounded-md shadow-lg p-2"
                      ref={dropdownRef}
                    >
                      <Link
                        href={"/search-history"}
                        className="block px-4 py-2 text-sm hover:bg-lightPurple text-black w-full text-left cursor-pointer"
                        onClick={() => {
                          setIsDropdownOpen(false);
                        }}
                      >
                        Search History
                      </Link>
                      <Link
                        href={"/login"}
                        className="block px-4 py-2 text-sm hover:bg-lightPurple text-black w-full text-left cursor-pointer"
                        onClick={() => {
                          localStorage.removeItem("min_tomt_login");
                          localStorage.removeItem("Iplot_email");
                          setLoginUser(false);
                          setIsDropdownOpen(false);
                        }}
                      >
                        Logout
                      </Link>
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
