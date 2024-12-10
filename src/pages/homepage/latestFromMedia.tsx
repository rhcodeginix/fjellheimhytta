import React from "react";
import Img_latest_media1 from "@/public/images/Img_latest_media1.png";
import Img_latest_media2 from "@/public/images/Img_latest_media2.png";
import Img_latest_media3 from "@/public/images/Img_latest_media3.png";
import Ic_cross_right_arrow from "@/public/images/Ic_cross_right_arrow.svg";
import SideSpaceContainer from "@/components/common/sideSpace";
import Image from "next/image";
import Link from "next/link";

const LatestFromMedia = () => {
  return (
    <>
      <div className="py-[120px]">
        <SideSpaceContainer>
          <h2 className="text-black font-semibold text-[48px] leading-[56px] mb-[20px] text-center tracking-[-1px]">
            Siste fra media
          </h2>
          <p className="text-center text-secondary text-lg leading-[30px] mb-[60px]">
            Hold deg oppdatert med de nyeste artiklene og omtaler om iPlot. Her
            finner du <br /> siste nytt fra media om vår tjeneste og hvordan vi
            gjør byggeprosessen enklere.
          </p>
          <div className="w-full flex gap-8 items-center">
            <Link href={""} className="w-1/2 group">
              <Image
                src={Img_latest_media1}
                alt="image"
                className="w-full mb-8"
              />
              <h5 className="text-blue text-sm font-semibold mb-3">
                Finanavsien • 10 nov 2024
              </h5>
              <div className="flex items-center justify-between gap-4 mb-3">
                <h3 className="text-black font-semibold text-2xl">
                  MinTomt revolusjonerer tomteanalyse
                </h3>
                <Image
                  src={Ic_cross_right_arrow}
                  alt="arrow"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
              <p className="text-secondary text-base mb-6">
                Oppstartsselskapet <span className="font-bold">MinTomt</span>{" "}
                ønsker å gjør byggeprosessen analyseprosessen på ferdigregulerte
                tomter enklere med AI.
              </p>
              <div className="flex items-center gap-4">
                <span className="py-[2px] p-[10px] rounded-[16px] bg-lightPurple text-blue text-sm font-medium">
                  AI
                </span>
                <span className="py-[2px] p-[10px] rounded-[16px] bg-lightBlue text-blue2 text-sm font-medium">
                  Metergruppen
                </span>
                <span className="py-[2px] p-[10px] rounded-[16px] bg-lightPink text-pink text-sm font-medium">
                  Oppstartselskap
                </span>
              </div>
            </Link>
            <div className="w-1/2 h-full">
              <div className="flex flex-col gap-8 h-full">
                <div className="h-1/2 flex gap-[24px]">
                  <div className="w-[55%]">
                    <Image
                      src={Img_latest_media2}
                      alt="image"
                      className="w-full"
                    />
                  </div>
                  <div className="w-[45%]">
                    <h5 className="text-blue text-sm font-semibold mb-3">
                      Finanavsien • 10 nov 2024
                    </h5>
                    <h3 className="text-black font-semibold text-lg mb-4">
                      MinTomt revolusjonerer tomteanalyse
                    </h3>
                    <p className="text-secondary text-base mb-6">
                      Mestergruppen inngår samarbeid med{" "}
                      <span className="font-bold">MinTomt</span> for å forenkle
                      byggeprosessen for boligkjøpere. Med iPlot sin
                      avanserte...
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="py-[2px] p-[10px] rounded-[16px] bg-lightGreen2 text-green text-sm font-medium">
                        Metergruppen
                      </span>
                    </div>
                  </div>
                </div>
                <div className="h-1/2 flex gap-[24px]">
                  <div className="w-[55%]">
                    <Image
                      src={Img_latest_media3}
                      alt="image"
                      className="w-full"
                    />
                  </div>
                  <div className="w-[45%]">
                    <h5 className="text-blue text-sm font-semibold mb-3">
                      Phoenix Baker • 8 Nov 2024
                    </h5>
                    <h3 className="text-black font-semibold text-lg mb-4">
                      Vil gjøre det enkelere å bygge nytt
                    </h3>
                    <p className="text-secondary text-base mb-6">
                      Med AI og Mestergruppen på laget, skal MinTomt gjøre det
                      enklere for boligeiere å bygge drømmeboligen...
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="py-[2px] p-[10px] rounded-[16px] bg-lightPurple text-blue text-sm font-medium">
                        AI
                      </span>
                      <span className="py-[2px] p-[10px] rounded-[16px] bg-lightGreen3 text-green2 text-sm font-medium">
                        Nybygg
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default LatestFromMedia;
