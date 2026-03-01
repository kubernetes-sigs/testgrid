// postcss.config.cjs
const { tailwindTransform } = require('postcss-lit');

module.exports = {
  syntax: 'postcss-lit',
  plugins: {
    '@tailwindcss/postcss': {},
    'postcss-discard-comments': {},
    'postcss-discard-empty': {}
  }
};
