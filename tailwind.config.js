/** @type {import('tailwindcss').Config} */
module.exports = {
  // O Tailwind irá procurar por classes nestes arquivos para otimizar o CSS final.
  content: [
    "./index.html",
    "./scripts/main.js"
  ],
  theme: {
    extend: {
      // Aqui definimos sua cor personalizada para o tema claro.
      colors: {
        'primary-light': 'rgb(203, 221, 236)',
      },
    },
  },
  plugins: [],
}
