import React from "react";
import { Tab, Tabs } from "@mui/material";
import { a11yProps, HorizontalTabPanel } from "../tabNavPanel/horizontalTab";
import TomtTab from "./tomt";
import HusmodellTab from "./husmodell";

const HomePageSearchDiv = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="my-[48px]"
      >
        {/* Tabs Navigation */}
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="horizontal tabs"
          className="mb-6"
          sx={{
            "& .MuiTab-root": {
              fontWeight: 500,
              textTransform: "inherit",
              color: "#344054",
              fontSize: "18px",
              fontFamily: '"Inter", sans-serif',
            },
            "& .MuiTab-root.Mui-selected": {
              color: "#6941c6 !important",
            },
            "& .MuiTabs-indicator": {
              borderBottom: "4px solid #6941c6 !important",
            },
            "& .MuiTabs-flexContainer": {
              gap: "16px !important",
            },
          }}
        >
          <Tab
            label="Start med tomt"
            {...a11yProps(0)}
            className="py-4 px-3 text-[#344054] text-lg"
            // sx={{
            //   color: "#344054",
            // }}
          />
          <Tab
            label="Start med husmodell"
            {...a11yProps(1)}
            className="py-4 px-3 text-[#344054] text-lg"
          />
        </Tabs>

        {/* Tab Panels */}
        <HorizontalTabPanel value={value} index={0} className="tab-panel">
          <TomtTab />
        </HorizontalTabPanel>
        <HorizontalTabPanel value={value} index={1} className="tab-panel">
          <HusmodellTab />
        </HorizontalTabPanel>
      </div>
    </>
  );
};

export default HomePageSearchDiv;
