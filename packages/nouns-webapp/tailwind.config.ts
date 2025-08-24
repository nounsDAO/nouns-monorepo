import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        londrina: ['Londrina Solid', 'sans-serif'],
        pt: ['PT Root UI', 'sans-serif'],
      },
      screens: {
        xs: '425px',
        '2xl': '1440px',
        'lg-max': { max: '992px' },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        cool: {
          background: 'var(--brand-cool-background)',
        },
        warm: {
          background: 'var(--brand-warm-background)',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        'brand-black': 'var(--brand-black)',
        'brand-dark-red': 'var(--brand-dark-red)',
        'brand-dark-green': 'var(--brand-dark-green)',
        'brand-color-green': 'var(--brand-color-green)',
        'brand-color-green-translucent': 'var(--brand-color-green-translucent)',
        'brand-color-red': 'var(--brand-color-red)',
        'brand-color-red-translucent': 'var(--brand-color-red-translucent)',
        'brand-color-blue': 'var(--brand-color-blue)',
        'brand-color-blue-darker': 'var(--brand-color-blue-darker)',
        'brand-gray-dark-text': 'var(--brand-gray-dark-text)',
        'brand-gray-light-text': 'var(--brand-gray-light-text)',
        'brand-gray-light-text-translucent': 'var(--brand-gray-light-text-translucent)',
        'brand-cool-dark-text': 'var(--brand-cool-dark-text)',
        'brand-cool-light-text': 'var(--brand-cool-light-text)',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      boxShadow: {
        'quorum-modal': '0 0 24px rgba(0,0,0,0.05)',
        'bid-wrapper': 'inset 0 -12px 16px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
