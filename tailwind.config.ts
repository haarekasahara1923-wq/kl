import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          DEFAULT: '#FF7A00',
          light: '#FF9A3C',
          dark: '#E06500',
          50: '#FFF3E6',
          100: '#FFE0B8',
        },
        navy: {
          DEFAULT: '#0A1F44',
          light: '#1a3a6b',
          dark: '#060f22',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      boxShadow: {
        'orange': '0 4px 24px rgba(255, 122, 0, 0.25)',
        'navy': '0 4px 24px rgba(10, 31, 68, 0.15)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
