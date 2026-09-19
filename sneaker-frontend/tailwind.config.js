/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'supreme-red': '#E60000', // Rojo intenso streetwear
        'street-black': '#111111', // Negro casi absoluto
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'], // Tipografía limpia y moderna
        'mono': ['Space Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}