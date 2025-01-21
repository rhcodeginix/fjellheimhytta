import React from "react";
import Img_product_3d_img1 from "@/public/images/Img_product_3d_img1.png";
import Img_product_3d_img2 from "@/public/images/Img_product_3d_img2.png";
import Image from "next/image";
import Img_product1 from "@/public/images/Img_product1.png";
import Img_product_logo1 from "@/public/images/Img_product_logo1.png";
import Img_product_map from "@/public/images/Img_product_map.png";
import ContactForm from "../stepperUi/contactForm";
import SideSpaceContainer from "@/components/common/sideSpace";
import Button from "@/components/common/button";
import { useRouter } from "next/router";
import AccordionTab from "../accordion/accordionTab";

const PropertyDetailPage: React.FC<any> = ({ handleNext, handlePrevious }) => {
  const router = useRouter();

  const sections = [
    {
      title: "Illustrasjoner",
      content: (
        <div className="w-full gap-6 flex">
          <div className="w-1/2">
            <Image src={Img_product_3d_img1} alt="image" className="w-full" />
          </div>
          <div className="w-1/2">
            <Image src={Img_product_3d_img2} alt="image" className="w-full" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative">
      <SideSpaceContainer>
        <div className="pt-[24px] pb-[86px]">
          <AccordionTab sections={sections} />
          <div className="w-full flex gap-[60px] mt-8">
            <div className="w-[43%]">
              <h4 className="text-black mb-6 font-semibold text-2xl">
                Almgaard
              </h4>
              <div className="relative">
                <Image
                  src={Img_product1}
                  alt="image"
                  className="w-full h-[262px] object-cover rounded-[12px] overflow-hidden"
                />
                <Image
                  src={Img_product_logo1}
                  alt="image"
                  className="absolute top-[12px] left-[12px] bg-[#FFFFFFB2] py-2 px-3 flex items-center justify-center rounded-[32px] w-auto"
                />
              </div>
              <div className="my-[20px] flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <p className="text-secondary text-base">Pris fra</p>
                  <h4 className="text-xl font-semibold text-black">
                    5.860.000 NOK
                  </h4>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-secondary text-sm">
                    <span className="text-black font-semibold">233</span> m
                    <sup>2</sup>
                  </div>
                  <div className="h-[12px] w-[1px] border-l border-gray"></div>
                  <div className="text-secondary text-sm">
                    <span className="text-black font-semibold">5</span> soverom
                  </div>
                  <div className="h-[12px] w-[1px] border-l border-gray"></div>
                  <div className="text-secondary text-sm">
                    <span className="text-black font-semibold">3</span> bad
                  </div>
                </div>
              </div>
              <div className="w-full flex gap-8 mb-[60px]">
                <div className="w-1/2 border-t-2 border-b-0 border-l-0 border-r-0 border-purple pt-4">
                  <table className="table-auto border-0 w-full text-left property_detail_tbl">
                    <tbody>
                      <tr>
                        <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                          BRA total
                        </td>
                        <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                          244 m<sup>2</sup>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                          BRA bolig
                        </td>
                        <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                          233 m<sup>2</sup>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                          P-rom:
                        </td>
                        <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                          221 m<sup>2</sup>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                          Bebygd Areal
                        </td>
                        <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                          152 m<sup>2</sup>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                          L x B:
                        </td>
                        <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                          14.3 x 12.8 m
                        </td>
                      </tr>
                      <tr>
                        <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                          Soverom
                        </td>
                        <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                          5
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="w-1/2 border-t-2 border-b-0 border-l-0 border-r-0 border-purple pt-4">
                  <table className="table-auto border-0 w-full text-left property_detail_tbl">
                    <tbody>
                      <tr>
                        <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                          Bad
                        </td>
                        <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                          3
                        </td>
                      </tr>
                      <tr>
                        <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                          Innvendig bod
                        </td>
                        <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                          3
                        </td>
                      </tr>
                      <tr>
                        <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                          Energimerking
                        </td>
                        <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                          B
                        </td>
                      </tr>
                      <tr>
                        <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                          Tilgjengelig bolig
                        </td>
                        <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                          Ja
                        </td>
                      </tr>
                      <tr>
                        <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                          Tomtetype
                        </td>
                        <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                          Flat tomt
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <h2 className="mb-6 text-black text-2xl font-semibold">
                Plantegninger og fasader
              </h2>
              <Image src={Img_product_map} alt="map" className="w-full" />
            </div>
            <div className="w-[57%]">
              <h2 className="text-black text-2xl font-semibold mb-4">
                Herskapelige Almgaard er en drømmebolig for familien
              </h2>
              <div className="flex flex-col gap-4 mb-[60px]">
                <p className="text-base text-secondary">
                  Lukk øynene. Se for deg opplevelsen av å komme inn i vakre
                  Almgaard. Her venter den majestetiske hallen på deg med over
                  fem meters takhøyde. Videre ledes du inn i selve hjertet i
                  huset – stueområdet på tilsammen nær 60 kvadratmeter og det
                  flotte kjøkkenet. Her er plass nok til å samle venner rundt
                  langbordet mens den myke kveldssola kaster et varmt lys inn
                  gjennom vinduene. Husets første etasje har også en avdeling
                  med gjestesoverom med walk-in closet, bad, wc, vaskerom og
                  bod.
                </p>
                <p className="text-base text-secondary">
                  Almgaard er et flott hus for flat tomt som kjennetegnes av
                  mansardtaket. I inngangshallen faller blikket raskt mot den
                  nydelige trappa som glir inn som et herskapelig møbel i
                  rommet, og inviterer deg opp til galleriet i 2. etasje. Her
                  oppe venter smarte løsninger med egen foreldreavdeling
                  bestående av soverom walk-in closet og et romslig bad. I den
                  andre fløyen av etasjen finner du barnas egen avdeling med
                  tv-stue og to soverom med ett bad i mellom. I tillegg er det
                  gjort plass til et hjemmekontor/ekstra soverom hvis det er
                  behov for det. 
                </p>
                <p className="text-base text-secondary">
                  Almgaard ble lansert i januar 2016 som den smarte
                  lillesøsteren til herskapelige Holmgaard – selve symbolet på
                  den store boligdrømmen for mange. I Almgaard har vi bevart
                  Holmgaards ettertraktede kvaliteter, men komprimert det inn på
                  233 kvadratmeter. Dermed har vi designet en herskapelig
                  familiedrøm. 
                </p>
              </div>
              <h2 className="text-black text-2xl font-semibold mb-4">
                Film av Almgaard
              </h2>

              <div
                style={{
                  width: "100%",
                  height: "400px",
                }}
                className="mb-8"
              >
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/JG5zEa754N8"
                  title="Almgaard"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
      </SideSpaceContainer>
      <div
        className="sticky bottom-0 bg-white py-6"
        style={{
          boxShadow:
            "0px -4px 6px -2px #10182808, 0px -12px 16px -4px #10182814",
        }}
      >
        <SideSpaceContainer>
          <div className="flex justify-end gap-4 items-center">
            <Button
              text="Tilbake"
              className="border border-lightPurple bg-lightPurple text-blue sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[46px] relative desktop:py-[16px]"
              onClick={() => {
                handlePrevious();
                router.push("/regulations");
              }}
            />
            <Button
              text="Gjør tilvalg"
              className="border border-primary bg-primary text-white sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
              onClick={() => {
                router.push("/regulations");
                handleNext();
              }}
            />
          </div>
        </SideSpaceContainer>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
