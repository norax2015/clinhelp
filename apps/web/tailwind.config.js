const path = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    path.join(__dirname, './src/pages/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, './src/components/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, './src/app/**/*.{js,ts,jsx,tsx,mdx}'),
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#EEF1F8',
          100: '#D5DCF0',
          200: '#ABBAE1',
          300: '#8197D2',
          400: '#5775C3',
          500: '#2D52B4',
          600: '#1A3A8F',
          700: '#0F2264',
          800: '#0A1745',
          900: '#0F1F3D',
          950: '#070E1E',
        },
        teal: {
          50: '#F0FBFF',
          100: '#E0F7FE',
          200: '#B9EFFE',
          300: '#7CE3FC',
          400: '#36D1F8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        cyan: {
          500: '#06B6D4',
          600: '#0891B2',
        },
        surface: '#F8FAFC',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.05)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.10), 0 2px 4px -1px rgba(0,0,0,0.06)',
        nav: '0 1px 0 0 rgba(0,0,0,0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
