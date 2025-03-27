import SideSpaceContainer from "@/components/common/sideSpace";
// import { useRouter } from "next/router";
import React, { useEffect } from "react";
import PropertyDetail from "../stepperUi/propertyDetail";

interface Step {
  name: string;
  component: JSX.Element;
}

interface StepperProps {
  steps: Step[];
  currIndex: any;
  setCurrIndex: any;
  loadingAdditionalData?: any;
  CadastreDataFromApi?: any;
  askData?: any;
  lamdaDataFromApi?: any;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currIndex,
  setCurrIndex,
  loadingAdditionalData,
  CadastreDataFromApi,
  askData,
  lamdaDataFromApi,
}) => {
  // const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined" && currIndex) {
      localStorage.setItem("currIndex", currIndex.toString());
    }
  }, [currIndex]);

  const handleStepClick = (index: number) => {
    if (index <= currIndex) {
      setCurrIndex(index);
    }
    localStorage.setItem("currIndex", index.toString());
    if (currIndex > index && (index === 0 || index === 1 || index === 2)) {
      // const { plot, ...restQuery } = router.query as any;
      // const updatedQuery = new URLSearchParams(restQuery).toString();
      // router.push(
      //   `${router.pathname}${updatedQuery ? `?${updatedQuery}` : ""}`
      // );
    }
  };

  return (
    <>
      <>
        <SideSpaceContainer>
          <div className="stepper_main overFlowScrollHidden">
            <div className="stepper-wrapper">
              <div className="progress"></div>
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`screen-indicator-span ${
                    index < currIndex
                      ? "completed"
                      : index === currIndex
                        ? "current"
                        : ""
                  }`}
                  onClick={() => handleStepClick(index)}
                  style={{
                    color: index === currIndex ? "#2a343e" : "",
                  }}
                >
                  <div className="flex items-center bg-white gap-1.5 md:gap-2 px-1 md:px-2">
                    <span className="screen-index">{index + 1}</span>
                    <span>{step.name}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`screen-indicator ${
                        index < currIndex
                          ? "completed"
                          : index === currIndex
                            ? "current"
                            : ""
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </SideSpaceContainer>
        <PropertyDetail
          loadingAdditionalData={loadingAdditionalData}
          askData={askData}
          CadastreDataFromApi={CadastreDataFromApi}
          lamdaDataFromApi={lamdaDataFromApi}
        />

        <div className="active_page">
          {steps[currIndex]?.component || <div>Unknown step</div>}
        </div>
      </>
    </>
  );
};

export default Stepper;
