'use client';

import { useEffect, useState } from 'react';

import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from '../../tailwind.config';

// Get the fully-merged Tailwind config with all defaults
const fullConfig = resolveConfig(tailwindConfig);
const screens = fullConfig.theme?.screens || {};

// Convert screen values to numbers (remove 'px' suffix)
const breakpoints = Object.entries(screens).reduce(
  (acc, [key, value]) => {
    const numValue = typeof value === 'string' ? parseInt(value.replace('px', ''), 10) : 0;
    acc[key] = numValue;
    return acc;
  },
  {} as Record<string, number>,
);

type Breakpoint = keyof typeof breakpoints;

/**
 * Helper function to get the current active breakpoint based on window width
 */
function getCurrentBreakpoint(): Breakpoint | null {
  const width = window.innerWidth;
  const breakpointEntries = Object.entries(breakpoints).sort(([, a], [, b]) => a - b);
  let activeBreakpoint: Breakpoint | null = null;

  for (const [breakpoint, minWidth] of breakpointEntries) {
    if (width >= minWidth) {
      activeBreakpoint = breakpoint as Breakpoint;
    }
  }

  if (!activeBreakpoint && breakpointEntries.length > 0) {
    activeBreakpoint = breakpointEntries[0][0] as Breakpoint;
  }

  return activeBreakpoint;
}

/**
 * A hook that returns responsive values based on the current breakpoint.
 * Inspired by Chakra UI's useBreakpointValue hook.
 *
 * @param values - An object where keys are breakpoint names and values are the corresponding values
 * @returns The value for the current breakpoint
 *
 * @example
 * const columns = useBreakpointValues({
 *   sm: 1,
 *   md: 2,
 *   lg: 3,
 *   xl: 4,
 * });
 */
export function useBreakpointValues<T>(values: Partial<Record<Breakpoint, T>>): T | undefined {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint | null>(null);

  useEffect(() => {
    const updateBreakpoint = () => {
      setCurrentBreakpoint(getCurrentBreakpoint());
    };

    // Set initial breakpoint
    updateBreakpoint();

    // Listen for window resize
    window.addEventListener('resize', updateBreakpoint);

    return () => {
      window.removeEventListener('resize', updateBreakpoint);
    };
  }, []);

  if (!currentBreakpoint) {
    return undefined;
  }

  // Find the value for the current breakpoint or the closest smaller one
  const breakpointKeys = Object.keys(breakpoints) as Breakpoint[];
  const sortedKeys = breakpointKeys.toSorted((a, b) => breakpoints[a] - breakpoints[b]);
  const currentIndex = sortedKeys.indexOf(currentBreakpoint);

  for (let i = currentIndex; i >= 0; i--) {
    const breakpoint = sortedKeys[i];
    if (breakpoint in values && values[breakpoint] !== undefined) {
      return values[breakpoint];
    }
  }

  return undefined;
}

/**
 * Type-safe helper to ensure all provided breakpoints are valid
 */
export type BreakpointValues<T> = Partial<Record<Breakpoint, T>>;

/**
 * Get the current breakpoint name
 */
export function useCurrentBreakpoint(): Breakpoint | null {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint | null>(null);

  useEffect(() => {
    const updateBreakpoint = () => {
      setCurrentBreakpoint(getCurrentBreakpoint());
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);

    return () => {
      window.removeEventListener('resize', updateBreakpoint);
    };
  }, []);

  return currentBreakpoint;
}

/**
 * Check if the current screen size matches a specific breakpoint or larger
 */
export function useBreakpointUp(breakpoint: Breakpoint): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const minWidth = breakpoints[breakpoint];
    if (minWidth == undefined) return;

    const updateMatches = () => {
      const width = window.innerWidth;
      setMatches(width >= minWidth);
    };

    updateMatches();
    window.addEventListener('resize', updateMatches);

    return () => {
      window.removeEventListener('resize', updateMatches);
    };
  }, [breakpoint]);

  return matches;
}

/**
 * Check if the current screen size matches a specific breakpoint or smaller
 */
export function useBreakpointDown(breakpoint: Breakpoint): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const maxWidth = breakpoints[breakpoint];
    if (maxWidth == undefined) return;

    const updateMatches = () => {
      const width = window.innerWidth;
      setMatches(width < maxWidth);
    };

    updateMatches();
    window.addEventListener('resize', updateMatches);

    return () => {
      window.removeEventListener('resize', updateMatches);
    };
  }, [breakpoint]);

  return matches;
}
