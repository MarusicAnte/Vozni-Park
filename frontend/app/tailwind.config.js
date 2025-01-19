/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      tablet: "760px",
      laptop: "1360px",
      phone: "350px",
      custom: "1000px",
    },
  },
  plugins: [],
};
