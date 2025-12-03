import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  // prefix: 'tw-',
  theme: {
    extends: {
      keyframes: {
        'scale-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.06)', opacity: '0.98' },
        },
      },
      animation: {
        'scale-pulse': 'scale-pulse 1s ease-in-out infinite',
        'scale-pulse-slow': 'scale-pulse 1.6s ease-in-out infinite',
        'scale-pulse-fast': 'scale-pulse 0.6s ease-in-out infinite',
      },
    },
    // screens: {
    //   xs: '480px',
    //   sm: '640px',
    //   md: '768px',
    //   lg: '1024px',
    //   xl: '1280px',
    //   '2xl': '1536px',
    // },
  },
};

export default config;
