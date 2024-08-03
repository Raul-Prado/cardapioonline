/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily:{
      'sans': ['Montserrat', 'sans-serif']
    },
    extend:{
      backgroundImage:{
         "home": "url('..img/Banner-para-pedidos-de-lanches-moderno-laranja1.jpg')"
      }
    },
  },
  plugins: [],
}

