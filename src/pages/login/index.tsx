"use client";
import Button from "@/components/common/button";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
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
import Loader from "@/components/Loader";
// import { doc, setDoc } from "firebase/firestore";
// import NameModal from "./nameModal";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [newUser, setNewUser] = useState<any>(null);
  // setNewUser(null);

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user: any = userCredential.user;
      localStorage.setItem("min_tomt_login", "true");
      toast.success("Login successfully", { position: "top-right" });
      localStorage.setItem("Iplot_email", user.email);
      router.push("/");
    } catch (error) {
      console.error("Error during sign-in", error);
      toast.error(
        "Login failed. Please check your credentials or register if you don't have an account.",
        {
          position: "top-right",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const googleProvider = new GoogleAuthProvider();

  // const handleNameSubmit = async (name: any) => {
  //   if (newUser) {
  //     try {
  //       const userDocRef = doc(db, "users", newUser.uid);
  //       await setDoc(userDocRef, {
  //         email: newUser.email,
  //         name: name,
  //         uid: newUser.uid,
  //       });

  //       toast.success("Google sign-in successful!", { position: "top-right" });
  //       localStorage.setItem("min_tomt_login", "true");
  //       localStorage.setItem("Iplot_email", newUser.email);
  //       router.push("/");
  //     } catch (error) {
  //       console.error("Error saving new user", error);
  //       toast.error("Registration failed. Please try again.", {
  //         position: "top-right",
  //       });
  //     } finally {
  //       setIsModalOpen(false); // Close the modal
  //     }
  //   }
  // };

  // const signInWithGoogle = async () => {
  //   setLoading(true);
  //   try {
  //     const result = await signInWithPopup(auth, googleProvider);
  //     const user: any = result.user;

  //     const userDocRef = doc(db, "users", user.uid);
  //     const userDoc = await getDoc(userDocRef);

  //     if (userDoc.exists()) {
  //       toast.success("Google sign-in successfull!", { position: "top-right" });
  //       localStorage.setItem("min_tomt_login", "true");
  //       localStorage.setItem("Iplot_email", user?.email);
  //       router.push("/");
  //     } else {
  //       setNewUser(user);
  //       setIsModalOpen(true);
  //     }
  //   } catch (error) {
  //     console.error("Error during Google Sign-In", error);
  //     toast.error("Google sign-in failed. Please try again.", {
  //       position: "top-right",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user: any = result.user;
      toast.success("Google sign-in successful!", { position: "top-right" });
      localStorage.setItem("min_tomt_login", "true");
      localStorage.setItem("Iplot_email", user?.email);
    } catch (error) {
      console.error("Error during Google Sign-In", error);
      toast.error("Google sign-in failed. Please try again.", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
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
      {loading && (
        <div className="absolute top-0 left-0">
          <Loader />
        </div>
      )}
      {/* <NameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNameSubmit}
      /> */}
    </div>
  );
};

export default Login;
