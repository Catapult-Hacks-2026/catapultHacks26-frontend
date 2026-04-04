import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#f8f4ec",
        ink: "#2f2f2f",
        mist: "#eee7db",
        charcoal: "#474747",
        smoke: "#8c857c",
      },
      boxShadow: {
        float: "0 24px 60px -34px rgba(47, 47, 47, 0.22)",
        card: "0 16px 42px -26px rgba(47, 47, 47, 0.18)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      fontFamily: {
        sans: ['"Libre Baskerville"', "Georgia", "serif"],
        serif: ['"Libre Baskerville"', "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
