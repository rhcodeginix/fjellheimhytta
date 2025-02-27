import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { useRouter } from "next/router";
import Image from "next/image";
import Ic_close from "@/public/images/Ic_close.svg";
import Img_product1 from "@/public/images/Img_product1.png";
import Ic_inside_Parkett from "@/public/images/Ic_inside_Parkett.svg";
import Img_Parkett1 from "@/public/images/Img_Parkett1.png";
import Img_Parkett2 from "@/public/images/Img_Parkett2.png";
import Img_Parkett3 from "@/public/images/Img_Parkett3.png";
import Img_Parkett4 from "@/public/images/Img_Parkett4.png";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import Button from "@/components/common/button";

const PropertyOptionDrawer: React.FC<any> = ({
  open,
  setOpen,
  route,
  // handleNext,
}) => {
  const router = useRouter();
  const handleMenuClose = () => {
    setOpen(false);
    if (route) {
      router.push(route);
    }
  };

  const validationSchema = Yup.object().shape({
    selectedProduct: Yup.string().required("Please select a product."),
  });

  const handleSubmit = async (values: any) => {
    console.log(values);
    // handleNext();
    handleMenuClose();
  };

  const products = [
    {
      name: "Laminat",
      image: Img_Parkett1,
      stavs: 1,
      tretype: "Eik",
      pris: "18.900 NOK",
    },
    {
      name: "Parkett Tostavs",
      image: Img_Parkett2,
      stavs: 2,
      tretype: "Eik",
      pris: "201.302 NOK",
    },
    {
      name: "Parkett Laminuto",
      image: Img_Parkett3,
      stavs: 3,
      tretype: "Eik",
      pris: "78.000 NOK",
    },
    {
      name: "Parkett Dyro",
      image: Img_Parkett4,
      stavs: 1,
      tretype: "Gran",
      pris: "125.900 NOK",
    },
  ];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleMenuClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          width: 645,
        }}
        role="presentation"
        onKeyDown={handleMenuClose}
      >
        <div className="flex items-center justify-between py-4 px-6">
          <h3 className="text-black font-semibold text-2xl">
            Her kan du gjøre dine tilvalg
          </h3>
          <Image
            src={Ic_close}
            alt="close"
            onClick={handleMenuClose}
            className="cursor-pointer"
            fetchPriority="auto"
          />
        </div>
        <div className="p-6 flex items-center gap-5 w-full">
          <Image
            src={Img_product1}
            alt="image"
            className="rounded-[8px] w-[30%] object-cover h-[124px]"
            fetchPriority="auto"
          />
          <div className="w-[70%]">
            <h4 className="text-black text-lg font-semibold mb-2">
              Herskapelige Almgaard er en drømmebolig for familien
            </h4>
            <div className="flex items-center gap-2 mb-4">
              <p className="text-secondary text-sm">Pris fra</p>
              <h4 className="text-base font-semibold text-black">
                5.860.000 NOK
              </h4>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-secondary text-base">
                <span className="text-black text-base font-semibold">233</span>{" "}
                m<sup>2</sup>
              </div>
              <div className="h-[12px] w-[1px] border-l border-gray"></div>
              <div className="text-secondary text-base">
                <span className="text-black text-base font-semibold">5</span>{" "}
                soverom
              </div>
              <div className="h-[12px] w-[1px] border-l border-gray"></div>
              <div className="text-secondary text-base">
                <span className="text-black text-base font-semibold">3</span>{" "}
                bad
              </div>
            </div>
          </div>
        </div>
        <div className="border w-full border-t border-b-0 border-r-0 border-l-0 border-darkGray"></div>
        <div className="p-6 flex items-center gap-3 w-full">
          <Image
            src={Ic_inside_Parkett}
            alt="image"
            className="rounded-full w-[80px] h-[80px] object-cover"
            fetchPriority="auto"
          />
          <div className="w-full">
            <h5 className="text-black text-lg font-medium mb-2">Parkett</h5>
            <div className="flex justify-between items-center">
              <p className="text-secondary text-sm">Pris fra</p>
              <h4 className="text-base font-semibold text-black">
                5.860.000 NOK
              </h4>
            </div>
          </div>
        </div>
        <Formik
          initialValues={{ selectedProduct: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched }) => (
            <Form>
              <div>
                <div className="grid grid-cols-2 gap-9 p-6">
                  {products.map((product) => (
                    <label
                      key={product.name}
                      className={`p-4 border-2 rounded-[8px] cursor-pointer ${
                        values.selectedProduct === product.name
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                      style={{
                        boxShadow:
                          "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
                      }}
                    >
                      <Field
                        type="radio"
                        name="selectedProduct"
                        value={product.name}
                        className="hidden"
                      />
                      <Image
                        src={product.image}
                        alt={product.name}
                        className="w-full rounded-[12px] overflow-hidden mb-4"
                        fetchPriority="auto"
                      />
                      <h6 className="text-black text-lg font-medium mb-2">
                        {product.name}
                      </h6>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-secondary text-base">
                          Stavs
                          <span className="text-black font-semibold">
                            {" "}
                            {product.stavs}
                          </span>
                        </div>
                        <div className="h-[12px] w-[1px] border-l border-gray"></div>
                        <div className="text-secondary text-base">
                          Tretype
                          <span className="text-black font-semibold">
                            {" "}
                            {product.tretype}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-secondary text-sm">Pris</p>
                        <h4 className="text-base font-semibold text-black">
                          {product.pris}
                        </h4>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.selectedProduct && touched.selectedProduct && (
                  <div className="text-red text-sm px-6">
                    {errors.selectedProduct}
                  </div>
                )}
              </div>
              <div className="border w-full border-t border-b-0 border-r-0 border-l-0 border-darkGray"></div>
              <div className="rounded-[8px] p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <h4 className="text-black font-semibold text-xl">
                    Dine tilvalg:
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="text-secondary text-base">Parkett</div>
                    <div className="text-black text-base font-semibold">
                      +74.500 NOK
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-secondary text-base">Fliser</div>
                    <div className="text-black text-base font-semibold">
                      +23.650 NOK
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-secondary text-base">Kjøkken</div>
                    <div className="text-black text-base font-semibold">
                      +123.650 NOK
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-secondary text-base">Kjøkken</div>
                    <div className="text-black text-base font-semibold">
                      00 NOK
                    </div>
                  </div>
                </div>
                <div className="border w-full border-t border-b-0 border-r-0 border-l-0 border-darkGray"></div>
                <div className="flex items-center justify-between">
                  <div className="text-black text-base">
                    Foreløpig pris uten tomt
                  </div>
                  <div className="text-black text-xl font-semibold">
                    5.750.980 NOK
                  </div>
                </div>
              </div>
              <div
                className="sticky bottom-0 bg-white p-6"
                style={{
                  boxShadow:
                    "0px -4px 6px -2px #10182808, 0px -12px 16px -4px #10182814",
                }}
              >
                <div className="flex justify-end items-center gap-4">
                  <Button
                    text="Tilbake"
                    className="border border-lightPurple bg-lightPurple text-blue sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[46px] relative desktop:py-[16px]"
                    onClick={() => {
                      handleMenuClose();
                    }}
                  />
                  <Button
                    text="Bekreft"
                    className="border border-primary bg-primary text-white sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                    type="submit"
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Box>
    </Drawer>
  );
};

export default PropertyOptionDrawer;
