import React from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import AccordionTab from "@/components/Ui/accordion/accordionTab";
import Img_product_3d_img1 from "@/public/images/Img_product_3d_img1.png";
import Img_product_3d_img2 from "@/public/images/Img_product_3d_img2.png";
import Image from "next/image";
import Button from "@/components/common/button";
import PropertyDetailWithPrice from "@/components/Ui/stepperUi/productDetailWithPrice";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import Ic_spareBank from "@/public/images/Ic_spareBank.svg";
import Ic_info_circle from "@/public/images/Ic_info_circle.svg";
import ContactForm from "@/components/Ui/stepperUi/contactForm";

const Finansiering: React.FC<any> = ({ handleNext, handlePrevious }) => {
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

  const validationSchema = Yup.object().shape({
    existingLoan: Yup.string()
      .oneOf(["JA", "NEI"], "Please select an option")
      .required("Påkrevd"),
    previousExperience: Yup.string()
      .oneOf(["JA", "NEI"], "Please select an option")
      .required("Påkrevd"),
    collateral: Yup.string()
      .oneOf(["JA", "NEI"], "Please select an option")
      .required("Påkrevd"),
    permissions: Yup.string()
      .oneOf(["JA", "NEI"], "Please select an option")
      .required("Påkrevd"),
    buffer: Yup.string()
      .oneOf(["JA", "NEI"], "Please select an option")
      .required("Påkrevd"),
    equityAmount: Yup.number()
      .typeError("Must be a number")
      .min(1, "Amount must be greater than 0")
      .required("Påkrevd"),
    sharingData: Yup.boolean()
      .oneOf([true], "You must accept the sharing data")
      .required("Påkrevd"),
  });

  const handleSubmit = async (values: any) => {
    console.log(values);
  };

  return (
    <div className="relative">
      <SideSpaceContainer>
        <div className="pt-[24px] pb-[147px]">
          <AccordionTab sections={sections} />
          <h3 className="text-black text-2xl font-semibold my-6">Detaljer</h3>
          <div className="mb-[40px]">
            <PropertyDetailWithPrice />
          </div>
          <Formik
            initialValues={{
              existingLoan: "",
              previousExperience: "",
              collateral: "",
              permissions: "",
              buffer: "",
              equityAmount: "",
              sharingData: true,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, errors, touched }) => (
              <Form>
                <div className="w-full flex gap-[60px]">
                  <div
                    className="w-[34%] rounded-[8px] p-6 flex-col gap-6 flex"
                    style={{ boxShadow: "0px 4px 16px 0px #0000001A" }}
                  >
                    <h3 className="text-black text-xl font-semibold">
                      SPØRSMÅL TIL LÅNESØKNAD
                    </h3>

                    <div>
                      <h5 className="text-sm font-medium text-black mb-1">
                        Eksisterende lån
                      </h5>
                      <p className="text-xs text-secondary mb-4">
                        Har du eksisterende lån, gjeld eller andre økonomiske
                        forpliktelser?
                      </p>
                      <div className="w-full flex items-center gap-4">
                        <Button
                          text="NEI"
                          className={`w-1/2 border ${
                            values.existingLoan === "NEI"
                              ? "bg-primary text-white"
                              : "border-lightPurple bg-lightPurple text-blue"
                          } sm:text-base rounded-[8px] h-[36px] md:h-[40px] lg:h-[48px] font-medium`}
                          onClick={() => setFieldValue("existingLoan", "NEI")}
                        />
                        <Button
                          text="JA"
                          className={`w-1/2 border ${
                            values.existingLoan === "JA"
                              ? "bg-primary text-white"
                              : "border-lightPurple bg-lightPurple text-blue"
                          } sm:text-base rounded-[8px] h-[36px] md:h-[40px] lg:h-[48px] font-medium`}
                          onClick={() => setFieldValue("existingLoan", "JA")}
                        />
                      </div>
                      {touched.existingLoan && errors.existingLoan && (
                        <p className="text-red text-xs">
                          {errors.existingLoan}
                        </p>
                      )}
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-black mb-1">
                        Tidligere erfaringer
                      </h5>
                      <p className="text-xs text-secondary mb-4">
                        Har du tidligere erfaring med byggelån eller større
                        byggeprosjekter?
                      </p>
                      <div className="w-full flex items-center gap-4">
                        <Button
                          text="NEI"
                          className={`w-1/2 border ${
                            values.previousExperience === "NEI"
                              ? "bg-primary text-white"
                              : "border-lightPurple bg-lightPurple text-blue"
                          } sm:text-base rounded-[8px] h-[36px] md:h-[40px] lg:h-[48px] font-medium`}
                          onClick={() =>
                            setFieldValue("previousExperience", "NEI")
                          }
                        />
                        <Button
                          text="JA"
                          className={`w-1/2 border ${
                            values.previousExperience === "JA"
                              ? "bg-primary text-white"
                              : "border-lightPurple bg-lightPurple text-blue"
                          } sm:text-base rounded-[8px] h-[36px] md:h-[40px] lg:h-[48px] font-medium`}
                          onClick={() =>
                            setFieldValue("previousExperience", "JA")
                          }
                        />
                      </div>
                      {touched.previousExperience &&
                        errors.previousExperience && (
                          <p className="text-red text-xs">
                            {errors.previousExperience}
                          </p>
                        )}
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-black mb-1">
                        Pant
                      </h5>
                      <p className="text-xs text-secondary mb-4">
                        Er det noe pant på eiendommer du eier, og kan disse
                        brukes som sikkerhet?
                      </p>
                      <div className="w-full flex items-center gap-4">
                        <Button
                          text="NEI"
                          className={`w-1/2 border ${
                            values.collateral === "NEI"
                              ? "bg-primary text-white"
                              : "border-lightPurple bg-lightPurple text-blue"
                          } sm:text-base rounded-[8px] h-[36px] md:h-[40px] lg:h-[48px] font-medium`}
                          onClick={() => setFieldValue("collateral", "NEI")}
                        />
                        <Button
                          text="JA"
                          className={`w-1/2 border ${
                            values.collateral === "JA"
                              ? "bg-primary text-white"
                              : "border-lightPurple bg-lightPurple text-blue"
                          } sm:text-base rounded-[8px] h-[36px] md:h-[40px] lg:h-[48px] font-medium`}
                          onClick={() => setFieldValue("collateral", "JA")}
                        />
                      </div>
                      {touched.collateral && errors.collateral && (
                        <p className="text-red text-xs">{errors.collateral}</p>
                      )}
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-black mb-1">
                        Tillatelser
                      </h5>
                      <p className="text-xs text-secondary mb-4">
                        Er det andre relevante tillatelser som må på plass før
                        byggingen kan starte?
                      </p>
                      <div className="w-full flex items-center gap-4">
                        <Button
                          text="NEI"
                          className={`w-1/2 border ${
                            values.permissions === "NEI"
                              ? "bg-primary text-white"
                              : "border-lightPurple bg-lightPurple text-blue"
                          } sm:text-base rounded-[8px] h-[36px] md:h-[40px] lg:h-[48px] font-medium`}
                          onClick={() => setFieldValue("permissions", "NEI")}
                        />
                        <Button
                          text="JA"
                          className={`w-1/2 border ${
                            values.permissions === "JA"
                              ? "bg-primary text-white"
                              : "border-lightPurple bg-lightPurple text-blue"
                          } sm:text-base rounded-[8px] h-[36px] md:h-[40px] lg:h-[48px] font-medium`}
                          onClick={() => setFieldValue("permissions", "JA")}
                        />
                      </div>
                      {touched.permissions && errors.permissions && (
                        <p className="text-red text-xs">{errors.permissions}</p>
                      )}
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-black mb-1">
                        Buffer
                      </h5>
                      <p className="text-xs text-secondary mb-4">
                        Er det satt av en buffer for uforutsette utgifter? I så
                        fall, hvor mye?
                      </p>
                      <div className="w-full flex items-center gap-4">
                        <Button
                          text="NEI"
                          className={`w-1/2 border ${
                            values.buffer === "NEI"
                              ? "bg-primary text-white"
                              : "border-lightPurple bg-lightPurple text-blue"
                          } sm:text-base rounded-[8px] h-[36px] md:h-[40px] lg:h-[48px] font-medium`}
                          onClick={() => setFieldValue("buffer", "NEI")}
                        />
                        <Button
                          text="JA"
                          className={`w-1/2 border ${
                            values.buffer === "JA"
                              ? "bg-primary text-white"
                              : "border-lightPurple bg-lightPurple text-blue"
                          } sm:text-base rounded-[8px] h-[36px] md:h-[40px] lg:h-[48px] font-medium`}
                          onClick={() => setFieldValue("buffer", "JA")}
                        />
                      </div>
                      {touched.buffer && errors.buffer && (
                        <p className="text-red text-xs">{errors.buffer}</p>
                      )}
                    </div>
                  </div>
                  <div className="w-[66%]">
                    <div className="flex flex-col gap-4 mb-[40px]">
                      <div className="flex items-center justify-between">
                        <p className="text-secondary text-base font-medium">
                          Sum antatte anleggskostnader inkl. mva
                        </p>
                        <h4 className="text-black text-xl font-semibold">
                          14.108.690
                        </h4>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-secondary text-base font-medium">
                          Egenkapital
                        </p>
                        <div className="flex items-center gap-4">
                          <p className="text-secondary text-base font-medium">
                            Legg til
                          </p>
                          <div>
                            <Field
                              id="equityAmount"
                              name="equityAmount"
                              type="number"
                              className={`w-[160px] border border-darkGray focus:outline-none text-black rounded-[8px] py-2 px-4 text-sm ${
                                errors.equityAmount && touched.equityAmount
                                  ? "border-red"
                                  : "border-darkGray"
                              }`}
                              placeholder="Enter"
                            />
                            {touched.equityAmount && errors.equityAmount && (
                              <p className="text-red text-xs mt-1">
                                {errors.equityAmount}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-secondary text-base font-medium">
                          lånebeløp
                        </p>
                        <h4 className="text-black text-xl font-semibold">
                          10.608.690
                        </h4>
                      </div>
                    </div>
                    <div
                      className="rounded-[8px] p-6 flex-col gap-6 flex mb-6"
                      style={{ boxShadow: "0px 4px 16px 0px #0000001A" }}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-black text-2xl font-medium">
                          Søk byggelån{" "}
                          <span className="font-semibold">
                            (10.608.690 NOK)
                          </span>{" "}
                          hos:
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
                          <h6 className="text-black font-bold text-base">
                            8,75%
                          </h6>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-secondary text-base font-medium">
                            <span className="text-black font-bold">
                              Effektiv rente med{" "}
                            </span>
                            byggelånsramme på 2 <br /> mill. ved 100%
                            utnyttelse:
                          </div>
                          <h6 className="text-black font-bold text-base">
                            11,01%
                          </h6>
                        </div>
                        {/* <div className="border w-full border-t border-b-0 border-r-0 border-l-0 border-darkGray"></div>
                        <div className="flex items-center justify-between">
                          <div className="text-secondary text-base font-medium">
                            Estimert kostnad per måned
                          </div>
                          <h6 className="text-black font-semibold text-xl">
                            57.640 NOK
                          </h6>
                        </div> */}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="flex items-center container">
                            <Field type="checkbox" name="sharingData" />

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
                              <span className="text-black">
                                SpareBank1 Hallingdal Valdres.
                              </span>
                            </div>
                          </label>
                          {touched.sharingData && errors.sharingData && (
                            <p className="text-red text-xs mt-1">
                              {errors.sharingData}
                            </p>
                          )}
                        </div>
                        <Button
                          text="Send inn søknad"
                          className="border border-primary bg-primary text-white sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative"
                          type="submit"
                        />
                      </div>
                      <div className="flex items-start gap-4">
                        <Image src={Ic_info_circle} alt="icon" />
                        <p className="text-secondary text-base font-medium">
                          Låneramme til oppføring av bolig/fritidsbolig. Blir
                          gjort om til nedbetalingslån ved ferdigstilling av
                          bolig/fritidsbolig. Rente vil variere ut fra
                          helhetsvurdering av betalingsevne og sikkerhet.
                        </p>
                      </div>
                    </div>
                    <ContactForm />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
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
              text="Se Oppsummering"
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

export default Finansiering;
