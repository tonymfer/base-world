const plugin = require('tailwindcss/plugin');

const paddedHorizontal = plugin(function ({ addUtilities }) {
  addUtilities({
    '.padded-horizontal': {
      'padding-left': 'calc((100% - 1280px) / 2)',
      'padding-right': 'calc((100% - 1280px) / 2)'
    },
    '.padded-horizontal-wide': {
      'padding-left': 'calc((100% - 1280px) / 2)',
      'padding-right': 'calc((100% - 1280px) / 2)'
    },
    '@media only screen and (max-width: 1440px)': {
      '.padded-horizontal': {
        'padding-left': '10px',
        'padding-right': '10px'
      },

      '.padded-horizontal-wide': {
        'padding-left': '80px',
        'padding-right': '80px'
      }
    },

    '@media only screen and (max-width: 768px)': {
      '.padded-horizontal-wide': {
        'padding-left': '20px',
        'padding-right': '20px'
      }
    }
  });
});

module.exports = paddedHorizontal;
