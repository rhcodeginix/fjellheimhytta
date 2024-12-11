import React from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import AccordionTab from "@/components/Ui/accordion/accordionTab";
import Img_product_3d_img1 from "@/public/images/Img_product_3d_img1.png";
import Img_product_3d_img2 from "@/public/images/Img_product_3d_img2.png";
import Image from "next/image";
import Button from "@/components/common/button";
import PropertyDetailWithPrice from "@/components/Ui/stepperUi/productDetailWithPrice";
import Ic_info_circle from "@/public/images/Ic_info_circle.svg";
import Ic_plus from "@/public/images/Ic_plus.svg";
import ContactForm from "@/components/Ui/stepperUi/contactForm";
import PropertyHusmodellDetail from "@/components/Ui/stepperUi/propertyHusmodellDetail";

const Okonomi: React.FC<any> = ({ handleNext, handlePrevious }) => {
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

  return (
    <div className="relative">
      <PropertyHusmodellDetail isShow={true} />
      <SideSpaceContainer>
        <div className="pt-[24px] pb-[147px]">
          <AccordionTab sections={sections} />
          <h3 className="text-black text-2xl font-semibold my-6">
            Økonomisk plan og detaljer
          </h3>
          <div className="mb-[40px]">
            <PropertyDetailWithPrice />
          </div>
          <div
            style={{
              boxShadow:
                "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
            }}
          >
            <div className="flex items-center w-full bg-lightPurple">
              <div className="w-1/2 text-center py-[10px] text-black font-medium text-xl">
                BYGGEKOSTNADER
              </div>
              <div className="w-1/2 text-center py-[10px] text-black font-medium text-xl">
                TOMTEKOSTNADER
              </div>
            </div>
            <div className="flex p-5 gap-[48px] mb-[40px]">
              <div className="w-1/2 flex flex-col gap-4">
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">
                      Utgraving av byggegrube og tilbakefylling
                    </p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    650.000 NOK*
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">
                      Grunnmur/fundamentering, plate på mark/sokkel
                    </p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    inkl. i tilbud
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">
                      Støpte gulv på våtrom
                    </p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    inkl. i tilbud
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">
                      Utvendig forblending pipe/vegg
                    </p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    ikke aktuelt
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">
                      Stålpipe sort inkl beslag og sort peisovn
                    </p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    inkl. i tilbud
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">Utvendig trapper</p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    inkl. i tilbud
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">
                      Sanitærutsyr og "rør i rør" opplegg
                    </p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    inkl. i tilbud
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">
                      Bunnledninger (oppstikk i betongplate VA)
                    </p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    inkl. i tilbud
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">
                      Evt. rørlegger arbeid/materiell
                    </p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    inkl. i tilbud
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">
                      Elektriker NEK400 (utstyr og arbeid)
                    </p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    inkl. i tilbud
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">
                      Evt. ekstra elektriske punkter, belysning/downlights* 50
                      stk. DL
                    </p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    inkl. i tilbud
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">Varmekabler</p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    ikke aktuelt
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">
                      Vannboren varme (prosjekt anbud)
                    </p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    inkl. i tilbud
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">Flislegger</p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    inkl. i tilbud
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">
                      Maling, tapet, gulvbelegg utvendig beis/maling
                    </p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    inkl. i tilbud
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">Byggestrøm</p>
                  </div>
                  <h4 className="text-black font-medium text-base">30.000</h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">Renovasjon</p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    inkl. i tilbud
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">Byggevask</p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    inkl. i tilbud
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">Byggesaksgebyr</p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    inkl. i tilbud
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">Byggelånsrenter</p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    inkl. i tilbud
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">
                      Uforutsette kostnader
                    </p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    50.000 NOK
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">
                      Uavhengig kontroll
                    </p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    25.000 NOK
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">
                      Oppgradering kjøkken - evt. annen innredning
                    </p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    inkl. i tilbud
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">
                      Leveranse fra Bolig Partner AS
                    </p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    8.300.000 NOK
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">
                      Antatt prisstigning til den 15.i den måned tømrerne
                      starter
                    </p>
                  </div>
                  <h4 className="text-black font-medium text-base">0 NOK</h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base font-bold">
                      Sum byggkostnader
                    </p>
                  </div>
                  <h4 className="text-black font-bold text-base">
                    8.451.200 NOK
                  </h4>
                </div>
              </div>
              <div className="w-1/2 flex flex-col gap-4">
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">Tomtekjøp</p>
                  </div>
                  <h4 className="text-black font-medium text-base flex items-center gap-3">
                    <Image src={Ic_plus} alt="image" /> Legg til
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">
                      Oppmåling, tinglysning, målebrev, dokumentavgift
                    </p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    137.490 NOK
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">
                      Tilknytningsavgift vann og kloakk
                    </p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    70.000 NOK
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">
                      Tilknytningsavgift for strøm og fiber/bredbånd
                    </p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    15.000 NOK
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">
                      Inntakskabel strøm og jordelektrode
                    </p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    inkl. i tilbud
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">
                      Stikkgrøft med ledninger og kummer
                    </p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    inkl. i tilbud
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">
                      Utstikking og kontrollmåling av plassering
                    </p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    inkl. i tilbud
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">
                      Stikkveier på tomta
                    </p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    inkl. i tilbud
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base">
                      Planering og andre tomtearbeider utenom utgraving
                    </p>
                  </div>
                  <h4 className="text-black font-medium text-base">
                    inkl. i tilbud
                  </h4>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={Ic_info_circle} alt="icon" />
                    <p className="text-secondary text-base font-bold">
                      Sum tomtekostnader
                    </p>
                  </div>
                  <h4 className="text-black font-bold text-base">
                    5.657.490 NOK
                  </h4>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between w-full">
            <div className="w-[42%]">
              <ContactForm />
            </div>
            <div className="w-[58%]">
              <p className="text-secondary text-lg mb-2 text-right">
                Sum antatte anleggskostnader inkl. mva og tomtekostnad
              </p>
              <h5 className="text-black font-bold text-2xl text-right">
                14.108.690
              </h5>
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
              text="Søk finansiering"
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

export default Okonomi;
