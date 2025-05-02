import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import HusmodellPropertyPage from "../husmodell";
import HusmodellDetail from "./husmodell-details";
import * as Yup from "yup";

import { Formik, Form } from "formik";
import LoginForm from "../login/loginForm";
import VippsButton from "@/components/vipps";

const Husmodell: React.FC<any> = ({
  handleNext,
  loading,
  loginUser,
  isPopupOpen,
  setIsPopupOpen,
  setIsCall,
  HouseModelData,
  pris,
  lamdaDataFromApi,
  supplierData,
}) => {
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();
  const { husmodellId } = router.query;

  const [loginPopup, setLoginPopup] = useState(false);

  const validationLoginSchema = Yup.object().shape({
    terms_condition: Yup.boolean().oneOf([true], "Påkrevd").required("Påkrevd"),
  });



  const handleLoginSubmit = async () => {
    setIsPopupOpen(false);
    setLoginPopup(true);
    router.push(`${router.asPath}&login_popup=true`);
  };

  useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPopupOpen]);

  const router_query: any = { ...router.query };

  delete router_query.login_popup;

  const queryString = new URLSearchParams(router_query).toString();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <div className="relative">
      {!husmodellId ? (
        <HusmodellPropertyPage />
      ) : (
        <HusmodellDetail
          handleNext={handleNext}
          HouseModelData={HouseModelData}
          loading={loading}
          pris={pris}
          lamdaDataFromApi={lamdaDataFromApi}
          supplierData={supplierData}
        />
      )}

      {!loginUser && (
        <div
          className="absolute top-0 h-full w-full left-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.7) 100%, rgba(255, 255, 255, 0.7) 100%)",
          }}
        ></div>
      )}

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
            setIsCall={setIsCall}
          />
        </div>
      )}
    </div>
  );
};

export default Husmodell;
