/**  @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mint: '#4ade80',
        'dark-blue': '#1a1f2c',
        'dark-bg': '#0f1116',
        'light-gray': '#e2e8f0'
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#e2e8f0',
            h1: {
              color: '#4ade80',
            },
            h2: {
              color: '#4ade80',
            },
            h3: {
              color: '#4ade80',
            },
            strong: {
              color: '#fff',
            },
            blockquote: {
              color: '#e2e8f0',
              borderLeftColor: '#4ade80',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
 