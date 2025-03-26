import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import Button from "@/components/common/button";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import toast from "react-hot-toast";

const ContactFormHusmodellPlotView: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const queryParams = new URLSearchParams(window.location.search);
  const plotId = queryParams.get("plot");
  const husmodellId = queryParams.get("husmodell");

  useEffect(() => {
    if (!plotId || !husmodellId) return;

    (async () => {
      try {
        const snapshot: any = await getDocs(
          query(
            collection(db, "leads"),
            where("finalData.plot.id", "==", plotId),
            where("finalData.husmodell.id", "==", husmodellId)
          )
        );
        if (!snapshot.empty)
          setIsChecked(snapshot.docs[0].data().Isopt || false);
      } catch (error) {
        console.error("Error fetching Isopt status:", error);
      }
    })();
  }, [plotId, husmodellId]);

  const handleSubmit = async () => {
    if (!plotId || !husmodellId) return;
    try {
      const snapshot: any = await getDocs(
        query(
          collection(db, "leads"),
          where("finalData.plot.id", "==", plotId),
          where("finalData.husmodell.id", "==", husmodellId)
        )
      );
      if (!snapshot.empty) {
        await updateDoc(doc(db, "leads", snapshot.docs[0].id), {
          Isopt: true,
          updatedAt: new Date(),
        });
        toast.success("Added successfully.", { position: "top-right" });
        setIsChecked(true);
      }
    } catch (error) {
      console.error("Firestore update operation failed:", error);
    }
  };

  return (
    <div className="bg-[#42307D] rounded-[12px] p-6">
      <Formik
        initialValues={{ checkbox: false }}
        validationSchema={Yup.object({
          checkbox: Yup.boolean().oneOf([true], "Påkrevd"),
        })}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form className="flex gap-6 justify-between">
            <div>
              <p className="text-white text-lg mb-4">
                Ønsker du å <span className="font-semibold">bli kontaktet</span>{" "}
                av <span className="font-semibold">BoligPartner</span>{" "}
                vedrørende denne eiendommen?
              </p>
              <label className="flex items-center gap-[12px] container">
                <Field
                  type="checkbox"
                  name="checkbox"
                  checked={isChecked}
                  onChange={() => {
                    setFieldValue("checkbox", !values.checkbox);
                    setIsChecked(!isChecked);
                  }}
                />
                <span className="checkmark"></span>
                <span className="text-[#FFFFFFCC] text-base">
                  Jeg aksepterer{" "}
                  <span className="text-white">deling av data</span> med{" "}
                  <span className="text-white">BoligPartner.</span>
                </span>
              </label>
              {errors.checkbox && touched.checkbox && (
                <div className="text-red text-sm">{errors.checkbox}</div>
              )}
            </div>
            <Button
              text="Send inn"
              className={`border border-primary bg-white text-primary sm:text-base rounded-[50px] w-[176px] h-[48px] font-semibold ${!isChecked ? "opacity-50 cursor-not-allowed" : ""}`}
              type="submit"
              disabled={!isChecked}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ContactFormHusmodellPlotView;
