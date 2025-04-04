import React from "react";
import { useAddress } from "@/context/addressContext";
import Ic_Step_icon from "@/public/images/Ic_Step_icon.svg";
import GoogleMapComponent from "../map";
import Image from "next/image";

const PropertyDetail: React.FC<any> = ({
  CadastreDataFromApi,
  lamdaDataFromApi,
}) => {
  const { getAddress } = useAddress();

  return (
    <>
      <div className="bg-lightPurple flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="rounded-[12px] overflow-hidden w-[132px] h-[100px]">
            <GoogleMapComponent
              coordinates={lamdaDataFromApi?.coordinates?.convertedCoordinates}
            />
          </div>
          <div>
            <h2 className="text-darkBlack text-2xl font-bold mb-2">
              {
                CadastreDataFromApi?.presentationAddressApi?.response?.item
                  ?.formatted?.line1
              }{" "}
              <span className="font-medium">
                (
                {
                  CadastreDataFromApi?.presentationAddressApi?.response?.item
                    ?.municipality?.municipalityName
                }
                )
              </span>
            </h2>
            <p className="text-secondary2 text-lg">
              {
                CadastreDataFromApi?.presentationAddressApi?.response?.item
                  ?.formatted?.line2
              }
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-4">
              <div className="text-secondary2 text-base">
                Gnr:{" "}
                <span className="text-black font-semibold">
                  {lamdaDataFromApi?.searchParameters?.gardsnummer}
                </span>
              </div>
              <div className="text-secondary2 text-base">
                Bnr:{" "}
                <span className="text-black font-semibold">
                  {lamdaDataFromApi?.searchParameters?.bruksnummer}
                </span>
              </div>
              <div className="text-secondary2 text-base">
                Snr:{" "}
                <span className="text-black font-semibold">
                  {getAddress?.bokstav}
                </span>
              </div>
              <div className="h-[12px] border-l border-[#5D6B98]"></div>
              <div className="text-secondary2 text-base">
                moh.{" "}
                <span className="text-black font-semibold">
                  {getAddress?.representasjonspunkt &&
                    getAddress?.representasjonspunkt.lat
                      .toFixed(2)
                      .toString()
                      .replace(".", ",")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-[50px] bg-[#EDFCF2] py-2 px-3 w-max">
            <Image src={Ic_Step_icon} alt="icon" />
            <div className="text-black text-base">
              <span className="font-bold">Tomten</span> er i samsvar med alle
              reguleringsbestemmelser.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetail;
