/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Primary - Purple to Blue gradient
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
        },
        // Secondary - Cyan to Teal
        secondary: {
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
        },
        // Accent - Pink to Rose
        accent: {
          400: '#FB7185',
          500: '#F43F5E',
          600: '#E11D48',
        },
        // Warm - Amber to Gold
        warm: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        // Dark surfaces
        surface: {
          900: '#0A0A0F',
          800: '#12121A',
          700: '#1A1A2E',
          600: '#222244',
        }
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #6366F1, #06B6D4, #F43F5E)',
        'gradient-cyber': 'linear-gradient(135deg, #4F46E5, #06B6D4, #8B5CF6)',
        'gradient-warm': 'linear-gradient(135deg, #F59E0B, #FB7185, #6366F1)',
        'gradient-glass': 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.05))',
      },
      boxShadow: {
        'glow-primary': '0 0 40px rgba(99,102,241,0.3)',
        'glow-secondary': '0 0 40px rgba(6,182,212,0.3)',
        'glow-accent': '0 0 40px rgba(244,63,94,0.3)',
        'glow-warm': '0 0 40px rgba(245,158,11,0.3)',
        '3d': '0 20px 60px -10px rgba(0,0,0,0.8)',
        'glass': '0 8px 32px rgba(0,0,0,0.4)',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-medium': 'float 6s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'pulse-medium': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        '3d-rotate': 'rotate3d 10s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(3deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' },
        },
        rotate3d: {
          '0%, 100%': { transform: 'perspective(1000px) rotateX(-5deg) rotateY(5deg)' },
          '50%': { transform: 'perspective(1000px) rotateX(5deg) rotateY(-5deg)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
};