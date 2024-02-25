/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        '112': '28rem', // 448px
        '128': '32rem', // 512px
        '144': '36rem', // 576px
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

