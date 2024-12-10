import React from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import CarouselSlider from "@/components/Ui/slider/carousel";
import Img_review from "@/public/images/Img_review.png";

const Review = () => {
  const slides = [
    {
      title:
        "Jeg fikk raskt vite at jeg kunne bygge drømmehuset mitt uten overraskelser",
      reviewerName: "— Ada Linna Blomkvist",
      position: "Nærsnes, Asker",
      imageSrc: Img_review,
      star: 5,
    },
    {
      title:
        "Jeg fikk raskt vite at jeg kunne bygge drømmehuset mitt uten overraskelser",
      reviewerName: "— Ada Linna Blomkvist",
      position: "Nærsnes, Asker",
      imageSrc: Img_review,
      star: 4,
    },
    {
      title:
        "Jeg fikk raskt vite at jeg kunne bygge drømmehuset mitt uten overraskelser",
      reviewerName: "— Ada Linna Blomkvist",
      position: "Nærsnes, Asker",
      imageSrc: Img_review,
      star: 4,
    },
  ];
  return (
    <>
      <SideSpaceContainer>
        <div className="py-[120px]">
          <h2 className="text-black font-semibold text-[48px] leading-[56px] mb-[20px] text-center tracking-[-1px]">
            Dette sier noen av våre kunder om oss
          </h2>
          <p className="text-center text-secondary font-medium text-lg leading-[21.78px] mb-[48px]">
            Roterende sitater fra kunder som har brukt iPlot og er fornøyde med
            tjenesten.
          </p>
          <CarouselSlider slides={slides} />
        </div>
      </SideSpaceContainer>
    </>
  );
};

export default Review;
