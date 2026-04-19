/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0f1a1a", soft: "#2a3a38" },
        muted: "#6b7a78",
        line: "#e4ddd0",
        paper: { DEFAULT: "#faf7f0", 2: "#f5efe2" },
        cream: "#f2ead7",
        teal: {
          DEFAULT: "#0d8b7e",
          deep: "#0a6b61",
          ink: "#053f39",
          wash: "#e6f2f0",
        },
        redBrand: "#c73e3a",
      },
      fontFamily: {
        sans: ["Outfit", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        eyebrow: ["0.72rem", { letterSpacing: "0.18em", lineHeight: "1.2" }],
        "h1-fluid": [
          "clamp(2.1rem, 6vw, 4.4rem)",
          { lineHeight: "1.05", letterSpacing: "-0.025em" },
        ],
        "h2-fluid": [
          "clamp(1.8rem, 4vw, 2.8rem)",
          { lineHeight: "1.15", letterSpacing: "-0.015em" },
        ],
        "h3-fluid": [
          "clamp(1.25rem, 2.4vw, 1.6rem)",
          { lineHeight: "1.25", letterSpacing: "-0.01em" },
        ],
        "display-stat": [
          "clamp(2rem, 4.5vw, 3rem)",
          { lineHeight: "1", letterSpacing: "-0.02em" },
        ],
      },
      boxShadow: {
        sm: "0 1px 2px rgba(15,26,26,.06), 0 2px 6px rgba(15,26,26,.04)",
        md: "0 4px 14px rgba(15,26,26,.08), 0 10px 30px rgba(15,26,26,.06)",
        lg: "0 10px 40px rgba(15,26,26,.12)",
        book:
          "0 30px 60px -20px rgba(15,26,26,.35), 0 18px 36px -18px rgba(15,26,26,.2)",
      },
      borderRadius: {
        card: "1.25rem",
        unit: "1.375rem",
      },
      keyframes: {
        "pulse-whats": {
          "0%,100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.08)", opacity: "0.9" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-whats": "pulse-whats 2.5s ease-in-out infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(.22,1,.36,1) both",
      },
      maxWidth: {
        prose: "72ch",
        page: "1200px",
      },
    },
  },
  plugins: [],
};
