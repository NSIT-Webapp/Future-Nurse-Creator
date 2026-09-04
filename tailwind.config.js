/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mahidol: {
          blue: '#002B7F',
          dark: '#001A4E',
          deep: '#071126',
          gold: '#F5A623',
          accent: '#00A3FF',
          teal: '#0D9488',
          lightBlue: '#E6F0FA'
        }
      },
      fontFamily: {
        sans: ['Prompt', 'Sarabun', 'sans-serif'],
        heading: ['Prompt', 'sans-serif']
      },
      aspectRatio: {
        'card': '9 / 16'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(0, 163, 255, 0.4)' },
          '100%': { boxShadow: '0 0 30px rgba(245, 166, 35, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
