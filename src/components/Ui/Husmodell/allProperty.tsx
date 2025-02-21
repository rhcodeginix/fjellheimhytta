import React from "react";
// import Img_product1 from "@/public/images/Img_product1.png";
// import Img_product2 from "@/public/images/Img_product2.png";
// import Img_product_logo1 from "@/public/images/Img_product_logo1.png";
// import Img_product_logo2 from "@/public/images/Img_product_logo2.png";
// import Img_product3 from "@/public/images/Img_product3.png";
// import Img_product4 from "@/public/images/Img_product4.png";
// import Img_product_logo3 from "@/public/images/Img_product_logo3.png";
// import Img_product_logo4 from "@/public/images/Img_product_logo4.png";
// import Img_product_map1 from "@/public/images/Img_product_map1.png";
// import Property from "@/components/common/property";
import Loader from "@/components/Loader";
import Link from "next/link";
import GoogleMapComponent from "../map";

const HouseModelAllProperty: React.FC<{
  HouseModelProperty: any;
  isLoading: any;
}> = ({ HouseModelProperty, isLoading }) => {
  // const propertyList = [
  //   {
  //     id: 1,
  //     href: "",
  //     image: Img_product1,
  //     logo: Img_product_logo1,
  //     map: Img_product_map1,
  //     title: "Herskapelige Almgaard er en drømmebolig for familien",
  //     price: "5.860.000 NOK",
  //     area: "233",
  //     bedrooms: "5",
  //     bathrooms: "3",
  //   },
  //   {
  //     id: 2,
  //     href: "",
  //     image: Img_product2,
  //     logo: Img_product_logo2,
  //     map: Img_product_map1,
  //     title: "Drøbak - dette huset har en enkel, ren og moderne fasade",
  //     price: "5.210.000 NOK",
  //     area: "179",
  //     bedrooms: "4",
  //     bathrooms: "2",
  //   },
  //   {
  //     id: 3,
  //     href: "",
  //     image: Img_product3,
  //     logo: Img_product_logo3,
  //     map: Img_product_map1,
  //     title: "Funkishus med utleiedel",
  //     price: "4.980.000  NOK",
  //     area: "172",
  //     bedrooms: "3/4",
  //     bathrooms: "2",
  //   },
  //   {
  //     id: 4,
  //     href: "",
  //     image: Img_product4,
  //     logo: Img_product_logo4,
  //     map: Img_product_map1,
  //     title: "Askøy med pulttak – Moderne hus tilpasset utleie",
  //     price: "5.860.000  NOK",
  //     area: "184",
  //     bedrooms: "4",
  //     bathrooms: "2",
  //   },
  //   {
  //     id: 5,
  //     href: "",
  //     image: Img_product1,
  //     logo: Img_product_logo1,
  //     map: Img_product_map1,
  //     title: "Herskapelige Almgaard er en drømmebolig for familien",
  //     price: "5.860.000 NOK",
  //     area: "233",
  //     bedrooms: "5",
  //     bathrooms: "3",
  //   },
  //   {
  //     id: 6,
  //     href: "",
  //     image: Img_product2,
  //     logo: Img_product_logo2,
  //     map: Img_product_map1,
  //     title: "Drøbak - dette huset har en enkel, ren og moderne fasade",
  //     price: "5.210.000 NOK",
  //     area: "179",
  //     bedrooms: "4",
  //     bathrooms: "2",
  //   },
  //   {
  //     id: 7,
  //     href: "",
  //     image: Img_product3,
  //     logo: Img_product_logo3,
  //     map: Img_product_map1,
  //     title: "Funkishus med utleiedel",
  //     price: "4.980.000  NOK",
  //     area: "172",
  //     bedrooms: "3/4",
  //     bathrooms: "2",
  //   },
  //   {
  //     id: 8,
  //     href: "",
  //     image: Img_product4,
  //     logo: Img_product_logo4,
  //     map: Img_product_map1,
  //     title: "Askøy med pulttak – Moderne hus tilpasset utleie",
  //     price: "5.860.000  NOK",
  //     area: "184",
  //     bedrooms: "4",
  //     bathrooms: "2",
  //   },
  // ];
  return (
    <>
      <h3 className="text-black text-2xl font-semibold mb-[36px]">
        Følgende husmodeller kan bygges på denne tomten
      </h3>
      {!HouseModelProperty || isLoading ? (
        <Loader />
      ) : (
        <>
          {HouseModelProperty && HouseModelProperty.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 desktop:grid-cols-4 gap-x-4 lg:gap-x-6 desktop:gap-x-8 gap-y-7 lg:gap-y-9 desktop:gap-y-12">
              {/* <Property
                propertyList={propertyList}
                LinkHref={"/husmodell/husmodell-details?product"}
              /> */}
              {HouseModelProperty.map((property: any, index: any) => {
                console.log(property);

                return (
                  <Link
                    key={index}
                    href={`/husmodell/husmodell-details?product=${property.id}`}
                    className="flex flex-col justify-between"
                  >
                    <div>
                      <div className="rounded-[12px] overflow-hidden h-[370px] mb-4">
                        <GoogleMapComponent
                          coordinates={
                            property?.lamdaDataFromApi?.coordinates
                              ?.convertedCoordinates
                          }
                        />
                      </div>
                      <h3 className="text-black text-lg font-medium mb-4">
                        {property?.getAddress?.adressetekst}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-secondary text-sm">
                        <span className="text-black font-semibold">
                          {property?.lamdaDataFromApi?.eiendomsInformasjon
                            ?.basisInformasjon?.areal_beregnet ? (
                            <>
                              {
                                property?.lamdaDataFromApi?.eiendomsInformasjon
                                  ?.basisInformasjon?.areal_beregnet
                              }{" "}
                              m<sup>2</sup>
                            </>
                          ) : (
                            "-"
                          )}
                        </span>
                      </div>
                      <div className="h-[12px] w-[1px] border-l border-gray"></div>
                      <div className="text-secondary text-sm">
                        Gnr:{" "}
                        <span className="text-black font-semibold">
                          {property?.getAddress?.gardsnummer}
                        </span>
                      </div>
                      <div className="h-[12px] w-[1px] border-l border-gray"></div>
                      <div className="text-secondary text-sm">
                        Bnr:{" "}
                        <span className="text-black font-semibold">
                          {property?.getAddress?.bruksnummer}
                        </span>
                      </div>
                      <div className="h-[12px] w-[1px] border-l border-gray"></div>
                      <div className="text-secondary text-sm">
                        Snr:{" "}
                        <span className="text-black font-semibold">
                          {property?.getAddress?.bokstav}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            "No Property Found"
          )}
        </>
      )}
    </>
  );
};

export default HouseModelAllProperty;
