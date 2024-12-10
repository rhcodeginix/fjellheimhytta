import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import Ic_Star from "@/public/images/Ic_Star.svg";

const CarouselSlider: React.FC<any> = ({ slides }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <Slider {...settings}>
      {slides.map((slide: any, index: any) => (
        <div key={index}>
          <div className="rounded-[24px] overflow-hidden bg-purple flex flex-col md:flex-row items-center md:items-end desktop:items-center md:pt-[30px] desktop:pt-0 justify-between desktop:justify-normal">
            <div className="flex flex-col w-full md:w-6/12 lg:w-[61%] md:mb-[56px] desktop:mb-0 p-16">
              <div className="flex items-center gap-1 mb-[24px]">
                {[...Array(slide.star)].map((_, i) => (
                  <Image key={i} src={Ic_Star} alt="star" />
                ))}
              </div>
              <h1 className="text-white font-medium text-2xl md:text-[36px] mb-8 leading-[44px] tracking-[-1px] w-5/6">
                {slide.title}
              </h1>
              <div className="flex flex-col gap-1">
                <h5 className="text-white text-lg font-medium">
                  {slide.reviewerName}
                </h5>
                <p className="text-white text-base">{slide.position}</p>
              </div>
            </div>
            <div className="w-full sm:w-[80%] md:w-5/12 desktop:w-[39%]">
              <Image
                src={slide.imageSrc}
                alt="course-img"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default CarouselSlider;
