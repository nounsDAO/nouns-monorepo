import type { Config } from 'tailwindcss';
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
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
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
        ...Object.fromEntries(
          [
            'black',
            'dark-red',
            'dark-green',
            'color-green',
            'color-green-translucent',
            'color-red',
            'color-red-translucent',
            'color-blue',
            'color-blue-darker',
            'gray-dark-text',
            'gray-light-text',
            'gray-light-text-translucent',
            'gray-background',
            'cool-dark-text',
            'cool-light-text',
            'warm-light-text',
          ].map(name => [`brand-${name}`, `var(--brand-${name})`]),
        ),
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: Object.fromEntries(
          Array.from({ length: 5 }, (_, i) => [i + 1, `hsl(var(--chart-${i + 1}))`]),
        ),
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
    function ({ addUtilities, addVariant, matchUtilities, theme }) {
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
        Object.fromEntries(
          ['.container', '.container-lg', '.container-xl', '.container-xxl'].map(cls => [
            cls,
            { 'max-width': '1140px !important' },
          ]),
        ),
        { variants: ['min-1400'] },
      );

      // Brand CSS variable helpers generated from existing brand-* colors
      const colors = theme('colors') || {};
      const brandValues = Object.keys(colors)
        .filter(k => typeof k === 'string' && k.startsWith('brand-'))
        .reduce(
          (acc, k) => {
            const mod = k.replace(/^brand-/, '');
            acc[mod] = mod;
            return acc;
          },
          {} as Record<string, string>,
        );

      matchUtilities(
        {
          'text-brand': (value: string) => ({ color: `var(--brand-${value})` }),
          'bg-brand': (value: string) => ({ backgroundColor: `var(--brand-${value})` }),
          'border-brand': (value: string) => ({ borderColor: `var(--brand-${value})` }),
          'fill-brand': (value: string) => ({ fill: `var(--brand-${value})` }),
          'stroke-brand': (value: string) => ({ stroke: `var(--brand-${value})` }),
        },
        { values: brandValues },
      );
    },
  ],
} satisfies Config;
