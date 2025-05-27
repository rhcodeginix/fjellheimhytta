import React, { useEffect, useRef, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Link from "next/link";
import Ic_logo from "@/public/images/Ic_logo.svg";
import Ic_chevron_down from "@/public/images/Ic_chevron_down.svg";
import Ic_search_file from "@/public/images/Ic_search_file.svg";
import Ic_mic from "@/public/images/Ic_mic.svg";
import Ic_logout from "@/public/images/Ic_logout.svg";
import Image from "next/image";
import { useUserLayoutContext } from "@/context/userLayoutContext";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import Ic_vapp from "@/public/images/Ic_vapp.svg";
import { getVippsLoginUrl } from "@/utils/vippsAuth";
import { toast } from "@/hooks/use-toast";

const Header = () => {
  const { loginUser, setLoginUser } = useUserLayoutContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("min_tomt_login") === "true";
    setLoginUser(isLoggedIn);
  }, []);

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
            console.error("No such document in Firestore!");
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
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("min_tomt_login");
      localStorage.removeItem("I_plot_email");
      setLoginUser(false);
      setUserName(null);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  const handleVippsLogin = () => {
    try {
      const vippsUrl = getVippsLoginUrl();

      toast({
        title: "Redirecting to Vipps",
        description: `You'll be redirected to Vipps login page (${new URL(vippsUrl).origin}). Redirect URL: ${new URL(vippsUrl).searchParams.get("redirect_uri")}`,
      });

      setTimeout(() => {
        window.location.href = vippsUrl;
      }, 800);
    } catch (error) {
      console.error("Failed to initiate Vipps login:", error);
      toast({
        title: "Login Error",
        description: "Could not connect to Vipps. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div
        className="sticky w-full top-0 bg-[#fff] border-b border-[#F2F4F7]"
        id="navbar"
        style={{ zIndex: 9999 }}
      >
        <SideSpaceContainer>
          <div className="py-[12px] md:py-[20px] flex justify-between gap-3 md:gap-[32px] items-center">
            <div className="flex items-center gap-2">
              <Link href={"/"} onClick={() => router.push("/")}>
                <Image
                  src={Ic_logo}
                  alt="logo"
                  className="w-[120px] sm:w-[160px] lg:w-auto"
                  id="logo"
                  fetchPriority="auto"
                />
              </Link>
            </div>
            <div className="items-center justify-between flex lg:flex-grow">
              <div></div>

              {loginUser ? (
                <div className="relative">
                  {userName && (
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={toggleDropdown}
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-[32px] md:w-[40px] h-[32px] md:h-[40px] flex items-center justify-center rounded-full border border-primary bg-lightPurple font-semibold">
                          {userName[0]}
                        </div>
                        <span className="text-black font-medium text-sm md:text-base">
                          {userName}
                        </span>
                      </div>
                      <Image
                        src={Ic_chevron_down}
                        alt="arrow"
                        className="w-[20px] h-[20px] md:w-auto md:h-auto"
                        fetchPriority="auto"
                      />
                    </div>
                  )}
                  {isDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white shadow-shadow1 rounded-md shadow-lg p-2"
                      ref={dropdownRef}
                    >
                      <Link
                        href={"/search-history"}
                        className="px-2 py-1.5 text-sm hover:bg-lightPurple text-black w-full text-left cursor-pointer flex gap-2 items-center"
                        onClick={() => {
                          setIsDropdownOpen(false);
                        }}
                      >
                        <Image
                          src={Ic_search_file}
                          alt="search_file"
                          className="w-[20px] h-[20px] md:w-auto md:h-auto"
                          fetchPriority="auto"
                        />
                        Søkehistorikk
                      </Link>
                      <Link
                        href={"/add-plot-list"}
                        className="px-2 py-1.5 text-sm hover:bg-lightPurple text-black w-full text-left cursor-pointer flex gap-2 items-center"
                        onClick={() => {
                          setIsDropdownOpen(false);
                        }}
                      >
                        <Image
                          src={Ic_mic}
                          alt="mic"
                          className="w-[20px] h-[20px] md:w-auto md:h-auto"
                          fetchPriority="auto"
                        />
                        Annonser din tomt
                      </Link>
                      <Link
                        href={"/login"}
                        className="px-2 py-1.5 text-sm hover:bg-lightPurple text-black w-full text-left cursor-pointer flex gap-2 items-center"
                        onClick={handleLogout}
                      >
                        <Image
                          src={Ic_logout}
                          alt="logout"
                          className="w-[20px] h-[20px] md:w-auto md:h-auto"
                          fetchPriority="auto"
                        />
                        Logg ut
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onClick={handleVippsLogin}
                  className="text-white border border-[#DCDFEA] rounded-[8px] py-[10px] px-4 flex gap-2 justify-center items-center cursor-pointer text-xs sm:text-sm md:text-base"
                  style={{
                    backgroundColor: "#FF5C22",
                    boxShadow: "0px 1px 2px 0px #1018280D",
                  }}
                >
                  Fortsett med
                  <Image
                    fetchPriority="auto"
                    src={Ic_vapp}
                    alt="logo"
                    className="w-[45px] md:w-auto"
                  />
                </div>
              )}
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default Header;
