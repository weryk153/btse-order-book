import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#131B29',
        primary: '#F0F4F8',
        secondary: '#8698aa',
        bid: '#00b15d',
        ask: '#FF5B5A',
        'bid-depth': 'rgba(16,186,104,0.12)',
        'ask-depth': 'rgba(255,90,90,0.12)',
        'last-up': 'rgba(16,186,104,0.12)',
        'last-down': 'rgba(255,90,90,0.12)',
        'last-same': 'rgba(134,152,170,0.12)',
        hovered: '#1E3059',
        'flash-up': 'rgba(0, 177, 93, 0.5)',
        'flash-down': 'rgba(255, 91, 90, 0.5)',
      },
      keyframes: {
        'flash-up': {
          '0%': { backgroundColor: 'rgba(0, 177, 93, 0.5)' },
          '100%': { backgroundColor: 'transparent' },
        },
        'flash-down': {
          '0%': { backgroundColor: 'rgba(255, 91, 90, 0.5)' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
      animation: {
        'flash-up': 'flash-up 0.5s ease-out',
        'flash-down': 'flash-down 0.5s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
