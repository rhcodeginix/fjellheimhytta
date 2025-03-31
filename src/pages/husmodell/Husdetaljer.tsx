import Img_product_3d_img1 from "@/public/images/Img_product_3d_img1.png";
import Ic_close from "@/public/images/Ic_close.svg";
import React, { useEffect, useRef, useState } from "react";
import { formatCurrency } from "@/components/Ui/RegulationHusmodell/propertyDetailPage";
import Image from "next/image";
import Modal from "@/components/common/modal";

const Husdetaljer: React.FC<{ husmodellData: any }> = ({ husmodellData }) => {
  const getEmbedUrl = (url: string) => {
    const videoId = url?.split("v=")[1]?.split("&")[0];
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=0&disablekb=1&fs=0`
      : "";
  };
  const textareaRef = useRef<any>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [husmodellData?.OmHusmodellen]);

  const [isOpen, setIsOpen] = useState(false);

  const images = husmodellData?.photo3D || [];
  const displayedImages = images.slice(0, 4);
  const extraImagesCount = images.length - 4;

  const handlePopup = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };
  return (
    <>
      <div className="flex gap-6 h-[433px] mb-[74px]">
        <div className="w-full h-full">
          <h4 className="mb-4 text-black text-lg font-semibold">
            Illustrasjoner
          </h4>
          <div className="gap-6 flex h-[calc(100%-40px)]">
            <div className="w-1/2">
              <Image
                src={Img_product_3d_img1}
                alt="product"
                className="w-full h-full"
              />
            </div>
            <div className="w-1/2 grid grid-cols-2 gap-6">
              {displayedImages.map((image: any, index: number) => (
                <div key={index} className="relative overflow-hidden h-full">
                  <img
                    src={image}
                    alt="product"
                    className="w-full h-full object-fill rounded-lg"
                  />

                  {index === 3 && extraImagesCount > 0 && (
                    <div
                      className="absolute inset-0 bg-black bg-opacity-35 flex items-center justify-center text-white text-base font-bold cursor-pointer rounded-lg"
                      onClick={() => setIsOpen(true)}
                    >
                      +{extraImagesCount}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex gap-[60px] mt-8">
        <div className="w-[43%]">
          <h4 className="text-black mb-6 font-semibold text-2xl">
            {husmodellData?.husmodell_name}
          </h4>
          <div className="relative">
            <img
              src={husmodellData?.photo}
              alt="product-1"
              className="w-full h-[262px] object-cover rounded-[12px] overflow-hidden"
            />
          </div>
          <div className="my-[20px] flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-secondary text-base">Pris fra</p>
              <h4 className="text-xl font-semibold text-black">
                {formatCurrency(husmodellData?.pris)}
              </h4>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-secondary text-sm">
                <span className="text-black font-semibold">
                  {husmodellData?.BRATotal}
                </span>{" "}
                m<sup>2</sup>
              </div>
              <div className="h-[12px] w-[1px] border-l border-gray"></div>
              <div className="text-secondary text-sm">
                <span className="text-black font-semibold">
                  {husmodellData?.Soverom}
                </span>{" "}
                soverom
              </div>
              <div className="h-[12px] w-[1px] border-l border-gray"></div>
              <div className="text-secondary text-sm">
                <span className="text-black font-semibold">
                  {husmodellData?.Bad}
                </span>{" "}
                bad
              </div>
            </div>
          </div>
          <div className="w-full flex gap-8 mb-[60px]">
            <div className="w-1/2 border-t-2 border-b-0 border-l-0 border-r-0 border-purple pt-4">
              <table className="table-auto border-0 w-full text-left property_detail_tbl">
                <tbody>
                  <tr>
                    <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                      BRA total
                    </td>
                    <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                      {husmodellData?.BRATotal} m<sup>2</sup>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                      BRA bolig
                    </td>
                    <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                      {husmodellData?.BebygdAreal} m<sup>2</sup>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                      P-rom:
                    </td>
                    <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                      {husmodellData?.PRom} m<sup>2</sup>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                      Bebygd Areal
                    </td>
                    <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                      {husmodellData?.BebygdAreal} m<sup>2</sup>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                      L x B:
                    </td>
                    <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                      {husmodellData?.LB}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                      Soverom
                    </td>
                    <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                      {husmodellData?.Soverom}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="w-1/2 border-t-2 border-b-0 border-l-0 border-r-0 border-purple pt-4">
              <table className="table-auto border-0 w-full text-left property_detail_tbl">
                <tbody>
                  <tr>
                    <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                      Bad
                    </td>
                    <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                      {husmodellData?.Bad}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                      Innvendig bod
                    </td>
                    <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                      {husmodellData?.InnvendigBod}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                      Energimerking
                    </td>
                    <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                      {husmodellData?.Energimerking}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                      Tilgjengelig bolig
                    </td>
                    <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                      {husmodellData?.TilgjengeligBolig}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                      Tomtetype
                    </td>
                    <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                      {husmodellData?.Tomtetype}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <h2 className="mb-6 text-black text-2xl font-semibold">
            Plantegninger og fasader
          </h2>
          <img
            src={husmodellData?.PlantegningerFasader[0]}
            alt="map"
            className="w-full"
          />
        </div>
        <div className="w-[57%]">
          <h2 className="text-black text-2xl font-semibold mb-4 truncate">
            {husmodellData?.Hustittel}
          </h2>
          <div className="flex flex-col gap-4 mb-[60px]">
            <textarea
              value={husmodellData?.OmHusmodellen}
              className="text-base text-secondary h-full focus-within:outline-none resize-none"
              ref={textareaRef}
              readOnly
            ></textarea>
          </div>
          <h2 className="text-black text-2xl font-semibold mb-4">
            {husmodellData?.TittelVideo}
          </h2>

          <div
            style={{
              width: "100%",
              height: "400px",
            }}
          >
            <iframe
              width="100%"
              height="100%"
              src={getEmbedUrl(husmodellData?.VideoLink)}
              frameBorder="0"
              allowFullScreen
              title={husmodellData?.TittelVideo}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>
        </div>
      </div>

      {isOpen && (
        <Modal isOpen={true} onClose={handlePopup}>
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full relative">
            <button
              className="absolute top-3 right-3"
              onClick={() => setIsOpen(false)}
            >
              <Image src={Ic_close} alt="close" />
            </button>

            <div className="grid grid-cols-3 gap-2 my-4">
              {images.map((image: any, index: number) => (
                <img
                  key={index}
                  src={image}
                  alt="product"
                  className="w-full h-[200px]"
                />
              ))}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Husdetaljer;
