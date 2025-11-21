/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,css}'],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#e0e7ff',
          500: '#667eea',
          700: '#5a67d8',
        },
        danger: {
          100: '#fee2e2',
          500: '#f56565',
          700: '#c53030',
        },
        success: {
          100: '#ecfdf5',
          500: '#48bb78',
          700: '#2f855a',
        },
      },
    },
  },
  plugins: [],
};
