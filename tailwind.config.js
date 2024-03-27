/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      'primary': '#0f172a',
      'primary-light': '#f8fafc',
      'primary-mid': '#94a3b8',
      'primary-mid-dark': '#1e293b',
      red: '#e74c4c',
      green: '#6bb05d',
      blue: '#0183ff',
      grey: '#dddfe2',
      white: '#fff',
      'dark-grey': '#bbbdbb'
    },
  },
  plugins: [],
}
