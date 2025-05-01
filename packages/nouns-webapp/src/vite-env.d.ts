/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// plain .svg
declare module '*.svg' {
  import * as React from 'react'
  const Component: React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>
  export default Component
}

// any query param after .svg (e.g. ?component or ?react or ?url)
declare module '*.svg?*' {
  import * as React from 'react'
  const Component: React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>
  export default Component
}

declare module 'bs-custom-file-input';
