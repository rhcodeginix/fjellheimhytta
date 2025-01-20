import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      primary: "#7F56D9",
      secondary: "#667085",
      black: "#101828",
      white: "#fff",
      lightGreen: "#F9FAFB",
      navyBlue: "#1D2939",
      purple: "#53389E",
      blue: "#6941C6",
      blue2: "#3538CD",
      lightPurple: "#F9F5FF",
      lightBlue: "#EEF4FF",
      lightPink: "#FDF2FA",
      pink: "#C11574",
      lightGreen2: "#F0F9FF",
      lightGreen3: "#ECFDF3",
      green: "#026AA2",
      green2: "#027A48",
      red: "red",
      gray2: "#D0D5DD",
      gray3: "#F9F9FB",
      darkGreen: "#125D56",
    },
    borderColor: {
      transparent: "transparent",
      purple: "#53389E",
      lightPurple: "#F9F5FF",
      primary: "#7F56D9",
      red: "red",
      gray: "#EAECF0",
      darkGray: "#B9C0D4",
      gray2: "#D0D5DD",
    },
    boxShadow: {
      shadow1: "0px 4px 16px 0px #0000001A",
      shadow2: "0px -1px 4px 0px #00000026 inset",
      shadow3: "0px 4px 9px 0px #2A343E21",
    },
    backgroundImage: {
      "gradientPink-box":
        "linear-gradient(358.27deg, #FFFAFA 1.38%, #FFFFFF 96.02%)",
    },
    screens: {
      sm: "576px",
      // => @media (min-width: 576px) { ... }
      md: "768px",
      // => @media (min-width: 768px) { ... }
      lg: "992px",
      // => @media (min-width: 992px) { ... }
      laptop: "1024px",
      // => @media (min-width: 1024px) { ... }
      desktop: "1280px",
      // => @media (min-width: 1280px) { ... }
      big: "1440px",
      // => @media (min-width: 1440px) { ... }
      xBig: "1920px",
      // => @media (min-width: 1920px) { ... }
    },
    zIndex: {
      100: "100",
    },
  },
  plugins: [],
};
export default config;
