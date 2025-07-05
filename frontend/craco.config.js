/** @type {import('@craco/craco').CracoConfig} */
module.exports = {
  style: {
    postcss: {
      plugins: [
        require('postcss-nesting'),
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
};
