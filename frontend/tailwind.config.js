/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // enables class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}" // scans all Vite source files
  ],
  theme: {
    extend: {
      colors: {
        // you can add custom dashboard colors here
      },
    },
  },
  plugins: [],
}
