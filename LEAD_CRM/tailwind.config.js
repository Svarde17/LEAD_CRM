/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f6f9fc',
        surface: '#ffffff',
        card: '#ffffff',
        border: '#e3e8ef',
        primary: '#635bff',
        'primary-dark': '#4f46e5',
        secondary: '#697386',
        text: '#1a1f36',
        'text-muted': '#697386',
        success: '#09b574',
        warning: '#e5a022',
        danger: '#df1b41',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.06)',
        'card-lg': '0 8px 24px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.06)',
        input: '0 1px 2px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
}
