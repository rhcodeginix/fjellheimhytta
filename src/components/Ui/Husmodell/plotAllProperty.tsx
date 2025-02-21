import React, { useEffect, useState } from "react";
import Img_plot1 from "@/public/images/Img_plot1.png";
import Img_plot2 from "@/public/images/Img_plot2.png";
import Img_product_logo1 from "@/public/images/Img_product_logo1.png";
import Img_product_logo2 from "@/public/images/Img_product_logo2.png";
import Img_plot3 from "@/public/images/Img_plot3.png";
import Img_plot4 from "@/public/images/Img_plot4.png";
import Img_plot5 from "@/public/images/Img_plot5.png";
import Img_plot6 from "@/public/images/Img_plot6.png";
import Img_plot7 from "@/public/images/Img_plot7.png";
import Img_plot8 from "@/public/images/Img_plot8.png";
import Img_product_logo3 from "@/public/images/Img_product_logo3.png";
import Img_product_logo4 from "@/public/images/Img_product_logo4.png";
import Img_product_map1 from "@/public/images/Img_product_map1.png";
import Button from "@/components/common/button";
import Image from "next/image";
import { useRouter } from "next/router";
import PlotDetail from "@/pages/husmodell/plotDetail";
import SideSpaceContainer from "@/components/common/sideSpace";

const PlotAllProperty: React.FC<any> = ({ handleNext, lamdaDataFromApi }) => {
  const propertyList = [
    {
      id: 1,
      href: "",
      image: Img_plot1,
      logo: Img_product_logo1,
      map: Img_product_map1,
      title: "Emerald Heights",
      price: "5.860.000 NOK",
      Gnr: "212",
      Bnr: "66",
      Snr: "8",
      moh: "77,3",
    },
    {
      id: 2,
      href: "",
      image: Img_plot2,
      logo: Img_product_logo2,
      map: Img_product_map1,
      title: "Gølden Acres",
      price: "5.210.000 NOK",
      Gnr: "212",
      Bnr: "66",
      Snr: "8",
      moh: "77,3",
    },
    {
      id: 3,
      href: "",
      image: Img_plot3,
      logo: Img_product_logo3,
      map: Img_product_map1,
      title: "Safirutsikt",
      price: "4.980.000  NOK",
      Gnr: "212",
      Bnr: "66",
      Snr: "8",
      moh: "77,3",
    },
    {
      id: 4,
      href: "",
      image: Img_plot4,
      logo: Img_product_logo4,
      map: Img_product_map1,
      title: "Willøw Creek",
      price: "5.860.000  NOK",
      Gnr: "212",
      Bnr: "66",
      Snr: "8",
      moh: "77,3",
    },
    {
      id: 5,
      href: "",
      image: Img_plot5,
      logo: Img_product_logo1,
      map: Img_product_map1,
      title: "Krystallenger",
      price: "5.860.000 NOK",
      Gnr: "212",
      Bnr: "66",
      Snr: "8",
      moh: "77,3",
    },
    {
      id: 6,
      href: "",
      image: Img_plot6,
      logo: Img_product_logo2,
      map: Img_product_map1,
      title: "Sølvfuruer",
      price: "5.210.000 NOK",
      Gnr: "212",
      Bnr: "66",
      Snr: "8",
      moh: "77,3",
    },
    {
      id: 7,
      href: "",
      image: Img_plot7,
      logo: Img_product_logo3,
      map: Img_product_map1,
      title: "Bløømfield Park",
      price: "4.980.000  NOK",
      Gnr: "212",
      Bnr: "66",
      Snr: "8",
      moh: "77,3",
    },
    {
      id: 8,
      href: "",
      image: Img_plot8,
      logo: Img_product_logo4,
      map: Img_product_map1,
      title: "Cedarwøød Plains",
      price: "5.860.000  NOK",
      Gnr: "212",
      Bnr: "66",
      Snr: "8",
      moh: "77,3",
    },
  ];

  const [plot, setPlot] = useState(null);
  const router = useRouter();
  const { query } = router as any;

  useEffect(() => {
    if (query.plot) {
      setPlot(query.plot);
    } else {
      setPlot(null);
    }
  }, [query, plot]);
  return (
    <>
      {plot ? (
        <>
          <PlotDetail
            handleNext={handleNext}
            lamdaDataFromApi={lamdaDataFromApi}
          />
        </>
      ) : (
        <>
          <SideSpaceContainer>
            <h3 className="text-black text-2xl font-semibold mb-[36px]">
              På følgende tomter kan du bytte Almgaard
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 desktop:grid-cols-4 gap-x-4 lg:gap-x-6 desktop:gap-x-8 gap-y-7 lg:gap-y-9 desktop:gap-y-12">
              {propertyList.map((property: any, index: any) => (
                <div
                  key={index}
                  className="flex flex-col justify-between cursor-pointer"
                  onClick={() => {
                    const newPlotId = property.id;
                    router.push(
                      `${router.asPath}&plot=${newPlotId}`,
                      undefined,
                      { shallow: true }
                    );
                    setPlot(newPlotId);
                  }}
                >
                  <div>
                    <div className="relative mb-4">
                      <Image
                        src={property.image}
                        alt="product-image"
                        className="w-full rounded-[12px] overflow-hidden"
                      />
                      <Image
                        src={property.logo}
                        alt="product-logo"
                        className="absolute top-[12px] left-[12px] bg-[#FFFFFFB2] py-2 px-3 flex items-center justify-center rounded-[32px]"
                      />
                      <Image
                        src={property.map}
                        alt="product-map"
                        className="absolute bottom-[12px] right-[12px] rounded-[8px]"
                      />
                    </div>
                    <h3 className="text-black text-lg font-medium mb-2">
                      {property.title}
                    </h3>
                    <div className="gap-4 flex items-center mb-4">
                      <p className="text-secondary text-sm">Pris fra</p>
                      <h5 className="text-black text-base font-semibold">
                        {property.price}
                      </h5>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-secondary text-sm">
                      Gnr:{" "}
                      <span className="text-black font-semibold">
                        {property.Gnr}
                      </span>
                    </div>
                    <div className="h-[12px] w-[1px] border-l border-gray"></div>
                    <div className="text-secondary text-sm">
                      Bnr:{" "}
                      <span className="text-black font-semibold">
                        {property.Bnr}
                      </span>
                    </div>
                    <div className="h-[12px] w-[1px] border-l border-gray"></div>
                    <div className="text-secondary text-sm">
                      Snr:{" "}
                      <span className="text-black font-semibold">
                        {property.Snr}
                      </span>
                    </div>
                    <div className="h-[12px] w-[1px] border-l border-gray"></div>
                    <div className="text-secondary text-sm">
                      <span className="text-black font-semibold">
                        {property.moh}{" "}
                      </span>
                      moh.
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-[60px] mb-[36px]">
              <Button
                text="Se flere modeller"
                className="border border-lightPurple bg-lightPurple text-blue sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[54px] relative desktop:py-[16px]"
                // path="/"
              />
            </div>
          </SideSpaceContainer>
        </>
      )}
    </>
  );
};

export default PlotAllProperty;
