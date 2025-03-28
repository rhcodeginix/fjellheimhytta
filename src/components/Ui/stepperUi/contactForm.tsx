import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import Button from "@/components/common/button";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import toast from "react-hot-toast";

const ContactForm: React.FC<{ leadId?: any }> = ({ leadId }) => {
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const validationSchema = Yup.object().shape({
    checkbox: Yup.boolean().oneOf([true], "Påkrevd").required("Påkrevd"),
  });
  useEffect(() => {
    (async () => {
      try {
        const docSnap = await getDoc(doc(db, "leads", leadId));

        if (docSnap.exists()) {
          setIsChecked(docSnap.data().Isopt || false);
        }
      } catch (error) {
        console.error("Error fetching Isopt status:", error);
      }
    })();
  }, [leadId]);
  const handleSubmit = async () => {
    try {
      if (leadId) {
        await updateDoc(doc(db, "leads", leadId), {
          Isopt: true,
          updatedAt: new Date(),
        });
        toast.success("Added successfully.", { position: "top-right" });
      } else {
        toast.error("Lead id not found.", { position: "top-right" });
      }
      setIsChecked(true);
    } catch (error) {
      console.error("Firestore update operation failed:", error);
    }
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
                    className={`border border-primary bg-white text-primary sm:text-base rounded-[50px] w-[176px] h-[48px] font-semibold ${!isChecked ? "opacity-50 cursor-not-allowed" : ""}`}
                    type="submit"
                    disabled={!isChecked}
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
