import Button from "@/components/common/button";
import SideSpaceContainer from "@/components/common/sideSpace";
import { Form, Formik } from "formik";
import Image from "next/image";
import React, { useRef, useState } from "react";
import * as Yup from "yup";
import Ic_search from "@/public/images/Ic_search.svg";
import Ic_search_location from "@/public/images/Ic_search_location.svg";
import Ic_close from "@/public/images/Ic_close.svg";
import ApiUtils from "@/api";
import SelectDropDown from "@/components/common/form/select";
import TextInputField from "@/components/common/form/inputAddText";

const AddPlotForm = () => {
  const validationSchema = Yup.object({
    address: Yup.string().required("Adresse er påkrevd"),
    address2: Yup.object({
      kommune: Yup.string().required("Kommune er påkrevd."),
      Gårsnummer: Yup.string().required("Gårsnummer er påkrevd."),
      Bruksnummer: Yup.string().required("Bruksnummer er påkrevd."),
      Festenummer: Yup.string().notRequired(),
      Seksjonsnummer: Yup.string().notRequired(),
    }),
    tomt_type: Yup.string().required("Type tomt er påkrevd"),
    Tomtestørrelse: Yup.number().required("Tomtestørrelse er påkrevd"),
    Utnyttelsesgrad: Yup.number().required("Utnyttelsesgrad er påkrevd"),
    Byggeklausul: Yup.string().required("Byggeklausul er påkrevd"),
  });

  const handleSubmit = async (values: any) => {
    console.log("Form Submitted: ", values);
  };

  const kartInputRef = useRef<HTMLInputElement | null>(null);
  const [addressData, setAddressData] = useState<any>(null);
  const [showAddressDropdown, setShowAddressDropdown] = useState(true);

  const handleKartInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    if (value) {
      try {
        const response = await ApiUtils.getAddress(value);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        setAddressData(json.adresser);
      } catch (error: any) {
        console.error(error?.message);
      }
    }
  };

  const handleInputChange = (e: any, setFieldValue: any, fieldName: any) => {
    setFieldValue(`address2.${fieldName}`, e.target.value);
  };
  const handleClearInput = (setFieldValue: any, fieldName: any) => {
    setFieldValue(`address2.${fieldName}`, "");
  };

  return (
    <Formik
      initialValues={{
        address: "",
        address2: {
          kommune: "",
          Gårsnummer: "",
          Bruksnummer: "",
          Seksjonsnummer: "",
          Festenummer: "",
        },
        tomt_type: "",
        Tomtestørrelse: null,
        Utnyttelsesgrad: null,
        Byggeklausul: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        errors,
        touched,
        handleChange,
        handleBlur,
        values,
        setFieldValue,
      }) => (
        <Form>
          <SideSpaceContainer>
            <div className="pt-[50px] pb-[98px] flex flex-col gap-6">
              <div
                className="rounded-[8px]"
                style={{
                  boxShadow:
                    "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
                }}
              >
                <h4 className="p-6 font-medium text-base lg:text-lg border-b border-[#B9C0D4]">
                  Søk opp adressen/matrikkelen
                </h4>
                <div className="p-6 grid grid-cols-1 gap-y-6">
                  <div className="lg:h-[80px] bg-[#F9F9FB] border-[#EFF1F5] border rounded-[8px] lg:rounded-[100px] flex flex-col sm:flex-row sm:items-center relative justify-between">
                    <div className="flex flex-col lg:justify-between w-full sm:w-11/12 lg:h-[80px]">
                      <div className="w-full rounded-[12px] lg:rounded-[88px] py-3 px-2 lg:px-4 desktop:px-8 lg:items-center flex sm:justify-between relative">
                        <div className="w-[92%]">
                          <div className="text-[#111322] mb-1 text-sm">
                            Vet du hvilken adresse du vil bygge på?
                          </div>
                          <input
                            ref={kartInputRef}
                            name="address"
                            type="text"
                            className={`focus:outline-none text-black text-base desktop:text-xl font-medium bg-transparent w-full focus:border-none focus:border-0
                            ${errors.address && touched.address ? "" : ""}`}
                            placeholder="Fyll inn ønsket adresse"
                            onChange={(e: any) => {
                              setShowAddressDropdown(true);
                              handleChange(e);
                              handleKartInputChange(e);
                            }}
                            onBlur={handleBlur}
                            value={values.address}
                            autoComplete="off"
                          />
                        </div>
                        {values.address && (
                          <Image
                            src={Ic_close}
                            alt="close"
                            className="cursor-pointer"
                            onClick={() => {
                              setFieldValue("address", "");
                              setAddressData(null);
                            }}
                            fetchPriority="auto"
                          />
                        )}
                      </div>
                      {errors.address && touched.address && (
                        <p className="text-red text-xs mt-2">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    {(values.address || addressData) &&
                      showAddressDropdown &&
                      addressData?.length > 0 && (
                        <div
                          className="absolute top-[100px] desktop:top-[80px] left-0 bg-white rounded-[8px] py-[12px] p-2.5 desktop:px-[16px] w-full h-auto max-h-[400px] overflow-y-auto overFlowYAuto"
                          style={{
                            zIndex: 999,
                            boxShadow:
                              "rgba(16, 24, 40, 0.09) 0px 4px 6px -2px, rgba(16, 24, 40, 0.09) 0px 12px 16px -4px",
                          }}
                        >
                          {addressData.map((address: any, index: number) => (
                            <div
                              className="p-2 desktop:p-3 flex items-center gap-2.5 desktop:gap-4 hover:bg-lightGreen cursor-pointer"
                              key={index}
                              onClick={() => {
                                setFieldValue(
                                  "address",
                                  `${address.adressetekst} ${address.postnummer} ${address.poststed}`
                                );
                                setShowAddressDropdown(false);
                                setAddressData(null);
                              }}
                            >
                              <Image
                                src={Ic_search_location}
                                alt="location"
                                fetchPriority="auto"
                              />
                              <div>
                                <span className="text-secondary text-sm desktop:text-base font-medium">
                                  Adresse:
                                </span>{" "}
                                <span className="text-black font-medium text-base desktop:text-lg">
                                  {`${address.adressetekst}  ${address.postnummer} ${address.poststed}` ||
                                    "N/A"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    <button
                      className={`p-3 lg:p-5 cursor-pointer flex justify-center items-center bg-primary rounded-full gap-[10px] transition-all duration-300 ease-out h-[48px] w-[48px] lg:h-[64px] lg:w-[64px] m-2`}
                    >
                      <Image
                        src={Ic_search}
                        alt="search"
                        className="w-6 h-6"
                        fetchPriority="auto"
                      />
                    </button>
                  </div>
                  <div className="text-center font-medium text-sm">eller</div>
                  <div>
                    <div className="desktop:h-[80px] bg-[#F9F9FB] border-[#EFF1F5] border rounded-[8px] desktop:rounded-[100px] flex flex-col desktop:flex-row desktop:items-center relative justify-between">
                      <div className="flex flex-col desktop:flex-row desktop:items-center desktop:justify-between w-full desktop:w-11/12 desktop:h-[80px]">
                        <div className="desktop:w-[20%]">
                          <div className="w-full rounded-[12px] lg:rounded-[88px] py-3 px-2 lg:px-4 desktop:px-7 lg:items-center flex lg:justify-between relative">
                            <div className="w-[92%] lg:w-auto">
                              <div className="text-[#111322] mb-1 text-sm truncate">
                                Kommunenummer
                              </div>
                              <input
                                type="number"
                                className={`focus:outline-none text-black text-base desktop:text-xl font-medium bg-transparent w-full focus:border-none focus:border-0
                  ${errors.address2?.kommune ? "" : ""}`}
                                placeholder="Søk opp kommune"
                                onChange={(e) =>
                                  handleInputChange(e, setFieldValue, "kommune")
                                }
                                value={values.address2.kommune}
                                name="address2.kommune"
                                autoComplete="off"
                              />
                            </div>
                            {values.address2.kommune && (
                              <Image
                                src={Ic_close}
                                alt="close"
                                className="cursor-pointer"
                                onClick={() =>
                                  handleClearInput(setFieldValue, "kommune")
                                }
                                fetchPriority="auto"
                              />
                            )}
                          </div>
                        </div>
                        <div className="border-b desktop:border-b-0 desktop:border-l border-[#7D89B0] w-full desktop:w-[1px] desktop:h-[37px] border-opacity-30"></div>
                        <div className="desktop:w-[20%]">
                          <div className="w-full rounded-[12px] lg:rounded-[88px] py-3 px-2 lg:px-4 desktop:px-7 lg:items-center flex lg:justify-between relative">
                            <div className="w-[92%] lg:w-auto">
                              <div className="text-[#111322] mb-1 text-sm truncate">
                                Gårdsnummer
                              </div>
                              <input
                                type="number"
                                className={`focus:outline-none text-black text-base desktop:text-xl font-medium bg-transparent w-full focus:border-none focus:border-0
                  ${errors.address2?.Gårsnummer ? "" : ""}`}
                                placeholder="Skriv Gnr."
                                onChange={(e) =>
                                  handleInputChange(
                                    e,
                                    setFieldValue,
                                    "Gårsnummer"
                                  )
                                }
                                value={values.address2.Gårsnummer}
                              />
                            </div>
                            {values.address2.Gårsnummer && (
                              <Image
                                src={Ic_close}
                                alt="close"
                                className="cursor-pointer"
                                onClick={() =>
                                  handleClearInput(setFieldValue, "Gårsnummer")
                                }
                                fetchPriority="auto"
                              />
                            )}
                          </div>
                        </div>
                        <div className="border-b desktop:border-b-0 desktop:border-l border-[#7D89B0] w-full desktop:w-[1px] desktop:h-[37px] border-opacity-30"></div>
                        <div className="desktop:w-[20%]">
                          <div className="w-full rounded-[12px] lg:rounded-[88px] py-3 px-2 lg:px-4 desktop:px-7 lg:items-center flex lg:justify-between relative">
                            <div className="w-[92%] lg:w-auto">
                              <div className="text-[#111322] mb-1 text-sm truncate">
                                Bruksnummer (valgfritt)
                              </div>
                              <input
                                type="number"
                                className={`focus:outline-none text-black text-base desktop:text-xl font-medium bg-transparent w-full focus:border-none focus:border-0
                  ${errors.address2?.Bruksnummer ? "" : ""}`}
                                placeholder="Skriv Bnr."
                                onChange={(e) =>
                                  handleInputChange(
                                    e,
                                    setFieldValue,
                                    "Bruksnummer"
                                  )
                                }
                                value={values.address2.Bruksnummer}
                              />
                            </div>
                            {values.address2.Bruksnummer && (
                              <Image
                                src={Ic_close}
                                alt="close"
                                className="cursor-pointer"
                                onClick={() =>
                                  handleClearInput(setFieldValue, "Bruksnummer")
                                }
                                fetchPriority="auto"
                              />
                            )}
                          </div>
                        </div>
                        <div className="border-b desktop:border-b-0 desktop:border-l border-[#7D89B0] w-full desktop:w-[1px] desktop:h-[37px] border-opacity-30"></div>
                        <div className="desktop:w-[20%]">
                          <div className="w-full rounded-[12px] lg:rounded-[88px] py-3 px-2 lg:px-4 desktop:px-7 lg:items-center flex lg:justify-between relative">
                            <div className="w-[92%] lg:w-auto">
                              <div className="text-[#111322] mb-1 text-sm truncate">
                                Seksjonsnummer (valgfritt)
                              </div>
                              <input
                                type="number"
                                className={`focus:outline-none text-black text-base desktop:text-xl font-medium bg-transparent w-full focus:border-none focus:border-0
                  ${errors.address2?.Seksjonsnummer ? "" : ""}`}
                                placeholder="Skriv evt. Snr."
                                onChange={(e) =>
                                  handleInputChange(
                                    e,
                                    setFieldValue,
                                    "Seksjonsnummer"
                                  )
                                }
                                value={values.address2.Seksjonsnummer}
                              />
                            </div>
                            {values.address2.Seksjonsnummer && (
                              <Image
                                src={Ic_close}
                                alt="close"
                                className="cursor-pointer"
                                onClick={() =>
                                  handleClearInput(
                                    setFieldValue,
                                    "Seksjonsnummer"
                                  )
                                }
                                fetchPriority="auto"
                              />
                            )}
                          </div>
                        </div>
                        <div className="border-b desktop:border-b-0 desktop:border-l border-[#7D89B0] w-full desktop:w-[1px] desktop:h-[37px] border-opacity-30"></div>
                        <div className="desktop:w-[20%]">
                          <div className="w-full rounded-[12px] lg:rounded-[88px] py-3 px-2 lg:px-4 desktop:px-7 lg:items-center flex lg:justify-between relative">
                            <div className="w-[92%] lg:w-auto">
                              <div className="text-[#111322] mb-1 text-sm truncate">
                                Festenummer (valgfritt)
                              </div>
                              <input
                                type="number"
                                className={`focus:outline-none text-black text-base desktop:text-xl font-medium bg-transparent w-full focus:border-none focus:border-0
                  ${errors.address2?.Festenummer ? "" : ""}`}
                                placeholder="Skriv evt. Snr."
                                onChange={(e) =>
                                  handleInputChange(
                                    e,
                                    setFieldValue,
                                    "Festenummer"
                                  )
                                }
                                value={values.address2.Festenummer}
                              />
                            </div>
                            {values.address2.Festenummer && (
                              <Image
                                src={Ic_close}
                                alt="close"
                                className="cursor-pointer"
                                onClick={() =>
                                  handleClearInput(setFieldValue, "Festenummer")
                                }
                                fetchPriority="auto"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        className={`p-3 lg:p-5 cursor-pointer flex justify-center items-center bg-primary rounded-full gap-[10px] transition-all duration-300 ease-out h-[48px] w-[48px] lg:h-[64px] lg:w-[64px] m-2 ${
                          !values.address2.Gårsnummer ||
                          !values.address2.kommune ||
                          !values.address2.Bruksnummer
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={
                          !values.address2.Gårsnummer ||
                          !values.address2.kommune ||
                          !values.address2.Bruksnummer
                        }
                      >
                        <Image
                          src={Ic_search}
                          alt="search"
                          className="w-6 h-6"
                          fetchPriority="auto"
                        />
                      </button>
                    </div>
                    {errors.address2?.Gårsnummer &&
                      touched.address2?.Gårsnummer && (
                        <p className="text-red text-xs mt-2">
                          Gårsnummer er påkrevd.
                        </p>
                      )}
                    {errors.address2?.Bruksnummer &&
                      touched.address2?.Bruksnummer && (
                        <p className="text-red text-xs mt-2">
                          Bruksnummer er påkrevd.
                        </p>
                      )}
                    {errors.address2?.kommune && touched.address2?.kommune && (
                      <p className="text-red text-xs mt-2">
                        Kommune er påkrevd.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div
                className="rounded-[8px]"
                style={{
                  boxShadow:
                    "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
                }}
              >
                <h4 className="p-6 font-medium text-base lg:text-lg border-b border-[#B9C0D4]">
                  Grunniformasjon
                </h4>
                <div className="p-6 flex gap-[74px]">
                  <div className="w-[36%] flex flex-col gap-6">
                    <SelectDropDown
                      label="Type tomt"
                      name="tomt_type"
                      id="tomt_type"
                      placeholder="Enter Type tomt"
                      errors={errors.tomt_type}
                      touched={touched.tomt_type}
                      onChange={(newValue) => {
                        handleChange({
                          target: {
                            name: "tomt_type",
                            value: newValue,
                          },
                        });
                      }}
                      options={[
                        {
                          value:
                            "Boligtomt, Hyttetomt, Utviklingstomt, Tomtefelt",
                          label:
                            "Boligtomt, Hyttetomt, Utviklingstomt, Tomtefelt",
                        },
                        {
                          value: "Boligtomt, Hyttetomt, Utviklingstomt",
                          label: "Boligtomt, Hyttetomt, Utviklingstomt",
                        },
                        {
                          value: "Boligtomt, Hyttetomt, Tomtefelt",
                          label: "Boligtomt, Hyttetomt, Tomtefelt",
                        },
                        {
                          value: "Boligtomt,  Utviklingstomt, Tomtefelt",
                          label: "Boligtomt,  Utviklingstomt, Tomtefelt",
                        },
                      ]}
                      value={values.tomt_type}
                    />
                    <TextInputField
                      label="Tomtestørrelse"
                      type="number"
                      name="Tomtestørrelse"
                      id="Tomtestørrelse"
                      value={values.Tomtestørrelse}
                      placeholder="Fyll inn tomtestørrelse"
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                      text="m²"
                    />
                    <TextInputField
                      label="Utnyttelsesgrad"
                      type="number"
                      name="Utnyttelsesgrad"
                      id="Utnyttelsesgrad"
                      value={values.Utnyttelsesgrad}
                      placeholder="Fyll inn tomtens utnyttelsesgrad"
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                      text="% BYA"
                    />
                    <SelectDropDown
                      label="Byggeklausul (ja/nei)"
                      name="Byggeklausul"
                      id="Byggeklausul"
                      placeholder="Velg om tomten har byggeklausul eller ikke"
                      errors={errors.Byggeklausul}
                      touched={touched.Byggeklausul}
                      onChange={(newValue) => {
                        handleChange({
                          target: {
                            name: "Byggeklausul",
                            value: newValue,
                          },
                        });
                      }}
                      options={[
                        {
                          value: "Ja",
                          label: "Ja",
                        },
                        {
                          value: "Nei",
                          label: "Nei",
                        },
                      ]}
                      value={values.Byggeklausul}
                    />
                  </div>
                  <div className="w-[64%]"></div>
                </div>
              </div>
            </div>
          </SideSpaceContainer>

          <div className="flex items-center gap-6 justify-end sticky bottom-0 bg-white px-6 py-4 shadow-shadow1">
            <Button
              text="Tilbake"
              className="border-2 border-primary text-primary sm:text-base w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px] rounded-[50px]"
            />
            <Button
              text="Publiser"
              className="border border-primary bg-primary text-white sm:text-base rounded-[50px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
              type="submit"
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddPlotForm;
