import React from "react";
import EierinformasjonChart from "./chart";

const EierinformasjonData: any = [
  {
    id: "8815663",
    code: "M",
    Navn: "Anonymisert",
    Kjønn: "Mann",
    Alder: "41",
    Eierandel: "40",
    Boligkredittselskap: "Nei",
    Livsforsikringsselskap: "Nei",
  },
  {
    id: "8815667",
    code: "F",
    Navn: "Anonymisert",
    Kjønn: "Female",
    Alder: "39",
    Eierandel: "40",
    Boligkredittselskap: "Nei",
    Livsforsikringsselskap: "Nei",
  },
  {
    id: "8815678",
    code: "F",
    Navn: "Anonymisert",
    Kjønn: "Mann",
    Alder: "32",
    Eierandel: "20",
    Boligkredittselskap: "Nei",
    Livsforsikringsselskap: "Nei",
  },
];

const Eierinformasjon: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="flex gap-6">
      <div
        className="w-1/3 p-5 rounded-lg h-max"
        style={{
          boxShadow: "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
        }}
      >
        <h5 className="text-black text-lg font-semibold mb-8">Eierskap</h5>
        <EierinformasjonChart chartData={EierinformasjonData} />
      </div>
      <div className="w-2/3">
        <div className="grid grid-cols-2 gap-6">
          {data &&
            data?.map((item: any, index: number) => {
              return (
                <div
                  className="p-5 rounded-lg flex flex-col gap-4"
                  style={{
                    boxShadow:
                      "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
                  }}
                  key={index}
                >
                  <div>
                    <h5 className="text-black text-lg font-semibold mb-2">
                      ID: {item?.ident?.id}
                    </h5>
                    <h6 className="text-black text-sm font-medium">
                      FØDSELSNUMMER (Code: {item?.personalNumberType?.code})
                    </h6>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-grayText text-xs mb-1">Navn</p>
                      <h6 className="text-black text-sm font-medium">
                        {item?.name}
                      </h6>
                    </div>
                    <div>
                      <p className="text-grayText text-xs mb-1">Kjønn</p>
                      <h6 className="text-black text-sm font-medium">
                        {item?.sex}
                      </h6>
                    </div>
                    <div>
                      <p className="text-grayText text-xs mb-1">Alder</p>
                      <h6 className="text-black text-sm font-medium">
                        {item?.age}
                      </h6>
                    </div>
                    <div>
                      <p className="text-grayText text-xs mb-1">Eierandel</p>
                      <h6 className="text-black text-sm font-medium">
                        {item?.Eierandel} 40%
                      </h6>
                    </div>
                  </div>
                  <div className="w-full border-t border-[#EFF1F5]"></div>
                  <div>
                    <h6 className="text-black text-sm font-medium mb-1">
                      Type eierskap
                    </h6>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex gap-1 items-center">
                        <p className="text-grayText text-xs">
                          Boligkredittselskap
                        </p>
                        <h6 className="text-black text-sm font-medium">
                          {item?.isCoveredBondsInstitution === false
                            ? "Nei"
                            : "Ja"}
                        </h6>
                      </div>
                      <div className="flex gap-1 items-center">
                        <p className="text-grayText text-xs">
                          Livsforsikringsselskap
                        </p>
                        <h6 className="text-black text-sm font-medium">
                          {item?.isLifeInsuranceInstitution === false
                            ? "Nei"
                            : "Ja"}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Eierinformasjon;
