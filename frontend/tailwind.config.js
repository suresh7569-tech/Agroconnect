/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        leaf: {
          50:  '#f2faf3',
          100: '#e0f3e3',
          200: '#bfe5c6',
          300: '#8dd09a',
          400: '#57b569',
          500: '#329846',
          600: '#237935',
          700: '#1d602c',
          800: '#194c25',
          900: '#153f20',
        },
        earth: {
          50:  '#faf7f2',
          100: '#f2ead9',
          200: '#e3d3ac',
          300: '#d1b57a',
          400: '#bd9552',
          500: '#a67c3d',
          600: '#8a6431',
          700: '#6c4d28',
          800: '#4e381d',
          900: '#3a2a17',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
