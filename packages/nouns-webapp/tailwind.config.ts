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
      // Named breakpoint for 992px used widely in legacy styles
      'md-lg': '992px',
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
        // Sponsor fade backgrounds to replace arbitrary bg-[linear-gradient(...)] in candidate-card.module.css
        'sponsor-fade':
          'linear-gradient(90deg, rgba(244,244,248,0) 0%, rgba(244,244,248,0.9) 15%, rgba(244,244,248,1) 25%, rgba(244,244,248,1) 100%)',
        'sponsor-fade-hover':
          'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 15%, rgba(255,255,255,1) 25%, rgba(255,255,255,1) 100%)',
        // Replaces bg-[radial-gradient(#ffffff70_15%,rgba(0,0,0,0)_75%)]
        'radial-white-70': 'radial-gradient(#ffffff70 15%, rgba(0,0,0,0) 75%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        // Commonly used custom radii across CSS modules
        10: '10px', // used in nav-bar, vote-modal, and various buttons
        14: '14px', // used in bid-history rows and panels
        15: '15px', // used widely across inputs/buttons
        12: '12px', // replaces rounded-[12px]
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
            'cool-border',
            'cool-accent',
            'warm-light-text',
            'warm-border',
            'warm-accent',
            'gray-hover',
          ].map(name => [`brand-${name}`, `var(--brand-${name})`]),
        ),
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: Object.fromEntries(
          Array.from({ length: 5 }, (_, i) => [i + 1, `hsl(var(--chart-${i + 1}))`]),
        ),
        // Static hex tokens to replace repeated arbitrary color values across CSS modules
        'brand-border-ui': '#e2e3e8', // used for subtle borders (nav, proposals)
        'brand-gray-border': '#e2e3e8', // alias for legacy border-brand-gray-border usage
        'brand-surface': '#f4f4f8', // light gray surface
        'brand-surface-muted': '#e2e3e8', // subtle surface used for hover states
        'brand-surface-elevated': '#e0e0e7', // elevated surface panels
        'brand-surface-contrast': '#fbfbfc', // very light surface used in signature cards
        'brand-surface-subtle': '#fafbfc', // table backgrounds in diffs
        'brand-surface-cool': '#e9ebf3', // cool background chips
        'brand-surface-warm': '#fdf9f9', // warm background chips
        'brand-text-muted-600': '#8c8d92', // muted text
        'brand-text-muted-500': '#646465', // slightly darker muted text used in signatures
        'brand-text-muted-700': '#5f5f5f', // stronger muted text
        'brand-text-muted-550': '#6c757d', // secondary muted text
        'brand-border-light': '#e6e6e6', // light border used in feedback modules
        'brand-border-muted': '#aaaaaa', // muted border for inputs
        'brand-border-muted-400': '#b3b3b3', // timeline markers and rails
        'brand-border-neutral-400': '#a7a7aa', // neutral dashed border
        'brand-warm-muted': '#b6a9a7', // warm muted text
        'brand-cool-muted': '#79809c', // cool muted text
        'brand-warning-border': '#f0ad4e', // warning border
        'brand-warning-text': '#dc9e46', // warning text
        'brand-cool-deep': '#1b2140', // deep cool text for headings in bid modal
        'brand-surface-neutral': '#e8e8ec', // neutral surface fill
      },
      boxShadow: {
        // Replaces shadow-[0_0_0_0.2rem_rgb(67,179,105,0.75)]
        'brand-focus-green': '0 0 0 0.2rem rgba(67,179,105,0.75)',
        'quorum-modal': '0 0 24px rgba(0,0,0,0.05)',
        'bid-wrapper': 'inset 0 -12px 16px rgba(0,0,0,0.08)',
      },
      animation: {
        'spin-1250': 'spin 1.25s linear infinite',
      },
      spacing: {
        18: '4.5rem',
        26: '6.5rem', // support h-26 (104px) used in voteReasonTextarea
        30: '7.5rem', // support h-30 (120px) used in spinnerWrapper
        '0.3': '0.3rem', // used for p/m-[0.3rem] across nav components
        '0.4': '0.1rem', // used for subtle +/- 0.1rem offsets in proposal header, vote modules
        '0.75': '0.1875rem', // used for mt-[3px] adjustments
        '4.5': '1.125rem', // to replace min-h-[18px] and similar precise heights
        '5.6': '1.4rem', // used for title spacing in timers
        '12.5': '3.125rem', // used for consistent 50px heights (e.g., buttons)
        '7.5': '1.875rem', // 30px for avatars and icons
        15: '3.75rem', // 60px max widths
        210: '13.125rem', // 210px delegate buttons
        315: '19.6875rem', // 315px lg delegate buttons
      },
      maxWidth: {
        // For by-line-hover-card max-w-[11rem]
        '11rem': '11rem',
      },
      borderWidth: {
        '1.5': '1.5px', // replaces border-*[1.5px] in nav bar dropdowns
      },
      minHeight: {
        85: '21.25rem', // 340px used in proposal-editor bodyInput
      },
      lineHeight: {
        // Preserve 25px line-height used alongside 17px text for headings
        25: '25px',
        27: '27px', // used in winner and auction headlines
        'tight-3': '.7', // used in timers where leading-[0.7] was applied
      },
      fontSize: {
        13: '13px',
        15: '15px', // used 10+ times across CSS modules
        17: '17px', // used in auction-activity headings
        22: '22px',
        23: '23px', // used in current-bid, forking timer, holder
        32: '32px', // used in multiple headings
        '1.3xl': '1.3rem', // used in documentation and editor h3
        '2.7xl': '1.7rem', // used in many headings
        '2.5xl': '2.5rem', // used in auction-activity and documentation
        42: '42px', // used in vote modal titles
        56: '56px', // used in governance, playground, fork pages
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    // @ts-ignore
    function ({ addUtilities, addVariant, matchUtilities, theme }) {
      // Custom max-width variants to replace max-[...] utilities
      addVariant('lg-max', '@media (max-width: 992px)');
      addVariant('xl-max', '@media (max-width: 1200px)');

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
