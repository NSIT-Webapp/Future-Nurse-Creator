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
        sans: ['"LINE Seed Sans TH"', '"Noto Sans Thai"', 'Inter', 'sans-serif'],
        heading: ['"LINE Seed Sans TH"', '"Noto Sans Thai"', 'Inter', 'sans-serif']
      },
      fontSize: {
        "display": ["3.25rem", { lineHeight: "1.12" }],
        "hero": ["2.5rem", { lineHeight: "1.15" }],
        "page-title": ["2.125rem", { lineHeight: "1.25" }],
        "question": ["2rem", { lineHeight: "1.4" }],
        "answer": ["1.375rem", { lineHeight: "1.5" }],
        "body-lg": ["1.25rem", { lineHeight: "1.5" }],
        "body": ["1.125rem", { lineHeight: "1.5" }],
        "label": ["0.9375rem", { lineHeight: "1.3" }],
      },
      fontWeight: {
        regular: "400",
        semibold: "600",
        bold: "700",
        extrabold: "800",
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
