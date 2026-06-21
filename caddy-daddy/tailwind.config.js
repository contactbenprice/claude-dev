/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'tm-red': '#D50032',
        'tm-red-bright': '#E60028',
        'surface-0': '#0A0A0A',
        'surface-1': '#111111',
        'surface-2': '#1A1A1A',
        'surface-3': '#242424',
        'surface-4': '#2E2E2E',
        'text-primary': '#F5F5F5',
        'text-secondary': '#A0A0A0',
        'text-muted': '#666666',
      },
      fontFamily: {
        headline: ['Oswald', 'Arial Narrow', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        carbon: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.018) 2px,
            rgba(255,255,255,0.018) 4px
          ), repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.018) 2px,
            rgba(255,255,255,0.018) 4px
          )`,
        'red-glow': 'radial-gradient(ellipse at 50% 0%, rgba(213,0,50,0.18) 0%, transparent 65%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.45s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        reveal: 'reveal 0.65s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(36px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
