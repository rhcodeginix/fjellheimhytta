import React, { useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import PropertyDetail from "@/components/Ui/stepperUi/propertyDetail";
import AccordionTab from "@/components/Ui/accordion/accordionTab";
import Img_product_3d_img1 from "@/public/images/Img_product_3d_img1.png";
import Img_product_3d_img2 from "@/public/images/Img_product_3d_img2.png";
import Image from "next/image";
import Button from "@/components/common/button";
import PropertyDetailWithPrice from "@/components/Ui/stepperUi/productDetailWithPrice";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import Ic_product_detail_avatar from "@/public/images/Ic_product_detail_avatar.svg";
import Ic_product_detail_position from "@/public/images/Ic_product_detail_position.svg";
import Ic_info_circle from "@/public/images/Ic_info_circle.svg";
import Ic_phone from "@/public/images/Ic_phone.svg";
import Ic_mail from "@/public/images/Ic_mail.svg";
import Ic_spareBank from "@/public/images/Ic_spareBank.svg";
import Ic_contact from "@/public/images/Ic_contact.svg";

const Oppsummering: React.FC<any> = ({ handlePrevious }) => {
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

  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const validationSchema = Yup.object().shape({
    checkbox: Yup.boolean().oneOf([true], "Required").required("Required"),
  });

  const handleSubmit = async (values: any) => {
    console.log(values);
  };

  const [isContactChecked, setIsContactChecked] = useState(false);
  const handleContactCheckboxChange = () => {
    setIsContactChecked(!isContactChecked);
  };
  const validationContactSchema = Yup.object().shape({
    contactCheckbox: Yup.boolean()
      .oneOf([true], "Required")
      .required("Required"),
  });

  const handleContactSubmit = async (values: any) => {
    console.log(values);
  };

  return (
    <div className="relative">
      <PropertyDetail isShow={true} />
      <SideSpaceContainer>
        <div className="pt-[24px] pb-[147px]">
          <AccordionTab sections={sections} />
          <h3 className="text-black text-2xl font-semibold my-6">
            Oppsummering
          </h3>
          <div className="mb-[40px]">
            <PropertyDetailWithPrice />
          </div>
          <div className="flex gap-[48px] w-full">
            <div className="w-[42%]">
              <Formik
                initialValues={{ checkbox: false }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, setFieldValue, errors, touched }) => (
                  <Form className="flex flex-col h-full">
                    <h3 className="text-black mb-6 text-2xl">
                      <span className="font-bold">Book møte</span> med din{" "}
                      <span className="font-bold">boligkonsulent:</span>
                    </h3>
                    <div
                      className="rounded-[8px] p-5 flex flex-col justify-between"
                      style={{
                        boxShadow:
                          "0px 1px 2px 0px #1018280F, 0px 4px 16px 0px #1018281A",
                        flexGrow: 1,
                      }}
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-3 w-full">
                          <div className="w-[13%]">
                            <Image
                              src={Ic_product_detail_avatar}
                              alt="avatar"
                              className="w-full"
                            />
                          </div>
                          <div className="w-[87%]">
                            <div className="flex mb-3 justify-between w-full items-start">
                              <div>
                                <h4 className="text-black mb-1 text-xl font-semibold">
                                  Simen Wolmer
                                </h4>
                                <p className="text-secondary text-base font-medium">
                                  Boligkonsulent
                                </p>
                              </div>
                              <Image
                                src={Ic_product_detail_position}
                                alt="logo"
                                className="w-[108px]"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-[6px] text-sm font-medium text-secondary">
                                <Image src={Ic_mail} alt="mail" />{" "}
                                simen.wolmer@boligpartner.no
                              </div>
                              <div className="flex items-center gap-[6px] text-sm font-medium text-secondary">
                                <Image src={Ic_phone} alt="phone" /> +47 958 01
                                043
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border w-full border-t border-b-0 border-r-0 border-l-0 border-darkGray"></div>
                        <p className="text-secondary font-medium text-base">
                          Ved å booke tid vil{" "}
                          <span className="font-bold">
                            Simen Wolmer i BoligPartner
                          </span>{" "}
                          ringe deg etter å satt seg godt inn i din drømmebolig.{" "}
                          <span className="font-bold">BoligPartner</span> vil ha
                          tilgang til informasjonen du har lagt igjen her på{" "}
                          <span className="font-bold">MinTomt</span> for at dere
                          får en mest effektiv prosess og for at{" "}
                          <span className="font-bold">BoligPartner</span> skal
                          forstå dine ønsker.
                        </p>
                        <div>
                          <label className="flex items-center gap-[12px] container">
                            <Field
                              type="checkbox"
                              name="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                setFieldValue("checkbox", !values.checkbox);
                                handleCheckboxChange();
                              }}
                            />
                            <span
                              className="checkmark checkmark_primary"
                              style={{ margin: "2px" }}
                            ></span>

                            <div className="text-secondary text-sm font-semibold">
                              Jeg aksepterer{" "}
                              <span className="text-black">
                                {" "}
                                deling av data
                              </span>{" "}
                              med{" "}
                              <span className="text-black">BoligPartner.</span>
                            </div>
                          </label>
                          {errors.checkbox && touched.checkbox && (
                            <div className="text-red text-sm">
                              {errors.checkbox}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          text="Send inn"
                          className="border border-primary bg-primary text-white sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                          type="submit"
                        />
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="w-[58%]">
              <h3 className="text-black text-2xl mb-6">
                Behov for <span className="font-semibold">finansiering?</span>
              </h3>
              <div
                className="rounded-[8px] p-6 gap-6 flex flex-col"
                style={{
                  boxShadow:
                    "0px 1px 2px 0px #1018280F, 0px 4px 16px 0px #1018281A",
                }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-black text-2xl font-medium">
                    Søk byggelån{" "}
                    <span className="font-semibold">(10.608.690 NOK)</span> hos:
                  </h3>
                  <Image src={Ic_spareBank} alt="icon" />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="text-secondary text-base font-medium">
                      <span className="text-black font-bold">
                        Nominell rente{" "}
                      </span>
                      fra:
                    </div>
                    <h6 className="text-black font-bold text-base">8,75%</h6>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-secondary text-base font-medium">
                      <span className="text-black font-bold">
                        Effektiv rente med{" "}
                      </span>
                      byggelånsramme på 2 <br /> mill. ved 100% utnyttelse:
                    </div>
                    <h6 className="text-black font-bold text-base">11,01%</h6>
                  </div>
                  <div className="border w-full border-t border-b-0 border-r-0 border-l-0 border-darkGray"></div>
                  <div className="flex items-center justify-between">
                    <div className="text-secondary text-base font-medium">
                      Estimert kostnad per måned
                    </div>
                    <h6 className="text-black font-semibold text-xl">
                      57.640 NOK
                    </h6>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    text="Send inn søknad"
                    className="border border-primary bg-primary text-white sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative"
                  />
                </div>
                <div className="flex items-start gap-4">
                  <Image src={Ic_info_circle} alt="icon" />
                  <p className="text-secondary text-base font-medium">
                    Låneramme til oppføring av bolig/fritidsbolig. Blir gjort om
                    til nedbetalingslån ved ferdigstilling av
                    bolig/fritidsbolig. Rente vil variere ut fra
                    helhetsvurdering av betalingsevne og sikkerhet.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="my-7">
            <h4 className="text-black text-xl mb-7">
              Vil du få en <span className="font-bold">forhåndstakst</span> fra
              en megler i <span className="font-bold">EIE Eiendomsmegling</span>
              ?
            </h4>
            <div
              className="p-6"
              style={{ boxShadow: "0px 4px 16px 0px #0000001A" }}
            >
              <Formik
                initialValues={{ contactCheckbox: false }}
                validationSchema={validationContactSchema}
                onSubmit={handleContactSubmit}
              >
                {({ values, setFieldValue, errors, touched }) => (
                  <Form className="flex flex-col h-full gap-6">
                    <div className="flex gap-6">
                      <div className="flex items-start gap-3 w-1/2">
                        <Image src={Ic_info_circle} alt="icon" />
                        <p className="text-secondary text-base font-medium">
                          Et byggelån krever en forhåndsktakst på prosjektet,
                          ved en høyere{" "}
                          <span className="font-bold">eTakst</span> enn
                          byggekostnad, vil du kunne bruke dette som egenkapital
                          ovenfor banken.
                        </p>
                      </div>
                      <div className="w-1/2">
                        <label className="flex items-center gap-[12px] container">
                          <Field
                            type="checkbox"
                            name="contactCheckbox"
                            checked={isChecked}
                            onChange={() => {
                              setFieldValue(
                                "contactCheckbox",
                                !values.contactCheckbox
                              );
                              handleContactCheckboxChange();
                            }}
                          />
                          <span
                            className="checkmark checkmark_primary"
                            style={{ margin: "2px" }}
                          ></span>
                          <div className="text-secondary text-sm font-medium">
                            Jeg aksepterer{" "}
                            <span className="font-bold underline">
                              deling av data
                            </span>{" "}
                            med{" "}
                            <span className="font-bold">
                              Eie Eiendomsmegling
                            </span>
                            , slik at de kan kontakte meg for{" "}
                            <span className="font-bold">forhåndstakst</span> og
                            <span className="font-bold">
                              verdivurdering av eksisterende bolig.
                            </span>{" "}
                            Samlet gir dette et bilde på egenkapital som kan
                            være nødvendig for å få byggelån.
                          </div>
                        </label>
                        {errors.contactCheckbox && touched.contactCheckbox && (
                          <div className="text-red text-sm">
                            {errors.contactCheckbox}
                          </div>
                        )}
                      </div>
                      <Image src={Ic_contact} alt="icon" />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        text="Kontakt meg"
                        className="border border-primary bg-primary text-white sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                        type="submit"
                      />
                    </div>
                  </Form>
                )}
              </Formik>
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
              text="Send inn"
              className="border border-primary bg-primary text-white sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
            />
          </div>
        </SideSpaceContainer>
      </div>
    </div>
  );
};

export default Oppsummering;
