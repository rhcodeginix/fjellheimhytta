"use client";
import SideSpaceContainer from "@/components/common/sideSpace";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";

const Personvaern = () => {
  return (
    <div>
      <div className="bg-lightBlue py-2 md:py-4">
        <SideSpaceContainer>
          <div className="flex items-center flex-wrap gap-1 mb-4 md:mb-6">
            <Link
              href={"/"}
              className="text-primary text-xs md:text-sm font-medium"
            >
              Hjem
            </Link>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <span className="text-secondary2 text-xs md:text-sm">
              Personvernerklæring
            </span>
          </div>
          <h3 className="text-black font-semibold text-lg md:text-2xl desktop:text-[30px]">
            Personvernerklæring
          </h3>
        </SideSpaceContainer>
      </div>
      <div className="pt-8 pb-32">
        <SideSpaceContainer>
          <div className="flex flex-col gap-4 md:gap-6 text-secondary text-sm md:text-base desktop:text-lg">
            <p>
              Denne personvernerklæringen forklarer hvordan MinTomt samler inn og behandler dine personopplysninger. Vi tar personvern på alvor og sørger for at dine data behandles i samsvar med gjeldende personvernlovgivning.
            </p>
            <div>
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                1. Hvem er behandlingsansvarlig?
              </h4>
              <p>
                MinTomt er behandlingsansvarlig for dine personopplysninger.
              </p>
            </div>
            <div>
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                2. Hvilke opplysninger samler vi inn?
              </h4>
              <p>
                Vi samler inn følgende informasjon:
              </p>
              <ul className="list-disc pl-4">
                <li>Navn</li>
                <li>Adresse</li>
                <li>Telefonnummer</li>
                <li>E-postadresse</li>
                <li>Eiendomsinformasjon</li>
              </ul>
            </div>
            <div>
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                3. Hvordan bruker vi opplysningene dine?
              </h4>
              <p>
                Vi bruker personopplysningene dine til å levere tjenestene våre, gi deg kundeservice, forbedre våre tjenester, samt for administrative og juridiske formål.
              </p>
            </div>
            <div>
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                4. Hvem deler vi opplysningene med?
              </h4>
              <p>
                Vi deler bare personopplysninger med tredjeparter når det er nødvendig for å tilby våre tjenester, eller når vi er lovpålagt å gjøre det.
              </p>
            </div>
            <div>
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                5. Hvor lenge lagres opplysningene?
              </h4>
              <p>
                Vi lagrer dine personopplysninger så lenge det er nødvendig for formålet med behandlingen eller i henhold til lovpålagte krav.
              </p>
            </div>
            <div>
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                6. Dine rettigheter
              </h4>
              <p>
                Du har rett til innsyn, retting og sletting av dine personopplysninger. Du kan også protestere mot behandlingen og be om dataportabilitet.
              </p>
            </div>
            <div>
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                7. Kontakt oss
              </h4>
              <p>
                Har du spørsmål om personvernerklæringen eller ønsker å utøve dine rettigheter? Kontakt oss på:
                <br /> 📧 kontakt@mintomt.no
              </p>
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </div>
  );
};

export default Personvaern;
