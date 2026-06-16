/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep obsidian
        obsidian: {
          900: '#050816',
          800: '#0A0F1E',
          700: '#0F172A',
        },
        // Primary accent – restrained
        brand: {
          400: '#7B87E6',
          500: '#5E6AD2',
          600: '#4A56B8',
        },
        // Secondary accent – cyan (used sparingly)
        accent: {
          cyan: '#06B6D4',
          electric: '#3B82F6',
        },
        // Surfaces
        surface: '#0F172A',
        border: 'rgba(255,255,255,0.06)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        // Minimal – only for depth, not for glass
        subtle: '0 4px 24px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};