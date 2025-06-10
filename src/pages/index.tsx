"use client";
import MainSection from "./homepage/mainSection";
import HowItWorks from "./homepage/howItWorks";
import OurPartners from "./homepage/ourPartners";
import Footer from "@/components/Ui/footer";
import React, { useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";
import Cookies from "js-cookie";

const index = () => {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const code: any = urlParams.get("code");
    // const state = urlParams.get("state");
    const error = urlParams.get("error");

    if (code) {
      callApi(code);
    } else if (error) {
      console.error(error);
    }

    // Function to call your API with the code
    function callApi(code: any) {
      fetch(
        "https://9spebvryg9.execute-api.eu-north-1.amazonaws.com/prod/vipps",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: code }),
        }
      )
        .then((response) => response.json())

        .then(async (data) => {
          const { user } = data;

          const userEmail = user.email;
          const userName = user.name;
          const userUid = user.id;

          const usersRef = collection(db, "users");

          const q = query(usersRef, where("email", "==", userEmail));

          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            try {
              const existingUserDoc: any = querySnapshot.docs[0];
              const userData = existingUserDoc.data();

              // if (
              //   userData.loginType === "form" ||
              //   userData.loginType === "google"
              // ) {
              //   router.push("/login");
              //   toast.error(
              //     `Already have user with ${userData.loginType === "form" ? "form fill" : `${userData.loginType} login`}`,
              //     {
              //       position: "top-right",
              //     }
              //   );
              //   return;
              // }
              await signInWithEmailAndPassword(
                auth,
                "alvhole@hotmail.com",
                "5CpATHnuwFglSzpOi1EZFrAjNmO2"
              );
              localStorage.setItem("min_tomt_login", "true");
              const userDocRef = doc(db, "users", "alvhole@hotmail.com");

              await updateDoc(userDocRef, {
                updatedAt: new Date(),
                loginCount: increment(1),
              });
              toast.success("Vipps login successfully", {
                position: "top-right",
              });
              localStorage.setItem("I_plot_email", user.email);
              // router.push("/");
              const redirectPath = Cookies.get("vipps_redirect_old_path");
              if (redirectPath) {
                Cookies.remove("vipps_redirect_old_path");
                window.location.assign(redirectPath); // full reload to the original route
              } else {
                router.push("/");
              }
            } catch (error) {
              console.error("Login error:", error);
              toast.error("Login failed.");
            }
          } else {
            try {
              const userCredential = await createUserWithEmailAndPassword(
                auth,
                userEmail,
                userUid
              );
              const createdUser = userCredential.user;

              const userDocRef = doc(db, "users", createdUser.uid);

              const docSnap = await getDoc(userDocRef);

              if (!docSnap.exists()) {
                await setDoc(userDocRef, {
                  email: createdUser.email,
                  uid: createdUser.uid,
                  loginType: "vipps",
                  name: userName,
                  createdAt: new Date(),
                  address: user.address,
                });
                await signInWithEmailAndPassword(auth, userEmail, userUid);
                localStorage.setItem("min_tomt_login", "true");
                toast.success("Vipps login successfully", {
                  position: "top-right",
                });

                await updateDoc(userDocRef, {
                  updatedAt: new Date(),
                  loginCount: increment(1),
                });
                // router.push("/");
                const redirectPath = Cookies.get("vipps_redirect_old_path");
                if (redirectPath) {
                  Cookies.remove("vipps_redirect_old_path");
                  window.location.assign(redirectPath); // full reload to the original route
                } else {
                  router.push("/");
                }
                localStorage.setItem("I_plot_email", user.email);
              }
            } catch (error: any) {
              if (error.code === "auth/email-already-in-use") {
                const existingUserDoc: any = querySnapshot.docs[0];
                const userData = existingUserDoc.data();

                if (
                  userData.loginType === "form" ||
                  userData.loginType === "google"
                ) {
                  router.push("/login");
                  toast.error(
                    `Already have user with ${userData.loginType === "form" ? "form fill" : `${userData.loginType} login`}`,
                    {
                      position: "top-right",
                    }
                  );
                  return;
                }
                try {
                  await signInWithEmailAndPassword(auth, userEmail, userUid);
                  localStorage.setItem("min_tomt_login", "true");
                  toast.success("Vipps login successfully", {
                    position: "top-right",
                  });
                  // router.push("/");
                  const redirectPath = Cookies.get("vipps_redirect_old_path");
                  if (redirectPath) {
                    Cookies.remove("vipps_redirect_old_path");
                    window.location.assign(redirectPath); // full reload to the original route
                  } else {
                    router.push("/");
                  }
                  const userDocRef = doc(db, "users", userEmail);

                  await updateDoc(userDocRef, {
                    updatedAt: new Date(),
                    loginCount: increment(1),
                  });
                  localStorage.setItem("I_plot_email", user.email);
                } catch (error) {
                  console.error("Login error:", error);
                  router.push("/login");
                  toast.error("Vipps login failed.");
                }
              } else {
                console.error("Error:", error.message);
                router.push("/login");
                toast.error("An error occurred. Please try again.", {
                  position: "top-right",
                });
              }
            }
          }
        })
        .catch((error) => {
          router.push("/login");
          console.error("API error:", error);
          toast.error("Something went wrong!.", {
            position: "top-right",
          });
        });
    }
  }, []);
  return (
    <div className="relative">
      <MainSection />
      <HowItWorks />
      <OurPartners />
      <Footer />
    </div>
  );
};

export default index;
