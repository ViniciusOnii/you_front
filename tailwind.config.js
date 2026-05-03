/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        youvisa: {
          green: '#00A884',
          'green-light': '#00C299',
          dark: '#1A1A1A',
          gray: '#1F2937',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'wave': {
          '0%, 60%, 100%': { transform: 'rotate(0deg)' },
          '10%, 30%': { transform: 'rotate(14deg)' },
          '20%': { transform: 'rotate(-8deg)' },
          '40%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(10deg)' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out both',
        'wave': 'wave 2.5s ease-in-out infinite',
        'bounce-slow': 'bounce-slow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
