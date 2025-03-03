import Button from "@/components/common/button";
import SideSpaceContainer from "@/components/common/sideSpace";
import { Form, Formik } from "formik";
import Image from "next/image";
import React, { useRef, useState } from "react";
import * as Yup from "yup";
import Ic_search from "@/public/images/Ic_search.svg";
import Ic_search_location from "@/public/images/Ic_search_location.svg";
import Ic_image_icon from "@/public/images/Ic_image_icon.svg";
import Ic_delete from "@/public/images/Ic_delete.svg";
import Ic_close from "@/public/images/Ic_close.svg";
import ApiUtils from "@/api";
import Ic_chevron_up from "@/public/images/Ic_chevron_up.svg";
import Ic_gray_check_circle from "@/public/images/Ic_gray_check_circle.svg";
import Ic_pdf from "@/public/images/Ic_pdf.svg";
import SelectDropDown from "@/components/common/form/select";
import TextInputField from "@/components/common/form/inputAddText";
import MultiSelectDropDown from "@/components/common/form/multiSelect";
import toast from "react-hot-toast";
import InputField from "@/components/common/form/input";

const FasiliteterArray: any = [
  { name: "Fiskemuligheter" },
  { name: "Bredbåndstilknytning" },
  { name: "Bilvei frem" },
  { name: "Offtentlig vann/kloakk" },
  { name: "Kabel-TV" },
  { name: "Ingen gjenboere" },
  { name: "Båtplass" },
  { name: "Utsikt" },
  { name: "Strandlinje" },
  { name: "Turterreng" },
  { name: "Golfbane" },
];

interface Address2 {
  kommune: string;
  Gårsnummer: string;
  Bruksnummer: string;
  Seksjonsnummer: string;
  Festenummer: string;
}

