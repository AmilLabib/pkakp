import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./app/components/**/*.{ts,tsx,js,jsx}",
    "./pages/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)"],
        geist: ["var(--font-geist-sans)"],
        montaser: ["Montaser", "var(--font-poppins)"],
      },
      colors: {
        pkayellow: "#F4C42E",
        pkateal: "#3B8E82",
      },
    },
  },
  plugins: [],
};

export default config;
