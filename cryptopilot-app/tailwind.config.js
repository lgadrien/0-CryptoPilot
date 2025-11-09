/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Active le mode dark avec une classe
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F5D76E',
        },
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      backgroundSize: {
        '0': '0% 100%',
        'full': '100% 100%',
      },
      keyframes: {
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.8)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-15px) translateX(10px)' },
          '50%': { transform: 'translateY(-25px) translateX(-10px)' },
          '75%': { transform: 'translateY(-15px) translateX(10px)' }
        },
        'glow': {
          '0%, 100%': { 
            boxShadow: '0 0 10px rgba(212, 175, 55, 0.6), 0 0 20px rgba(212, 175, 55, 0.4)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.8), 0 0 40px rgba(212, 175, 55, 0.6)',
            transform: 'scale(1.2)'
          }
        },
        'drift-1': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' }
        },
        'drift-2': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        'drift-3': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        'drift-4': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-18px)' }
        },
        'drift-5': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      animation: {
        'slide-down': 'slide-down 0.2s ease-out',
        'gradient': 'gradient 3s ease infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'drift-1': 'drift-1 8s ease-in-out infinite',
        'drift-2': 'drift-2 10s ease-in-out infinite',
        'drift-3': 'drift-3 7s ease-in-out infinite',
        'drift-4': 'drift-4 9s ease-in-out infinite',
        'drift-5': 'drift-5 11s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}
