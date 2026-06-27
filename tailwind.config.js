/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        ocean: "#2563EB",
        field: "#16A34A",
        mist: "#f5f8fb",
      },
      boxShadow: {
        premium: "0 24px 80px rgba(6, 35, 63, 0.16)",
        soft: "0 16px 48px rgba(6, 35, 63, 0.10)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
