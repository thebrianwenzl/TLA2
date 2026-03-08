import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian:  '#1A1A2E',
        gold:      '#C9A84C',
        parchment: '#F5F0E8',
        cobalt:    '#2C6E8A',
        crimson:   '#8B2635',
        ivory:     '#FFFDF7',
        charcoal:  '#3D3D3D',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body:    ['var(--font-body)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      keyframes: {
        shimmerGold: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '50%':  { opacity: '1', transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shake: {
          '0%, 100%':   { transform: 'translateX(0)' },
          '20%, 60%':   { transform: 'translateX(-8px)' },
          '40%, 80%':   { transform: 'translateX(8px)' },
        },
        flipX: {
          '0%':   { transform: 'rotateY(0deg)' },
          '50%':  { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
        sunburstExpand: {
          '0%':   { transform: 'scale(0)', opacity: '0' },
          '60%':  { opacity: '1' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
      },
      animation: {
        'shimmer-gold':    'shimmerGold 0.3s ease-out',
        'shake':           'shake 0.3s ease-in-out',
        'flip-x':          'flipX 0.4s ease-in-out',
        'sunburst-expand': 'sunburstExpand 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
