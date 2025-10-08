import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f1316",
        parchment: "#e9e4da",
        brass: "#d4b07a",
        obsidian: "#14181c",
        pewter: "#3a464f"
      },
      fontFamily: {
        serif: [
          'var(--font-serif)',
          "Iowan Old Style",
          "Apple Garamond",
          "Palatino",
          "Times New Roman",
          "ui-serif",          "Georgia",
          "serif"
        ],
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      },
      backgroundImage: {
        "hero-radial": "radial-gradient(circle at 20% 20%, rgba(212,176,122,0.18), transparent 60%)",
        "hero-linear": "linear-gradient(135deg, rgba(15,19,22,0.95), rgba(20,24,28,0.8))"
      },
      boxShadow: {
        brass: "0 15px 45px rgba(212,176,122,0.15)"
      }
    }
  },
  plugins: []
};

export default config;