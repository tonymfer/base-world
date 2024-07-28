const plugin = require('tailwindcss/plugin');

const scrollbarHide = plugin(function ({ addUtilities }) {
  addUtilities({
    '.scrollbar-hide': {
      'scrollbar-width': 'none',
      '-ms-overflow-style': 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  });
});

module.exports = scrollbarHide;
