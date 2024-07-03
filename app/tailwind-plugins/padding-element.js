const plugin = require("tailwindcss/plugin");

const paddingElement = plugin(function ({ addUtilities }) {
  addUtilities({
    ".padding-element": {
      "min-width": "calc(((100% - 1280px) / 2 ) + 324px)",
    },
  });
});

module.exports = paddingElement;
