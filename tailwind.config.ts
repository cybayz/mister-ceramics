import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#08090B",
          darker: "#040506",
          card: "#0F1115",
          cardElevated: "#161920",
          border: "#232733",
          borderSubtle: "#1C202B",
          gold: "#D4AF37",
          goldLight: "#F5E6B3",
          goldMuted: "#AA8C2C",
          goldDark: "#7A631B",
          silver: "#E2E8F0",
          silverMuted: "#94A3B8",
          charcoal: "#1F232B",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gold-shimmer": "linear-gradient(135deg, #F5E6B3 0%, #D4AF37 50%, #99781E 100%)",
        "dark-sheen": "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)",
      },
      boxShadow: {
        gold: "0 0 25px -5px rgba(212, 175, 55, 0.25)",
        goldGlow: "0 0 40px -10px rgba(212, 175, 55, 0.35)",
        darkCard: "0 10px 30px -10px rgba(0, 0, 0, 0.7)",
      },
    },
  },
  plugins: [],
};
export default config;

