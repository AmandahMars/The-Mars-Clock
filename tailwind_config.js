/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app.jsx',
  ],
  theme: {
    extend: {
      colors: {
        mars: {
          gold: '#FFD700',
          orange: '#FF8C42',
          teal: '#7DD3D3',
          dark: '#1a1410',
        },
      },
      fontFamily: {
        mono: ['Courier New', 'monospace'],
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'starfield': 'radial-gradient(2px 2px at 20px 30px, white, rgba(255,255,255,0.2)), radial-gradient(2px 2px at 60px 70px, white, rgba(255,255,255,0.15)), radial-gradient(1px 1px at 50px 50px, white, rgba(255,255,255,0.1))',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-yellow-400',
    'text-yellow-400',
    'text-orange-500',
    'border-yellow-600',
  ],
};
