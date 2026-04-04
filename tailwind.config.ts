import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "media",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#fbfbfb",
        ink: "#111827",
        mist: "#e7e5df",
        emerald: "#0e9f6e",
        sage: "#dce9e1",
      },
      boxShadow: {
        float: "0 18px 50px -28px rgba(17, 24, 39, 0.28)",
        card: "0 12px 34px -22px rgba(17, 24, 39, 0.22)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      fontFamily: {
        sans: ["Avenir Next", "Avenir", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
