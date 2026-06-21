/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // B2B Lender Portal tokens
        'navy':     'hsl(222, 28%, 9%)',
        'surface':  'hsl(222, 24%, 14%)',
        'emerald':  'hsl(160, 84%, 39%)',
        'coral':    'hsl(0, 72%, 51%)',
        'amber':    'hsl(38, 92%, 50%)',
        'text-pri': 'hsl(210, 40%, 96%)',
        'text-sec': 'hsl(215, 20%, 65%)',
        // B2C Borrower Simulator tokens
        'b-bg':      'hsl(0, 0%, 98%)',
        'b-surface': 'hsl(210, 40%, 97%)',
        'b-accent':  'hsl(245, 82%, 58%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui'],
      },
      borderRadius: {
        'card': '12px',
        'input': '8px',
        'cta': '24px',
      },
    },
  },
  plugins: [],
}
