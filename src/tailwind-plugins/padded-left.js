const plugin = require('tailwindcss/plugin');

const paddedLeft = plugin(function ({ addUtilities }) {
  addUtilities({
    '.padded-left': {
      'padding-left': 'calc((100% - 1280px) / 2 )',
    },
  });
});

module.exports = paddedLeft;
