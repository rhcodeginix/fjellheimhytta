import React from "react";
import Image from "next/image";
import Link from "next/link";

const Property: React.FC<any> = ({ propertyList, LinkHref }) => {
  return (
    <>
      {propertyList.map((property: any, index: any) => (
        <Link
          key={index}
          href={`${LinkHref}=${property.id}`}
          className="flex flex-col justify-between"
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
              <span className="text-black font-semibold">{property.area}</span>{" "}
              m2
            </div>
            <div className="h-[12px] w-[1px] border-l border-gray"></div>
            <div className="text-secondary text-sm">
              <span className="text-black font-semibold">
                {property.bedrooms}
              </span>{" "}
              soverom
            </div>
            <div className="h-[12px] w-[1px] border-l border-gray"></div>
            <div className="text-secondary text-sm">
              <span className="text-black font-semibold">
                {property.bathrooms}
              </span>{" "}
              bad
            </div>
          </div>
        </Link>
      ))}
    </>
  );
};

export default Property;
