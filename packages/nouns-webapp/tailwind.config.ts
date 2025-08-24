import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '425px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },
    extend: {
      fontFamily: {
        sans: ['PT Root UI', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        londrina: ['Londrina Solid', 'sans-serif'],
        pt: ['PT Root UI', 'sans-serif'],
      },
      backgroundImage: {
        checkerboard:
          'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
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
        'brand-gray-background': 'var(--brand-gray-background)',
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
      spacing: {
        18: '4.5rem',
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    // @ts-ignore
    function ({ addUtilities, addVariant }) {
      // Custom lg-max variant to re-enable built-in min-/max- arbitrary variants
      addVariant('lg-max', '@media (max-width: 992px)');

      // Custom utilities for checkerboard background sizing and positioning
      addUtilities({
        '.bg-size-checkerboard': {
          'background-size': '3.125% 3.125%',
        },
        '.bg-pos-checkerboard': {
          'background-position': '0 0, 0 1.5625%, 1.5625% -1.5625%, -1.5625% 0px',
        },
        '.tw-underline': {
          'text-decoration-line': 'underline',
        },
      });

      // Container max-width adjustment at 1400px
      addVariant('min-1400', '@media (min-width: 1400px)');
      addUtilities(
        {
          '.container': { 'max-width': '1140px !important' },
          '.container-lg': { 'max-width': '1140px !important' },
          '.container-xl': { 'max-width': '1140px !important' },
          '.container-xxl': { 'max-width': '1140px !important' },
        },
        { variants: ['min-1400'] }
      );
    },
  ],
} satisfies Config;
