const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ffcc2a',      // warna utama
          light: '#ffe066',        // kuning lebih terang
          dark: '#e0a800',         // kuning keemasan lebih gelap
        },
        secondary: {
          DEFAULT: '#f9b500',      // oranye emas
          light: '#ffd34d',        // oranye muda
          dark: '#cc9200',         // oranye tua
        },
        accent: {
          DEFAULT: '#1b5ca2',      // biru tua (untuk kontras)
          light: '#227fc0',
          dark: '#153f6f',
        },
      },
      fontFamily: {
        'sans': ['"Open Sans"', 'sans-serif'], // 'Open Sans' adalah nama font dari Google Fonts
        'serif': ['ui-serif', 'Georgia', ...defaultTheme.fontFamily.serif], // Contoh menambahkan font serif default
        'mono': ['ui-monospace', 'SFMono-Regular', ...defaultTheme.fontFamily.mono], // Contoh menambahkan font monospace default
        'heading': ['"Montserrat"', 'sans-serif'], // Contoh font lain untuk heading
      },
      keyframes: {
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'ping-custom': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '75%, 100%': { transform: 'scale(1.2)', opacity: '0' },
        },
      },
      animation: {
        slideDown: 'slideDown 0.6s ease-out',
        'ping-custom': 'ping-custom 1s cubic-bezier(0, 0, 0.2, 1) infinite',

      },
      transitionProperty: {
        'opacity-transform': 'opacity, transform',
      },
      transitionTimingFunction: {
        'in-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

    },
  },
  plugins: [],
}