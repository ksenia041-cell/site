/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'ice-white': '#F2FBFC',
        'frost': '#DDF7F8',
        'pale-aqua': '#BDEEF1',
        'icy-cyan': '#8FE4EC',
        'aqua': '#54D7E6',
        'turquoise': '#29C4D8',
        'teal': '#169FB8',
        'mid-teal': '#148AA6',
        'deep-teal': '#0B5E7A',
        'ocean': '#0A4D68',
        'abyss': '#07374E',
        'ink': '#06273B',
        'void': '#031827',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
