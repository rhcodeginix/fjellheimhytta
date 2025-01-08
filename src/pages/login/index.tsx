"use client";
import Button from "@/components/common/button";
import { Field, Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import Ic_logo from "@/public/images/Ic_logo.svg";
import Img_login_google from "@/public/images/Img_login_google.svg";
import { auth } from "@/config/firebaseConfig";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";

const Login = () => {
  // const requiredEmail = "andré.finger@gmail.com";
  // const requiredPassword = "andré@123";
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      //   .email("Invalid email address")
      .required("Email is required"),
    // .test(
    //   "email-match",
    //   "Email not match!",
    //   (value) => value === requiredEmail
    // ),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    // .test(
    //   "password-match",
    //   "Password Not Match",
    //   (value) => value === requiredPassword
    // ),
  });

  const handleSubmit = async (values: any) => {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        const user: any = userCredential.user;
        localStorage.setItem("min_tomt_login", "true");
        toast.success("Login successfully", { position: "top-right" });
        localStorage.setItem("Iplot_email", user.email);
        router.push("/");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  const googleProvider = new GoogleAuthProvider();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user: any = result.user;

      toast.success("Google sign-in successful!", { position: "top-right" });

      setTimeout(() => {
        localStorage.setItem("min_tomt_login", "true");
        localStorage.setItem("Iplot_email", user?.email);
      }, 500);
    } catch (error) {
      console.error("Error during Google Sign-In", error);
      toast.error("Google sign-in failed. Please try again.", {
        position: "top-right",
      });
    }
  };

  return (
    <>
      <div className="w-full h-screen flex items-center justify-center">
        <div
          className="w-full mx-4 max-w-[490px] bg-white p-7"
          style={{
            boxShadow:
              "0px 8px 8px -4px #10182808, 0px 20px 24px -4px #10182814",
          }}
        >
          <div className="flex justify-center mb-10">
            <Image src={Ic_logo} alt="logo" fetchPriority="high" />
          </div>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="mb-4 flex flex-col gap-1">
                  <label
                    htmlFor="email"
                    className={`${errors.email && touched.email ? "text-red" : "text-black"} text-sm`}
                  >
                    Email
                  </label>
                  <Field
                    type="text"
                    name="email"
                    id="email"
                    className={`w-full p-2 rounded-md border ${errors.email && touched.email ? "border-red" : "border-gray"} focus-visible:border-gray focus-visible:outline-none focus:border-gray `}
                    placeholder="Enter your email"
                  />
                  {errors.email && touched.email && (
                    <div className="text-red text-sm">{errors.email}</div>
                  )}
                </div>

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
                    className="border border-primary bg-white text-primary sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative"
                    type="submit"
                  />
                </div>
              </Form>
            )}
          </Formik>
          <div className="flex items-center justify-center text-[#4F4F4F] mt-3">
            Didn’t Registered?{" "}
            <Link href={"/register"} className="text-black font-semibold">
              &nbsp;Register Here
            </Link>
          </div>
          <div
            onClick={signInWithGoogle}
            className="text-black bg-[#F8F6F4] border border-gray rounded-[8px] p-2 mt-6 flex gap-2 justify-center items-center font-semibold cursor-pointer"
          >
            <Image src={Img_login_google} alt="google" fetchPriority="high" />
            Continue with login
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
