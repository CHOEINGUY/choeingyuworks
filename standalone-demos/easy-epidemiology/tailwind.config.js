/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'sans-serif'],
      },
      fontSize: {
        'body': ['0.95rem', { lineHeight: '1.5' }],
        'body-lg': ['1.1rem', { lineHeight: '1.6' }]
      },
      maxWidth: {
        'container': '1200px'
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Main Primary
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        },
        slate: {
          950: '#020617'
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'premium': '0 20px 40px -5px rgba(0, 0, 0, 0.1), 0 10px 20px -5px rgba(0, 0, 0, 0.04)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)'
      },
      borderRadius: {
        '1.5xl': '0.75rem',
        '2.5xl': '1.25rem',
        '3.5xl': '2rem'
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        fadeUp: {
          'from': { opacity: '0', transform: 'translateY(15px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        slideIn: {
          'from': { opacity: '0', transform: 'translateY(-10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        heroPulse: {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '100%': { transform: 'scale(1.1)', opacity: '0.8' }
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        },
        'scan-line': {
          '0%': { top: '0%', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { top: '100%', opacity: '0' }
        },
        'typing': {
          'from': { width: '0' },
          'to': { width: '100%' }
        },
        'type-dot': {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'pulse-subtle': 'pulse-subtle 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        fadeUp: 'fadeUp 0.8s ease-out 0.4s backwards',
        slideIn: 'slideIn 0.3s ease',
        heroPulse: 'heroPulse 10s ease-in-out infinite alternate',
        shimmer: 'shimmer 2s infinite',
        'scan-line': 'scan-line 3s linear infinite',
        'typing': 'typing 1.5s steps(20, end) forwards',
        'type-dot': 'type-dot 0.1s forwards'
      }
    }
  },
  plugins: []
};
