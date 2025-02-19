/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        orange: {
          500: "#F97316", // 오렌지 색상 코드
        },
      },
    },
  },
  plugins: [],
};
