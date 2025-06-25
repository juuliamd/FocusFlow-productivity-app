const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: 'class',
  content: [
    './src/renderer/**/*.html',
    './src/renderer/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      borderWidth: {
        thick: '2px',
      },
      colors:{
        primary:{
          d0: '#8aa884',
          d1: '#97b191',
          
          base_light: '#000000',
          base_dark: '#121212',
         

        }
      }
    },
  },
  plugins: [
    
  ],
};
