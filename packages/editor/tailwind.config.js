/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../shared-renderer/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: "#e8f5f5",
          100: "#c8e6e6",
          200: "#9fd2d3",
          500: "#148A8E",
          600: "#0F7B7F",
          700: "#0a6b6e",
          900: "#063639",
        },
        navy: {
          50: "#e8eef5",
          900: "#0A2540",
        },
        ink: {
          DEFAULT: "#0B1518",
          900: "#0B1518",
          500: "#56696D",
          100: "#E4E9EA",
        },
        paper: "#FBFCFC",
        line: "#E4E9EA",
        muted: "#56696D",
        success: "#2B8A6B",
        warning: "#C97A1F",
        danger: "#B3342C",
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      borderRadius: {
        card: "1.25rem",
      },
    },
  },
  plugins: [],
};
