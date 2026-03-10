import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paul Rand palette — bold, primary, confident
        obsidian:  '#0C0F1A',   // near-black navy ground
        gold:      '#F5C518',   // bold warm yellow — primary action color
        parchment: '#F1F5F9',   // clean light surface
        cobalt:    '#1D4ED8',   // bold primary blue
        crimson:   '#DC2626',   // bold red — errors, wrong answers
        ivory:     '#E8EDF5',   // cool near-white text
        charcoal:  '#151B2E',   // card surface
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body:    ['var(--font-body)',    'sans-serif'],
        mono:    ['var(--font-mono)',    'monospace'],
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-8px)' },
          '40%, 80%': { transform: 'translateX(8px)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.93)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'shake':    'shake 0.3s ease-in-out',
        'fade-up':  'fadeUp 0.25s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
};

export default config;
