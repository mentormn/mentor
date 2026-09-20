import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#1E3A8A", // Deep Institutional Navy
          50: "#EFF6FF",
          100: "#DBEAFE",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        civic: {
          green: "#059669", // Accreditation Emerald
          gold: "#D97706",  // Ministry Gold
          slate: "#334155",
        },
        tier: {
          junior: "#3B82F6",    // Blue
          senior: "#10B981",    // Emerald
          master: "#8B5CF6",    // Purple
          laureate: "#F59E0B",  // Gold/Amber
        }
      },
    },
  },
  plugins: [],
};
export default config;
