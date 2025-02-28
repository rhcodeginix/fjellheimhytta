import Image from "next/image";
import Img_line_bg from "@/public/images/Img_line_bg.png";
import SideSpaceContainer from "@/components/common/sideSpace";
import AddPlotForm from "./addPlotForm";

const AddPlot = () => {
  return (
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
          <h2 className="text-[#111322] font-medium text-[20px] md:text-[24px] lg:text-[32px] desktop:text-[40px] mb-1">
            Selg din tomt – helt gratis!
          </h2>
          <p className="text-[#4A5578] text-sm md:text-base desktop:text-xl">
            Legg ut din tomt på mintomt.no og{" "}
            <span className="font-bold">nå tusenvis av boligbyggere</span> som
            ser etter sin drømmetomt. <br />
            Annonsen din er <span className="font-bold underline">
              gratis
            </span>{" "}
            og <span className="font-bold">enkel</span> å opprette!
          </p>
        </SideSpaceContainer>
      </div>
      <AddPlotForm />
    </div>
  );
};

export default AddPlot;
