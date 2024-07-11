/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ['./src/apps/pillarx-app/**/**/*.{js,ts,jsx,tsx,html,mdx}', './src/apps/pillarx-app/**/*.{js,ts,jsx,tsx,html,mdx}'],
  darkMode: 'class',
  theme: {
    screens: { desktop: { min: '1024px' }, tablet: { max: '1024px' }, mobile: { max: '800px' } },
    extend: {
      colors: {
        deep_purple: { A700: '#5e00ff' },
        container_grey: '#27262F',
        purple_light: '#E2DDFF',
        percentage_green: '#05FFDD',
        percentage_red: '#FF366C',
      },
      fontFamily: {
        'custom': ['Formular'],
      },
    },
  },
  plugins: [],
};
