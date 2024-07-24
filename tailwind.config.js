/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily:{
      'sans': ['Montserrat', 'sans-serif']
    },
    extend:{
      backgroundImage:{
        "home": "url('/img/bg.png')"
      }
    },
  },
  plugins: [],
}

