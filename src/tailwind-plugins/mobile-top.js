// plugins/mobile-top.js

const plugin = require('tailwindcss/plugin');

module.exports = plugin(({ addComponents }, { pageIndex, discordData }) => {
  const mobileTop = {
    '.mobile-top': {
      transition: 'all 0.5s ease-in-out',
      top: 'auto',
      '@media (min-width: 768px)': {
        top: `${(pageIndex + 1) * (50 / discordData.length)}%`,
      },
    },
  };

  addComponents(mobileTop);
});
