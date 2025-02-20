import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import Button from "@/components/common/button";

const ContactForm: React.FC<any> = () => {
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const validationSchema = Yup.object().shape({
    checkbox: Yup.boolean().oneOf([true], "Påkrevd").required("Påkrevd"),
  });

  const handleSubmit = async (values: any) => {
    console.log(values);
  };

  return (
    <>
      <div className="bg-[#42307D] rounded-[12px] p-6">
        <Formik
          initialValues={{ checkbox: false }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form>
              <div className="flex gap-6 justify-between">
                <div>
                  <p className="text-white text-lg mb-4">
                    Ønsker du å{" "}
                    <span className="font-semibold">bli kontaktet</span> av{" "}
                    <span className="font-semibold">BoligPartner</span>{" "}
                    vedrørende denne eiendommen?
                  </p>
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
                    <span className="checkmark"></span>

                    <div className="text-[#FFFFFFCC] text-base">
                      Jeg aksepterer{" "}
                      <span className="text-white">deling av data</span> med{" "}
                      <span className="text-white">BoligPartner.</span>
                    </div>
                  </label>
                  {errors.checkbox && touched.checkbox && (
                    <div className="text-red text-sm">{errors.checkbox}</div>
                  )}
                </div>
                <div>
                  <Button
                    text="Send inn"
                    className="border border-primary bg-white text-primary sm:text-base rounded-[50px] w-[176px] h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative"
                    type="submit"
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ContactForm;
