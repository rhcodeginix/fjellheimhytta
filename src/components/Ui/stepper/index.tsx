import SideSpaceContainer from "@/components/common/sideSpace";
import { useRouter } from "next/router";
import React from "react";

interface Step {
  name: string;
  component: JSX.Element;
}

interface StepperProps {
  steps: Step[];
  currIndex: any;
  setCurrIndex: any;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currIndex,
  setCurrIndex,
}) => {
  const router = useRouter();
  const handleStepClick = (index: number) => {
    if (index <= currIndex) {
      setCurrIndex(index);
    }
    if (currIndex > index && (index === 0 || index === 1 || index === 2)) {
      const { plot, ...restQuery } = router.query as any;
      const updatedQuery = new URLSearchParams(restQuery).toString();

      router.push(
        `${router.pathname}${updatedQuery ? `?${updatedQuery}` : ""}`
      );
    }
  };

  return (
    <>
      <SideSpaceContainer>
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
              <div
                className={`screen-indicator ${
                  index < currIndex
                    ? "completed"
                    : index === currIndex
                      ? "current"
                      : ""
                }`}
              ></div>
              <span>{step.name}</span>
            </div>
          ))}
        </div>
      </SideSpaceContainer>

      <div className="active_page">
        {steps[currIndex]?.component || <div>Unknown step</div>}
      </div>
    </>
  );
};

export default Stepper;
