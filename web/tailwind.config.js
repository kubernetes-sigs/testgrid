// tailwind.config.js
const { tailwindTransform } = require('postcss-lit');

module.exports = {
  content: {
    files: ['./src/**/*.{js,ts}', './index.html'],
    transform: {
      ts: tailwindTransform
    }
  }
};
