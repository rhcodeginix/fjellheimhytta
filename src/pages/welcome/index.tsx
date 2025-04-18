"use client";
import Button from "@/components/common/button";
import { Field, Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import Ic_logo from "@/public/images/Ic_logo.svg";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const Welcome = () => {
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .oneOf(["Iplot@2025"], "Password is incorrect")
      .required("Password is required"),
  });

  const router = useRouter();
  const handleSubmit = async () => {
    toast.success("Congratulation!, Your Password is right.", {
      position: "top-right",
    });
    router.push("/");
    sessionStorage.setItem("min_tomt_welcome", "true");
  };

  return (
    <div className="relative">
      <div className="w-full h-screen flex items-center justify-center">
        <div
          className="w-full mx-4 max-w-[490px] bg-white p-7"
          style={{
            boxShadow:
              "0px 8px 8px -4px #10182808, 0px 20px 24px -4px #10182814",
          }}
        >
          <div className="flex flex-col items-center justify-center gap-3 mb-5">
            <Image src={Ic_logo} alt="logo" fetchPriority="auto" />
            <h2 className="text-2xl font-semibold">Welcome Fiellheimhytta</h2>
          </div>

          <Formik
            initialValues={{ password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="mb-4 flex flex-col gap-1">
                  <label
                    htmlFor="password"
                    className={`${errors.password && touched.password ? "text-red" : "text-black"} text-sm`}
                  >
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    className={`w-full p-2 rounded-md border ${errors.password && touched.password ? "border-red" : "border-gray"} focus-visible:border-gray focus-visible:outline-none focus:border-gray `}
                    placeholder="Enter your password"
                  />
                  {errors.password && touched.password && (
                    <div className="text-red text-sm">{errors.password}</div>
                  )}
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    text="Send inn"
                    className="border border-primary bg-white text-primary sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative"
                    type="submit"
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
