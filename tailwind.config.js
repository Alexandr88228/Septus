/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-manrope)', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        surface: 'var(--surface)',
        surfaceLight: 'var(--surface-light)',
        borderMuted: 'var(--border-muted)',
      },
      animation: {
        'fade-in': 'fadeIn 0.7s cubic-bezier(.4,0,.2,1) both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'none' },
        },
      },
    },
  },
  plugins: [],
}
