import React from "react";
import { getVippsLoginUrl } from "@/utils/vippsAuth";
import Ic_vapp from "@/public/images/Ic_vapp.svg";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const VippsButton = () => {
  const { toast } = useToast();

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
    <div
      onClick={handleVippsLogin}
      className="text-white border border-[#DCDFEA] rounded-[8px] py-[10px] px-4 flex gap-2 justify-center items-center cursor-pointer text-sm md:text-base bg-primary"
      style={{
        boxShadow: "0px 1px 2px 0px #1018280D",
      }}
    >
      Fortsett med
      <Image
        fetchPriority="auto"
        src={Ic_vapp}
        alt="logo"
        className="w-[80px] lg:w-[100px]"
      />
    </div>
  );
};

export default VippsButton;
