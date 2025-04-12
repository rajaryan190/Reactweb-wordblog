module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',  // add this line to enable all files
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),  // enable typography plugin
  ],
}
