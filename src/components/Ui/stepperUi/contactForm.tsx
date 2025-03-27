import React, { useState } from "react";
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

const ContactForm: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const validationSchema = Yup.object().shape({
    checkbox: Yup.boolean().oneOf([true], "Påkrevd").required("Påkrevd"),
  });

  const handleSubmit = async (values: any) => {
    console.log(values);
    const queryParams = new URLSearchParams(window.location.search);
    const isEmptyPlot = queryParams.get("empty");
    const husmodellId = queryParams.get("husodellId");

    try {
      let plotCollectionRef;

      if (isEmptyPlot === "true") {
        plotCollectionRef = collection(db, "empty_plot");
      } else {
        plotCollectionRef = collection(db, "plot_building");
      }

      const allLeadsQuery = query(plotCollectionRef);
      const allLeadsSnapshot = await getDocs(allLeadsQuery);

      if (allLeadsSnapshot.empty) {
        console.warn("No leads found in the collection.");
        return;
      }

      let correctPlotId = null;
      const allLeads = allLeadsSnapshot.docs.map((doc) => {
        return { propertyId: doc.id, ...doc.data() };
      });
      for (const lead of allLeads) {
        if (lead?.propertyId) {
          correctPlotId = lead.propertyId;
          break;
        }
      }

      if (!correctPlotId) {
        console.error("No valid plotId found in lamdaData.");
        return;
      }

      const leadsCollectionRef = collection(db, "leads");
      const querySnapshot: any = await getDocs(
        query(
          leadsCollectionRef,
          where("finalData.plot.id", "==", correctPlotId),
          where("finalData.husmodell.id", "==", husmodellId)
        )
      );

      await updateDoc(doc(db, "leads", querySnapshot.docs[0].id), {
        Isopt: true,
        updatedAt: new Date(),
      });
      toast.success("Added successfully.", { position: "top-right" });
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
