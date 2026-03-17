/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Libre Baskerville", "Georgia", "serif"],
      },
      colors: {
        ink: {
          900: "#0b1220",
          700: "#1f2a44",
          600: "#2d3a57",
          500: "#44506a",
          200: "#cfd6e4",
          100: "#e8ecf5",
        },
        brand: {
          100: "#d6e4ff",
          700: "#1f3c76",
          600: "#274a8f",
          500: "#2d56a3",
        },
        surface: {
          0: "#ffffff",
          50: "#f7f9fc",
          100: "#f1f4f9",
          200: "#e7edf6",
        },
      },
      boxShadow: {
        card: "0 10px 25px rgba(15, 23, 42, 0.08)",
        soft: "0 6px 18px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
