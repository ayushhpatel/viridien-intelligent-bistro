/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bistro: {
          dark: '#1A1A1A',
          accent: '#2563eb', // Blue-600
          purple: '#9333ea', // Purple-600 for AI
          surface: '#FFFFFF',
          background: '#F9FAFB', // Gray-50
          border: '#E5E7EB', // Gray-200
        }
      }
    },
  },
  plugins: [],
}
