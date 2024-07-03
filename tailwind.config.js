/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-green': 'rgb(29, 185, 84)',
        'custom-dark': 'rgb(25, 20, 20)',
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(45deg, rgba(29, 185, 84, 1) 0%, rgba(25, 20, 20, 1) 100%)',
      },
    },
  },
  plugins: [],
}