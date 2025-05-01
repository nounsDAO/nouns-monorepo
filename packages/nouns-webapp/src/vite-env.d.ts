/// <reference types="vite/client" />

declare module '*.svg' {
  import * as React from 'react';
  const SVG: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  export default SVG;
}
