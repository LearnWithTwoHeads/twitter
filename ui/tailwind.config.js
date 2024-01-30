/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#191b1d",
        burgundy: "#ad304c",
        asphalt: "#23252b",
      },
    },
  },
  plugins: [require("daisyui")],
};
