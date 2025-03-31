import React, { useEffect, useRef, useState } from "react";
import Img_product_3d_img1 from "@/public/images/Img_product_3d_img1.png";
import Image from "next/image";
import Ic_close from "@/public/images/Ic_close.svg";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import Ic_chevron_up from "@/public/images/Ic_chevron_up.svg";
import Ic_chevron_down from "@/public/images/Ic_chevron_down.svg";
import Modal from "@/components/common/modal";
import Loader from "@/components/Loader";
import { useRouter } from "next/router";

export function formatCurrency(nokValue: any) {
  let number = nokValue?.replace(/\s/g, "");
  return new Intl.NumberFormat("de-DE").format(Number(number)) + " NOK";
}

const Illustrasjoner: React.FC = () => {
  const [finalData, setFinalData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const textareaRef = useRef<any>(null);
  const husmodellData = finalData?.Husdetaljer;
  const router = useRouter();
  const id = router.query["husodellId"];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [husmodellData?.OmHusmodellen]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const husmodellDocRef = doc(db, "house_model", String(id));
        const husmodellDocSnap = await getDoc(husmodellDocRef);

        if (husmodellDocSnap.exists()) {
          setFinalData(husmodellDocSnap.data());
        } else {
          console.error("No document found for plot or husmodell ID.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const [isOpen, setIsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  const images = finalData?.Husdetaljer?.photo3D || [];

  const displayedImages = images.slice(0, 4);
  const extraImagesCount = images.length - 4;

  const handlePopup = () => {
    if (isPopupOpen) {
      setIsPopupOpen(false);
    } else {
      setIsPopupOpen(true);
    }
  };
  return (
    <div className="relative">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div style={{ borderBottom: "1px solid #B9C0D4" }}>
            <button
              className={`bg-white flex justify-between items-center w-full pb-6 duration-1000 ${isOpen ? "active" : ""}`}
              onClick={toggleAccordion}
            >
              <span className="text-black text-lg font-semibold">
                Illustrasjoner
              </span>
              {isOpen ? (
                <Image src={Ic_chevron_up} alt="arrow" fetchPriority="auto" />
              ) : (
                <Image src={Ic_chevron_down} alt="arrow" fetchPriority="auto" />
              )}
            </button>
            <div
              className={`overflow-hidden max-h-0 ${isOpen ? "pb-6" : ""}`}
              style={{
                maxHeight: isOpen ? "max-content" : "0",
                transition: "max-height 0.2s ease-out",
              }}
            >
              <div className="gap-6 flex h-[400px]">
                <div className="w-1/2">
                  <Image
                    src={Img_product_3d_img1}
                    alt="product"
                    className="w-full h-full"
                  />
                </div>
                <div className="w-1/2 grid grid-cols-2 gap-6">
                  {displayedImages.map((image: any, index: number) => (
                    <div
                      key={index}
                      className="relative overflow-hidden h-full"
                    >
                      <img
                        src={image}
                        alt="product"
                        className="w-full h-full object-fill rounded-lg"
                      />

                      {index === 3 && extraImagesCount > 0 && (
                        <div
                          className="absolute inset-0 bg-black bg-opacity-35 flex items-center justify-center text-white text-base font-bold cursor-pointer rounded-lg"
                          onClick={handlePopup}
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
        </>
      )}
      {isPopupOpen && (
        <Modal isOpen={true} onClose={handlePopup}>
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full relative">
            <button
              className="absolute top-3 right-3"
              onClick={() => handlePopup()}
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
    </div>
  );
};

export default Illustrasjoner;
