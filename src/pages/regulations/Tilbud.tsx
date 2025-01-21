import React from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import PropertyDetail from "@/components/Ui/stepperUi/propertyDetail";
import AccordionTab from "@/components/Ui/accordion/accordionTab";
import Img_product_3d_img1 from "@/public/images/Img_product_3d_img1.png";
import Img_product_3d_img2 from "@/public/images/Img_product_3d_img2.png";
import Image from "next/image";
import ContactForm from "@/components/Ui/stepperUi/contactForm";
import Img_product1 from "@/public/images/Img_product1.png";
import Img_product_logo1 from "@/public/images/Img_product_logo1.png";
import Button from "@/components/common/button";
import Ic_inside_Kjøkken from "@/public/images/Ic_inside_Kjøkken.svg";
import Ic_inside_Parkett from "@/public/images/Ic_inside_Parkett.svg";
import Ic_Tegning_og_byggesøknad from "@/public/images/Ic_Tegning_og_byggesøknad.svg";
import Ic_inside_VVS from "@/public/images/Ic_inside_VVS.svg";
import Ic_outside_elektro from "@/public/images/Ic_outside_elektro.svg";
import Ic_outside_garasje from "@/public/images/Ic_outside_garasje.svg";
import Ic_Tilbud_line from "@/public/images/Ic_Tilbud_line.svg";
import Ic_Graving_og_terrengarbeider from "@/public/images/Ic_Graving_og_terrengarbeider.svg";
import Ic_Betongarbeider from "@/public/images/Ic_Betongarbeider.svg";

const Tilbud: React.FC<any> = ({ handleNext, handlePrevious }) => {
  const sections = [
    {
      title: "Illustrasjonsbilder",
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

  const offerInclude = [
    {
      id: 1,
      imageSrc: Ic_inside_Parkett,
      title: "Almgaard",
      description: "BoligPartner",
    },
    {
      id: 2,
      imageSrc: Ic_inside_Kjøkken,
      title: "Kjøkken",
      description: "Drømmekjøkkenet",
    },
    {
      id: 3,
      imageSrc: Ic_outside_elektro,
      title: "Elektro",
      description: "Inkludert",
    },
    {
      id: 4,
      imageSrc: Ic_inside_VVS,
      title: "VVS",
      description: "Inkludert",
    },
    {
      id: 5,
      imageSrc: Ic_Betongarbeider,
      title: "Betongarbeider",
      description: "Inkludert",
    },
    {
      id: 6,
      imageSrc: Ic_Tegning_og_byggesøknad,
      title: "Tegning og byggesøknad",
      description: "Søknad uten dispenensjoner",
    },
  ];
  const outsideItems = [
    {
      id: 1,
      imageSrc: Ic_Graving_og_terrengarbeider,
      title: "Graving og terrengarbeider",
      description: "BoligPartner",
    },
    {
      id: 2,
      imageSrc: Ic_outside_garasje,
      title: "Tomt",
      description: "Pris fra",
    },
  ];
  return (
    <div className="relative">
      <PropertyDetail isShow={true} />
      <SideSpaceContainer>
        <div className="pt-[24px] pb-[147px]">
          <AccordionTab sections={sections} />
          <h4 className="text-black mb-6 mt-8 font-semibold text-2xl">
            Tilbud
          </h4>
          <div className="w-full flex gap-[60px]">
            <div className="w-[43%]">
              <div
                style={{
                  boxShadow:
                    "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
                }}
                className="rounded-[8px] overflow-hidden mb-8"
              >
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
                <div className="p-6">
                  <h4 className="text-black mb-2 text-lg font-medium">
                    Herskapelige Almgaard er en drømmebolig for familien
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="text-secondary text-sm">
                      <span className="text-black font-semibold">233</span> m
                      <sup>2</sup>
                    </div>
                    <div className="h-[12px] w-[1px] border-l border-gray"></div>
                    <div className="text-secondary text-sm">
                      <span className="text-black font-semibold">5</span>{" "}
                      soverom
                    </div>
                    <div className="h-[12px] w-[1px] border-l border-gray"></div>
                    <div className="text-secondary text-sm">
                      <span className="text-black font-semibold">3</span> bad
                    </div>
                  </div>
                </div>
                <div className="px-6 flex items-center gap-1 mb-5">
                  <div className="flex flex-col gap-1 w-max">
                    <p className="text-secondary text-sm whitespace-nowrap">
                      ESTIMERT BYGGESTART
                    </p>
                    <h5 className="text-black text-xl font-semibold whitespace-nowrap">
                      03.01.2025
                    </h5>
                  </div>
                  <div className="w-full">
                    <Image
                      src={Ic_Tilbud_line}
                      alt="image"
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-max">
                    <p className="text-secondary text-sm whitespace-nowrap">
                      ESTIMERT INNFLYTTING
                    </p>
                    <h5 className="text-black text-xl font-semibold text-right whitespace-nowrap">
                      23.11.2025
                    </h5>
                  </div>
                </div>
                <div className="bg-lightPurple p-3">
                  <p className="text-base text-secondary text-center">
                    Tilbudpris
                  </p>
                  <h3 className="text-black font-semibold text-[32px] text-center">
                    8.300.000 NOK
                  </h3>
                  <div className="text-secondary text-base text-center">
                    Tilbudet er gyldig til{" "}
                    <span className="font-semibold text-black">01.12.2024</span>
                  </div>
                </div>
              </div>
              <ContactForm />
            </div>
            <div className="w-[57%]">
              <div>
                <h2 className="text-black text-xl mb-6">
                  Ditt tilbud på Almgaard{" "}
                  <span className="font-semibold">(Almgaard)</span> inkluderer
                </h2>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {offerInclude.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-[8px] p-4 flex items-center gap-3`}
                    >
                      <Image
                        src={item.imageSrc}
                        alt={item.title}
                        className="rounded-full overflow-hidden w-[80px] h-[80px]"
                      />
                      <div>
                        <h6 className="text-black font-medium text-lg mb-2">
                          {item.title}
                        </h6>
                        <h5 className="text-secondary text-sm">
                          {item.description}
                        </h5>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-black text-xl font-semibold mb-6">
                  Her kan du gjøre dine tilvalg{" "}
                  <span className="font-extrabold">(utvendig)</span>
                </h2>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {outsideItems.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-[8px] p-4 flex items-center gap-3`}
                    >
                      <Image
                        src={item.imageSrc}
                        alt={item.title}
                        className="rounded-full overflow-hidden w-[80px] h-[80px]"
                      />
                      <div>
                        <h6 className="text-black font-medium text-lg mb-2">
                          {item.title}
                        </h6>
                        <h5 className="text-secondary text-sm">
                          {item.description}
                        </h5>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
              }}
            />
            <Button
              text="Se detaljer"
              className="border border-primary bg-primary text-white sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
              onClick={() => {
                handleNext();
              }}
            />
          </div>
        </SideSpaceContainer>
      </div>
    </div>
  );
};

export default Tilbud;
