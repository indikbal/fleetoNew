import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#010101',
        'fleeto-red': '#AB2323',
        'fleeto-red-dark': '#8A1C1C',
        'fleeto-red-light': '#D42D2D',
        'fleeto-black': '#010101',
        'fleeto-gray': '#F5F5F5',
        'fleeto-gray-dark': '#1A1A1A',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-anton)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
