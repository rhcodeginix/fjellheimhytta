import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#53389E", "#7F56D9", "#D6BBFB"];

const EierinformasjonChart: React.FC<{ chartData: any }> = ({ chartData }) => {
  const data = chartData.map((item: any) => ({
    name: item.Navn,
    value: parseFloat(item.Eierandel),
  }));

  return (
    <>
      <div className="w-full h-[300px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={130}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_entry: any, index: any) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-grayText text-base mb-2">Eierandel</span>
          <span className="text-black font-semibold text-[26px]">100%</span>
        </div>
      </div>
      <div className="mt-[48px] mb-3">
        <div className="flex justify-between gap-4">
          {data.map((item: any, index: any) => (
            <div key={index} className="flex items-start gap-2">
              <div className="h-[26px] w-3 flex items-center">
                <div
                  className="w-full h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
              </div>
              <div>
                <div className="font-semibold text-[20px] h-[26px]">
                  {item.value}%
                </div>
                <span className="text-sm font-medium text-[#111322]">
                  {item.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EierinformasjonChart;
