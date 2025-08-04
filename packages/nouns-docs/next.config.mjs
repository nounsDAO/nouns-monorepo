import nextra from 'nextra';
import rehypeMermaid from 'rehype-mermaid';
import githubAlerts from 'remark-github-blockquote-alert';
import chromium from '@sparticuz/chromium';

const withNextra = nextra(
  /** @type {import('nextra').NextraConfig} */
  {
    search: true,
    defaultShowCopyCode: true,
    mdxOptions: {
      remarkPlugins: [githubAlerts],
      rehypePlugins: [
        [
          /**
           * Note: the nextra bundled @theguild/remark-mermaid, which renders mermaid
           * on the client side instead of at build time, takes precedence over this one.
           * It is disabled by overriding the dependency via the monorepo root package.json
           * pnpm.overrides field, replacing it with the stub package ./lib/remark-mermaid-stub
           */
          rehypeMermaid,
          /** @type {import('rehype-mermaid').RehypeMermaidOptions} */
          {
            strategy: 'inline-svg',
            launchOptions: {
              executablePath:
                process.env.VERCEL === '1' ? await chromium.executablePath() : undefined,
            },
            mermaidConfig: {
              theme: 'dark',
            },
          },
        ],
      ],
    },
  },
);

export default withNextra({
  // ... Other Next.js config options
  // output: 'export'
  async rewrites() {
    return [
      {
        source: '/:path*.txt',
        destination: '/raw/:path*',
      },
    ];
  },
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find(rule => rule.test?.test?.('.svg'));

    config.module.rules.push(
      // Convert *.svg?react imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: /react/, // *.svg?react
        use: ['@svgr/webpack'],
      },
    );

    // Modify the file loader rule to ignore *.svg?url and *.svg?react, but allow regular *.svg imports
    fileLoaderRule.resourceQuery = {
      not: [...(fileLoaderRule.resourceQuery?.not || []), /react/],
    };

    return config;
  },
});
