const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {    colors: {
      nuetral: "#EFEDEB"
    },
  },
  },
  plugins: [],
  darkMode: 'class',
}
