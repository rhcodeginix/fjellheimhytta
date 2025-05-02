import Image from "next/image";
import Img_line_bg from "@/public/images/Img_line_bg.png";
import SideSpaceContainer from "@/components/common/sideSpace";
import AddPlotForm from "./addPlotForm";
import { useEffect, useState } from "react";
import { useUserLayoutContext } from "@/context/userLayoutContext";
import { useRouter } from "next/router";
import LoginForm from "../login/loginForm";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import VippsButton from "@/components/vipps";

const AddPlot = () => {
  const validationLoginSchema = Yup.object().shape({
    terms_condition: Yup.boolean().oneOf([true], "Påkrevd").required("Påkrevd"),
  });

  const { loginUser, setLoginUser } = useUserLayoutContext();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loginPopup, setLoginPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("min_tomt_login") === "true";
    if (isLoggedIn) {
      setLoginUser(true);
    }
  }, []);
  useEffect(() => {
    if (!loginUser) {
      setIsPopupOpen(true);
    } else {
      setIsPopupOpen(false);
    }
  }, [loginUser]);

  const handleLoginSubmit = async () => {
    setIsPopupOpen(false);
    setLoginPopup(true);
    router.push(`${router.asPath}?login_popup=true`);
  };
  const router_query: any = { ...router.query };

  delete router_query.login_popup;

  const queryString = new URLSearchParams(router_query).toString();



  return (
    <>
      <div className="relative">
        <div className="bg-lightPurple py-[48px] relative">
          <Image
            fetchPriority="auto"
            src={Img_line_bg}
            alt="image"
            className="absolute top-0 left-0 w-full h-full"
            style={{ zIndex: 1 }}
          />
          <SideSpaceContainer>
            <h2 className="text-darkBlack font-medium text-[20px] md:text-[24px] lg:text-[32px] desktop:text-[40px] mb-1">
              Selg din tomt – helt gratis!
            </h2>
            <p className="text-[#4A5578] text-sm md:text-base desktop:text-xl">
              Legg ut din tomt på mintomt.no og{" "}
              <span className="font-bold">nå tusenvis av boligbyggere</span> som
              ser etter sin drømmetomt. <br />
              Annonsen din er{" "}
              <span className="font-bold underline">gratis</span> og{" "}
              <span className="font-bold">enkel</span> å opprette!
            </p>
          </SideSpaceContainer>
        </div>
        <AddPlotForm />
        {!loginUser && (
          <div
            className="absolute top-0 h-full w-full left-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.7) 100%, rgba(255, 255, 255, 0.7) 100%)",
            }}
          ></div>
        )}
      </div>
      {isPopupOpen && !loginUser && (
        <div className="fixed top-0 left-0 flex justify-center items-center h-full w-full">
          <div
            className="bg-white mx-4 p-4 md:p-8 rounded-[8px] w-full max-w-[787px]"
            style={{
              boxShadow:
                "0px 8px 8px -4px rgba(16, 24, 40, 0.031), 0px 20px 24px -4px rgba(16, 24, 40, 0.078)",
            }}
          >
            <h2 className="text-black text-lg md:text-xl desktop:text-2xl font-semibold mb-2 text-center">
              Registrer deg
            </h2>
            <p className="text-secondary text-xs md:text-sm desktop:text-base text-center mb-2">
              Logg inn med{" "}
              <span className="font-semibold text-black">Vipps</span> for å få
              se{" "}
              <span className="font-semibold text-black">
                alle bestemmelser og finne <br className="hidden sm:block" />
                boliger som passer på denne eiendommen
              </span>
            </p>
            <Formik
              initialValues={{ terms_condition: false }}
              validationSchema={validationLoginSchema}
              onSubmit={handleLoginSubmit}
            >
                {({  }) => (
                <Form>
                  <div className="flex items-center justify-center flex-col">
                   
                    <div className="flex justify-end mt-6">
                    <VippsButton/>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {loginPopup && !loginUser && (
        <div
          className="fixed top-0 left-0 flex justify-center items-center h-full w-full"
          style={{ zIndex: 9999999 }}
        >
          <LoginForm
            path={`${router.pathname}?${queryString}`}
            setLoginPopup={setLoginPopup}
          />
        </div>
      )}
    </>
  );
};

export default AddPlot;
