import type { Config } from "tailwindcss";

/** Tailwind (igual que el repo unicales) para poder adaptar componentes de 21st.dev. Tokens de marca de unical-ui. */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#1A1A2E",
        night: "#11111f",
        ink: "#16161F",
        charcoal: "#3A3A39",
        brand: { DEFAULT: "#99C4E4", strong: "#2E6CA0", deep: "#1E5076", tint: "#EAF2F9" },
        line: "#E4E9F0",
        soft: "#F6F8FB",
        paper: "#F3F1EC",
      },
      fontFamily: {
        head: ["Poppins", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
