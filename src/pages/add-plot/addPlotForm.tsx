import Button from "@/components/common/button";
import SideSpaceContainer from "@/components/common/sideSpace";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";

const AddPlotForm = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values: any) => {
    console.log(values);
  };
  return (
    <>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <SideSpaceContainer>
              <div className="pt-[50px] pb-[98px]">
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
                  <div className="p-6"></div>
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
    </>
  );
};

export default AddPlotForm;
