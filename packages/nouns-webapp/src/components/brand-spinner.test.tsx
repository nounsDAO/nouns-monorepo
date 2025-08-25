import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { default as BrandSpinner } from './brand-spinner';

describe('BrandSpinner', () => {
  it('renders an SVG element', () => {
    const { container } = render(<BrandSpinner />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  it('has the correct width and height attributes', () => {
    const { container } = render(<BrandSpinner />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toHaveAttribute('width', '25');
    expect(svgElement).toHaveAttribute('height', '25');
  });

  it('contains a spinning path with specified class', () => {
    const { container } = render(<BrandSpinner />);
    const pathElement = container.querySelector('path');
    expect(pathElement).toBeInTheDocument();
    expect(pathElement).toHaveClass('animate-spin-1250');
  });

  it('includes a circle with opacity and stroke attributes', () => {
    const { container } = render(<BrandSpinner />);
    const circleElement = container.querySelector('circle');
    expect(circleElement).toBeInTheDocument();
    expect(circleElement).toHaveAttribute('opacity', '0.2');
    expect(circleElement).toHaveAttribute('stroke', 'black');
    expect(circleElement).toHaveAttribute('stroke-width', '4');
  });
});