interface FormValues {
  address: string;
  address2: Address2;
  tomt_type: string;
  Tomtestørrelse: number | null;
  Utnyttelsesgrad: number | null;
  Byggeklausul: string;
  reguleringsstatus: string;
  connectionStatus: string[];
  map_image: File | null;
  plot_images: File[];
  Tomtepris: number | null;
  Kontaktperson: string | null;
  Telefonnummer: string | null;
  EPostadresse: string;
  Annonsetittel: string;
  restriksjoner: string;
  Fasiliteter: string[];
  PlotLocation: string | null;
}

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
    reguleringsstatus: Yup.string().required("Reguleringsstatus er påkrevd"),
    connectionStatus: Yup.array().required("Velg minst én"),
    map_image: Yup.mixed().required("Map image is required"),
    plot_images: Yup.array()
      .min(3, "You must upload at least 3 images")
      .max(10, "You can upload a maximum of 10 images"),
    Tomtepris: Yup.number().required("Tomtepris er påkrevd"),
    Kontaktperson: Yup.number().required("Kontaktperson er påkrevd"),
    Telefonnummer: Yup.number().required("Telefonnummer er påkrevd"),
    EPostadresse: Yup.string()
      .email("Ugyldig e-postadresse")
      .required("EPostadresse er påkrevd"),
    Annonsetittel: Yup.string().optional(),
    restriksjoner: Yup.string().optional(),
    Fasiliteter: Yup.array().of(Yup.string()).optional(),
    PlotLocation: Yup.string().optional(),
  });

  const handleSubmit = async (values: FormValues) => {
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
  const convertBytesToMB = (bytes: any) => {
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(2);
  };
  return (
    <Formik<FormValues>
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
        reguleringsstatus: "",
        connectionStatus: [],
        map_image: null,
        plot_images: [],
        Tomtepris: null,
        Kontaktperson: null,
        Telefonnummer: null,
        EPostadresse: "",
        Annonsetittel: "",
        restriksjoner: "",
        Fasiliteter: [],
        PlotLocation: null,
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
        isValid,
      }) => {
        const fileInputRef = useRef<HTMLInputElement>(null);
        const [preview, setPreview] = useState<string | null>(null);

        const plotImageInputRef = useRef<HTMLInputElement>(null);
        const [PlotPreview, setPlotPreview] = useState<string[]>([]);
        const plotLocationInputRef = useRef<HTMLInputElement>(null);
        const [PlotLocationPreview, setPlotLocationPreview] =
          useState<any>(null);

        const handleFileChange = (event: any) => {
          const files: any = event.target.files;

          if (files) {
            let newImages: any = [...values.plot_images];
            let newPreviews = [...PlotPreview];

            for (let i = 0; i < files.length; i++) {
              const file: any = files[i];

              if (!["image/jpeg", "image/png"].includes(file.type)) {
                alert("Only JPG and PNG images are allowed.");
                continue;
              }

              if (file.size > 2 * 1024 * 1024) {
                alert("Image size must be less than 2MB.");
                continue;
              }

              if (newImages.length < 10) {
                newImages.push(file);
                newPreviews.push(URL.createObjectURL(file));
              } else {
                toast.error("You can upload a maximum of 10 images.", {
                  position: "top-right",
                });
                break;
              }
            }

            setFieldValue("plot_images", newImages);
            setPlotPreview(newPreviews);
          }
        };

        const handleRemoveImage = (index: number) => {
          let newImages = [...values.plot_images];
          let newPreviews = [...PlotPreview];

          newImages.splice(index, 1);
          newPreviews.splice(index, 1);

          setFieldValue("plot_images", newImages);
          setPlotPreview(newPreviews);
        };
        const [isOpen, setIsOpen] = useState<boolean>(true);

        const toggleAccordion = () => {
          setIsOpen(!isOpen);
        };
        return (
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
                                    handleInputChange(
                                      e,
                                      setFieldValue,
                                      "kommune"
                                    )
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
                                    handleClearInput(
                                      setFieldValue,
                                      "Gårsnummer"
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
                                    handleClearInput(
                                      setFieldValue,
                                      "Bruksnummer"
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
                                    handleClearInput(
                                      setFieldValue,
                                      "Festenummer"
                                    )
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
                      {errors.address2?.kommune &&
                        touched.address2?.kommune && (
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
                      <MultiSelectDropDown
                        label="Status i dag på tilkoblinger (vann, avløp, strøm)"
                        name="connectionStatus"
                        id="connectionStatus"
                        placeholder="Velg hva som allerede er tilkoblet tomten"
                        errors={errors.connectionStatus}
                        touched={touched.connectionStatus}
                        onChange={(newValue) => {
                          handleChange({
                            target: {
                              name: "connectionStatus",
                              value: newValue,
                            },
                          });
                        }}
                        options={[
                          {
                            value: "vann",
                            label: "vann",
                          },
                          {
                            value: "avløp",
                            label: "avløp",
                          },
                          {
                            value: "strøm",
                            label: "strøm",
                          },
                        ]}
                        value={values.connectionStatus}
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
                      <SelectDropDown
                        label="Reguleringsstatus"
                        name="reguleringsstatus"
                        id="reguleringsstatus"
                        placeholder="Velg eventuell reguleringsstatus"
                        errors={errors.reguleringsstatus}
                        touched={touched.reguleringsstatus}
                        onChange={(newValue) => {
                          handleChange({
                            target: {
                              name: "reguleringsstatus",
                              value: newValue,
                            },
                          });
                        }}
                        options={[
                          {
                            value: "Uregulert",
                            label: "Uregulert",
                          },
                          {
                            value: "Regulert",
                            label: "Regulert",
                          },
                          {
                            value: "Detaljregulert",
                            label: "Detaljregulert",
                          },
                          {
                            value: "Områderegulert",
                            label: "Områderegulert",
                          },
                        ]}
                        value={values.reguleringsstatus}
                      />
                    </div>
                    <div className="w-[64%]">
                      <label className={`text-[#111322] text-sm font-semibold`}>
                        Kartutsnitt
                      </label>
                      <div
                        className="bg-[#EFF1F5] w-full h-[340px] rounded-[8px] flex justify-center items-center flex-col gap-4 mt-2 relative"
                        onClick={() => {
                          if (fileInputRef.current) {
                            fileInputRef.current.click();
                          }
                        }}
                      >
                        {preview ? (
                          <>
                            <Image
                              src={preview}
                              alt="Preview"
                              width={200}
                              height={200}
                              className="rounded-md"
                            />
                            <Image
                              src={Ic_delete}
                              alt="delete"
                              className="absolute top-3 right-3 cursor-pointer"
                              onClick={() => {
                                setFieldValue("map_image", null);
                                setPreview(null);
                              }}
                            />
                          </>
                        ) : (
                          <div className="cursor-pointer flex flex-col justify-center items-center">
                            <Image src={Ic_image_icon} alt="icon" />
                            <p className="text-[#4A5578] text-sm lg:text-base text-center">
                              Plot Image will be shown here according to <br />{" "}
                              your Cadastre or Plot Address
                            </p>
                            <input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              onChange={(event: any) => {
                                const file = event.target.files?.[0];
                                if (file) {
                                  setFieldValue("map_image", file);
                                  setPreview(URL.createObjectURL(file));
                                }
                              }}
                              name="map_image"
                            />
                          </div>
                        )}
                      </div>
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
                    Bilder
                  </h4>
                  <div className="p-6 flex gap-[74px]">
                    <div className="w-[36%]">
                      <label className={`text-[#111322] text-sm font-semibold`}>
                        Last opp bilder av tomten (Minimum 3 bilder, maks 10)
                      </label>
                      <div
                        className="border border-[#B9C0D4] w-full rounded-[8px] mt-2 relative p-2 cursor-pointer"
                        onClick={() => {
                          if (plotImageInputRef.current) {
                            plotImageInputRef.current.click();
                          }
                        }}
                      >
                        <div className="border border-dashed border-[#6941C6] rounded-[8px] py-5 flex flex-col gap-[10px] justify-center items-center">
                          <div className="gap-3 flex items-center">
                            <Button
                              text="Velg"
                              className="border-2 border-primary text-primary sm:text-base w-max h-36px] font-semibold relative desktop:px-4 desktop:py-2 rounded-[50px]"
                            />
                            <span className="text-[#111322] font-medium text-sm">
                              Dra & slipp for å laste opp
                            </span>
                          </div>
                          <p className="text-[#4A5578] text-sm">
                            (Godkjente filformat: JPG eller PNG, max 2 MB)
                          </p>
                        </div>

                        <input
                          type="file"
                          ref={plotImageInputRef}
                          className="hidden"
                          onChange={handleFileChange}
                          name="plot_images"
                          multiple
                          accept="image/*"
                        />
                      </div>
                    </div>
                    <div className="w-[64%]">
                      {PlotPreview.length > 0 && (
                        <div className="flex gap-6 flex-wrap">
                          {PlotPreview.map((preview: any, index: number) => (
                            <div key={index} className="relative">
                              <Image
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                width={134}
                                height={142}
                                className="rounded-[12px]"
                              />
                              <div className="absolute top-1 right-1 cursor-pointer bg-white p-1 rounded-full">
                                <Image
                                  src={Ic_delete}
                                  alt="delete"
                                  className=""
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveImage(index);
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
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
                    Pris & kontaktinformasjon
                  </h4>
                  <div className="grid grid-cols-3 gap-6 p-6">
                    <TextInputField
                      label="Tomtepris"
                      type="number"
                      name="Tomtepris"
                      id="Tomtepris"
                      value={values.Tomtepris}
                      placeholder="Fyll inn tomtepris"
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                      text="NOK"
                    />
                    <InputField
                      label="Kontaktperson"
                      type="number"
                      name="Kontaktperson"
                      id="Kontaktperson"
                      value={values.Kontaktperson}
                      placeholder="Fyll inn kontaktperson"
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Telefonnummer"
                      type="number"
                      name="Telefonnummer"
                      id="Telefonnummer"
                      value={values.Telefonnummer}
                      placeholder="Fyll inn telefonnummer"
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                    />
                    <InputField
                      label="E-postadresse"
                      type="email"
                      name="EPostadresse"
                      id="EPostadresse"
                      value={values.EPostadresse}
                      placeholder="Fyll inn e-postadresse"
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                    />
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
                    Ekstra info (valgfritt)
                  </h4>
                  <div className="flex flex-col gap-6 p-6">
                    <InputField
                      label="Annonsetittel"
                      type="text"
                      name="Annonsetittel"
                      id="Annonsetittel"
                      value={values.Annonsetittel}
                      placeholder="Fyll inn Annonsetittel"
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                    />
                    <div className="flex gap-6 items-start">
                      <div className="w-[64%]">
                        <label
                          className={`text-[#111322] text-sm font-semibold flex justify-between items-center gap-3`}
                          onClick={toggleAccordion}
                        >
                          Fasiliteter
                          {isOpen ? (
                            <Image
                              src={Ic_chevron_up}
                              alt="arrow"
                              fetchPriority="auto"
                            />
                          ) : (
                            <Image
                              src={Ic_chevron_up}
                              alt="arrow"
                              className="rotate-180"
                              fetchPriority="auto"
                            />
                          )}
                        </label>
                        {isOpen && (
                          <div className="mt-2 grid grid-cols-4 gap-x-4 gap-y-2">
                            {FasiliteterArray.map(
                              (data: any, index: number) => (
                                <label
                                  className="container container_darkgray_withPurple truncate"
                                  htmlFor={data.name}
                                  key={index}
                                >
                                  <span className="text-[#111322] text-sm md:text-base truncate">
                                    {data.name}
                                  </span>
                                  <input
                                    type="checkbox"
                                    id={data.name}
                                    value={data.name}
                                    name="Fasiliteter"
                                    checked={
                                      values.Fasiliteter.length > 0 &&
                                      values.Fasiliteter.includes(data.name)
                                    }
                                    onChange={() => {
                                      const newData =
                                        values.Fasiliteter.includes(data.name)
                                          ? values.Fasiliteter.filter(
                                              (item: string) =>
                                                item !== data.name
                                            )
                                          : [...values.Fasiliteter, data.name];
                                      setFieldValue("Fasiliteter", newData);
                                    }}
                                    className="mr-2"
                                  />

                                  <span className="checkmark checkmark_darkgray_withPurple"></span>
                                </label>
                              )
                            )}
                          </div>
                        )}
                      </div>
                      <div className="w-[36%]">
                        <InputField
                          label="Tomtens beliggenhet (Nærhet til skoler, butikker osv.)"
                          type="text"
                          name="PlotLocation"
                          id="PlotLocation"
                          value={values.PlotLocation}
                          placeholder="Skriv inn tomtens kvaliteter"
                          errors={errors}
                          touched={touched}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <InputField
                      label="Eventuelle restriksjoner eller spesielle vilkår"
                      type="text"
                      name="restriksjoner"
                      id="restriksjoner"
                      value={values.restriksjoner}
                      placeholder="Fyll inn eventuelle restriksjoner og villår"
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                    />
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
                    Opplasting av dokumenter (valgfritt)
                  </h4>
                  <div className="p-6 flex gap-[74px]">
                    <div className="w-[22%] bg-[#F9F9FB] rounded-[8px] p-4 flex flex-col gap-5">
                      <div>
                        <h3 className="text-sm font-semibold mb-3">
                          Entity Documents
                        </h3>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <Image src={Ic_gray_check_circle} alt="check" />
                            <span className="text-[#111322] text-base">
                              Skjøte
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Image src={Ic_gray_check_circle} alt="check" />
                            <span className="text-[#111322] text-base">
                              Byggetillatelser
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold mb-3">
                          Situasjonsplaner
                        </h3>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <Image src={Ic_gray_check_circle} alt="check" />
                            <span className="text-[#111322] text-base">
                              Tegninger
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Image src={Ic_gray_check_circle} alt="check" />
                            <span className="text-[#111322] text-base">
                              reguleringsinformasjon
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold mb-3">
                          Verdivurderingsrapport
                        </h3>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <Image src={Ic_gray_check_circle} alt="check" />
                            <span className="text-[#111322] text-base">
                              e-Takst (hvis tilgjengelig)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-[78%]">
                      <label className={`text-[#111322] text-sm font-semibold`}>
                        Upload Document
                      </label>
                      <div className="flex items-start gap-6">
                        <div
                          className="border border-[#B9C0D4] rounded-[8px] mt-2 relative p-2 cursor-pointer w-[40%]"
                          onClick={() => {
                            if (plotLocationInputRef.current) {
                              plotLocationInputRef.current.click();
                            }
                          }}
                        >
                          <div className="border border-dashed border-[#6941C6] rounded-[8px] py-5 flex flex-col gap-[10px] justify-center items-center">
                            <div className="gap-3 flex items-center">
                              <Button
                                text="Velg"
                                className="border-2 border-primary text-primary sm:text-base w-max h-36px] font-semibold relative desktop:px-4 desktop:py-2 rounded-[50px]"
                              />
                              <span className="text-[#111322] font-medium text-sm">
                                Dra & slipp for å laste opp
                              </span>
                            </div>
                            <p className="text-[#4A5578] text-sm">
                              (Godkjente filformat: JPG eller PNG, max 2 MB)
                            </p>
                          </div>

                          <input
                            type="file"
                            ref={plotLocationInputRef}
                            className="hidden"
                            onChange={(event: any) => {
                              if (event.target.files) {
                                const file = event.target.files[0];

                                if (file.type !== "application/pdf") {
                                  alert("Only PDF files are allowed.");
                                  return;
                                }

                                if (file.size > 2 * 1024 * 1024) {
                                  alert("File size must be 2MB or smaller.");
                                  return;
                                }

                                setFieldValue("PlotLocation", file);
                                setPlotLocationPreview(file);
                              }
                            }}
                            name="PlotLocation"
                            accept="application/pdf"
                          />
                        </div>
                        <div className="w-[60%]">
                          {PlotLocationPreview && (
                            <div className="mt-2 bg-[#F9F9FB] rounded-[8px] p-3 px-[20px] flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <Image src={Ic_pdf} alt="pdf" />
                                <div className="flex flex-col">
                                  <span className="text-[#111322] text-base font-medium">
                                    {PlotLocationPreview.name}
                                  </span>
                                  <span className="text-xs text-[#4A5578]">
                                    {convertBytesToMB(PlotLocationPreview.size)}{" "}
                                    MB
                                  </span>
                                </div>
                              </div>
                              <Image
                                alt="delete"
                                src={Ic_delete}
                                className="cursor-pointer"
                                onClick={() => {
                                  setPlotLocationPreview(null);
                                  setFieldValue("PlotLocation", null);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SideSpaceContainer>

            <div className="flex items-center gap-6 justify-end sticky bottom-0 bg-white px-6 py-4 shadow-shadow1">
              <Button
                text="Avbryt"
                className="border-2 border-primary text-primary sm:text-base w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px] rounded-[50px]"
              />
              <Button
                text="Fårhåndsvis"
                className="border-2 border-primary text-primary sm:text-base w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px] rounded-[50px]"
              />
              <button
                className={`flex items-center border py-[4px] px-4 border-primary bg-primary text-white sm:text-base rounded-[50px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px] ${isValid ? "" : "opacity-50"}`}
                type="submit"
                disabled={!isValid}
              >
                Publiser
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddPlotForm;
