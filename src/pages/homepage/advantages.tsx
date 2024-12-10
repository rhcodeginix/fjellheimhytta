import React from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Ic_advantage1 from "@/public/images/Ic_advantage1.svg";
import Ic_advantage2 from "@/public/images/Ic_advantage2.svg";
import Ic_advantage3 from "@/public/images/Ic_advantage3.svg";
import Image from "next/image";

const advantages = [
  {
    id: 1,
    image: Ic_advantage1,
    title: "Rask og pålitelig analyse",
    description:
      "Vi utfører en kartlegging som gir deg en lynrask og presis tomteanalyse, så du sparer tid.",
  },
  {
    id: 2,
    image: Ic_advantage2,
    title: "Spar tid og penger",
    description:
      "Få oversikt over byggeklare tomter og muligheter uten unødvendige kostnader.",
  },
  {
    id: 3,
    image: Ic_advantage3,
    title: "Gunstig finansiering",
    description:
      "Få tilgang til skreddersydde finansierings-muligheter som gjør drømmehuset mer oppnåelig.",
  },
];

const Advantages = () => {
  return (
    <>
      <SideSpaceContainer className="pb-[120px]">
        <div className="text-center text-blue font-semibold text-base mb-[12px]">
          Fordeler
        </div>
        <h2 className="text-black font-semibold text-[48px] leading-[56px] mb-[20px] text-center tracking-[-1px]">
          Hva du kan forvente av MinTomt
        </h2>
        <p className="text-center text-secondary text-lg leading-[30px] mb-[60px]">
          Bygg drømmehuset uten bekymringer – med MinTomt får du rask, trygg og{" "}
          <br />
          komplett tomteanalyse på et øyeblikk!
        </p>
        <div className="flex items-center gap-8 px-8 justify-evenly">
          {advantages.map(({ id, image, title, description }) => (
            <div
              key={id}
              className="w-[33%] flex flex-col items-center justify-center"
            >
              <Image src={image} alt={title} />
              <h4 className="text-black text-xl font-medium text-center mt-[20px] mb-2">
                {title}
              </h4>
              <p className="text-secondary text-base text-center">
                {description}
              </p>
            </div>
          ))}
        </div>
      </SideSpaceContainer>
    </>
  );
};

export default Advantages;
