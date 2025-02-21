import React from "react";
import Img_product1 from "@/public/images/Img_product1.png";
import Img_product2 from "@/public/images/Img_product2.png";
import Img_product_logo1 from "@/public/images/Img_product_logo1.png";
import Img_product_logo2 from "@/public/images/Img_product_logo2.png";
import Img_product3 from "@/public/images/Img_product3.png";
import Img_product4 from "@/public/images/Img_product4.png";
import Img_product5 from "@/public/images/Img_product5.png";
import Img_product6 from "@/public/images/Img_product6.png";
import Img_product_logo3 from "@/public/images/Img_product_logo3.png";
import Img_product_logo4 from "@/public/images/Img_product_logo4.png";
import Img_product_map1 from "@/public/images/Img_product_map1.png";
import Img_plot_analysis from "@/public/images/Img_plot_analysis.png";
import Img_architect_design_house from "@/public/images/Img_architect_design_house.png";
import Button from "@/components/common/button";
import Property from "@/components/common/property";
import Link from "next/link";
import Image from "next/image";

const AllProperty: React.FC<any> = () => {
  const propertyList = [
    {
      id: 1,
      href: "",
      image: Img_product1,
      logo: Img_product_logo1,
      map: Img_product_map1,
      title: "Herskapelige Almgaard er en drømmebolig for familien",
      price: "5.860.000 NOK",
      area: "233",
      bedrooms: "5",
      bathrooms: "3",
    },
    {
      id: 2,
      href: "",
      image: Img_product2,
      logo: Img_product_logo2,
      map: Img_product_map1,
      title: "Drøbak - dette huset har en enkel, ren og moderne fasade",
      price: "5.210.000 NOK",
      area: "179",
      bedrooms: "4",
      bathrooms: "2",
    },
    {
      id: 3,
      href: "",
      image: Img_product3,
      logo: Img_product_logo3,
      map: Img_product_map1,
      title: "Funkishus med utleiedel",
      price: "4.980.000  NOK",
      area: "172",
      bedrooms: "3/4",
      bathrooms: "2",
    },
    {
      id: 4,
      href: "",
      image: Img_product4,
      logo: Img_product_logo4,
      map: Img_product_map1,
      title: "Askøy med pulttak – Moderne hus tilpasset utleie",
      price: "5.860.000  NOK",
      area: "184",
      bedrooms: "4",
      bathrooms: "2",
    },
    {
      id: 5,
      href: "",
      image: Img_product5,
      logo: Img_product_logo1,
      map: Img_product_map1,
      title: "Herskapelige Almgaard er en drømmebolig for familien",
      price: "5.860.000 NOK",
      area: "233",
      bedrooms: "5",
      bathrooms: "3",
    },
    {
      id: 6,
      href: "",
      image: Img_product6,
      logo: Img_product_logo2,
      map: Img_product_map1,
      title: "Drøbak - dette huset har en enkel, ren og moderne fasade",
      price: "5.210.000 NOK",
      area: "179",
      bedrooms: "4",
      bathrooms: "2",
    },
    // {
    //   id: 7,
    //   href: "",
    //   image: Img_product3,
    //   logo: Img_product_logo3,
    //   map: Img_product_map1,
    //   title: "Funkishus med utleiedel",
    //   price: "4.980.000  NOK",
    //   area: "172",
    //   bedrooms: "3/4",
    //   bathrooms: "2",
    // },
    // {
    //   id: 8,
    //   href: "",
    //   image: Img_product4,
    //   logo: Img_product_logo4,
    //   map: Img_product_map1,
    //   title: "Askøy med pulttak – Moderne hus tilpasset utleie",
    //   price: "5.860.000  NOK",
    //   area: "184",
    //   bedrooms: "4",
    //   bathrooms: "2",
    // },
  ];
  return (
    <>
      <div className="pt-[16px] pb-[146px]">
        <h3 className="text-black text-2xl font-semibold mb-[36px]">
          Følgende husmodeller kan bygges på denne tomten
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 desktop:grid-cols-4 gap-x-4 lg:gap-x-6 desktop:gap-x-8 gap-y-7 lg:gap-y-9 desktop:gap-y-12">
          <Property
            propertyList={propertyList}
            LinkHref={"/regulations?regulation-details"}
          />
          <Link
            href={`/regulations?regulation-details=7`}
            className="flex flex-col justify-between"
          >
            <div>
              <div className="relative mb-4">
                <Image
                  src={Img_plot_analysis}
                  alt="product-image"
                  className="w-full rounded-[12px] overflow-hidden"
                />
              </div>
              <h3 className="text-black text-lg font-bold mb-2">
                Fullstendig tomteanalyse?
              </h3>
              <div className="gap-4 flex items-center mb-4">
                <p className="text-secondary text-sm">Pris fra</p>
                <h5 className="text-black text-base font-semibold">99 NOK</h5>
              </div>
            </div>
            <Button
              text="Les mer"
              className="border border-primary bg-primary text-white sm:text-base rounded-[8px] w-full h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
            />
          </Link>
          <Link
            href={`/regulations?regulation-details=7`}
            className="flex flex-col justify-between"
          >
            <div>
              <div className="relative mb-4">
                <Image
                  src={Img_architect_design_house}
                  alt="product-image"
                  className="w-full rounded-[12px] overflow-hidden"
                />
              </div>
              <h3 className="text-black text-lg font-bold mb-2">
                Arkitekttegnet hus?
              </h3>
              <div className="gap-4 flex items-center mb-2">
                <p className="text-secondary text-sm">
                  Vi kan bygge din drømmebolig med hjelp fra våre arkitekter
                </p>
              </div>
            </div>
            <Button
              text="Les mer"
              className="border border-primary bg-primary text-white sm:text-base rounded-[8px] w-full h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
            />
          </Link>
        </div>
        <div className="flex justify-center mt-[60px]">
          <Button
            text="Se flere modeller"
            className="border border-lightPurple bg-lightPurple text-blue sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[54px] relative desktop:py-[16px]"
            // path="/"
          />
        </div>
      </div>
    </>
  );
};

export default AllProperty;
