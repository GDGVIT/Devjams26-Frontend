import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#FFFFFF",
        primary: {
          DEFAULT: "#FFFFFF",
          foreground: "#000000",
        },
        border: "#B9B9B9",
        footer: {
          border: "#EFEFEF26",
        },
        dots: "#EFEFEF26",
      },
      borderColor: {
        DEFAULT: "#B9B9B9",
        footer: "#EFEFEF26",
      },
      fontFamily: {
        sans: ["var(--font-google-sans)", "sans-serif"],
        "google-sans": ["var(--font-google-sans)", "sans-serif"],
        "google-sans-flex": ["var(--font-google-sans-flex)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
