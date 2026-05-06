/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // This ensures Tailwind scans your React files
  ],
  theme: {
    extend: {
      colors: {
        // You can add the custom blue from your image here if you want
        brandBlue: "#6a89b5",
      },
    },
  },
  plugins: [],
};
