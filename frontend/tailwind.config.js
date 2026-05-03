/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#04070F',
        surface: 'rgba(15, 23, 42, 0.6)',
        primary: {
          DEFAULT: '#00D2FF',
          glow: 'rgba(0, 210, 255, 0.4)'
        },
        secondary: {
          DEFAULT: '#9D50BB',
          glow: 'rgba(157, 80, 187, 0.4)'
        },
        accent: '#00F260',
        text: '#F8FAFC',
        textMuted: '#94A3B8'
      },
      animation: {
        'fluid-move': 'fluid 10s ease-in-out infinite',
        'blob': 'blob 7s infinite',
        'glass-shine': 'shine 3s infinite',
      },
      keyframes: {
        fluid: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
