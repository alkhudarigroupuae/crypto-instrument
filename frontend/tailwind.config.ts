import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#d4af37",
          600: "#b8860b",
          700: "#92400e",
          800: "#78350f",
          900: "#451a03",
        },
        ink: "#0a0a0b",
      },
      fontFamily: {
        sans: ["var(--font-dm)", "system-ui", "sans-serif"],
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-gold":
          "linear-gradient(to right, rgba(212,175,55,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,175,55,0.07) 1px, transparent 1px)",
      },
      boxShadow: {
        glow: "0 0 80px -20px rgba(212, 175, 55, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
