/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0F0A0A',
        'background-lighter': '#1A1A1A',
        primary: '#a10035',
        'primary-light': '#ff003c',
        secondary: '#2E2E2E',
        accent: '#ff003c',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'grid-glow': 'grid-glow 8s infinite',
      },
      keyframes: {
        'grid-glow': {
          '0%, 100%': { opacity: 0.1 },
          '50%': { opacity: 0.2 },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 5px rgba(255, 0, 60, 0.5)',
        'glow-md': '0 0 10px rgba(255, 0, 60, 0.5)',
        'glow-lg': '0 0 15px rgba(255, 0, 60, 0.7)',
      },
    },
  },
  plugins: [],
};