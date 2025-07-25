import { NextResponse } from 'next/server';
import { getPageMap } from 'nextra/page-map';

import config from '@/config';

interface PageMapItem {
  title?: string;
  description?: string;
  children?: PageMapItem[];
  route?: string;
  frontMatter?: {
    title?: string;
    description?: string;
  };
}

function generateMarkdownFromPageMap(pageMap: PageMapItem[], baseUrl = ''): string {
  let markdown = '';

  for (const item of pageMap) {
    const title = item.title || item.frontMatter?.title;
    if (!title) continue;

    // If item has children, treat it as a section
    if (item.children && item.children.length > 0) {
      markdown += `## ${title}\n\n`;

      // Add pages as list items
      for (const child of item.children) {
        const childTitle = child.title || child.frontMatter?.title;
        const childDescription = child.description || child.frontMatter?.description;

        if (!childTitle) continue;

        const route = child.route || '';
        const fullUrl = `${baseUrl}${route}`;

        if (childDescription) {
          markdown += `- [${childTitle}](${fullUrl}): ${childDescription}\n`;
        } else {
          markdown += `- [${childTitle}](${fullUrl})\n`;
        }
      }

      markdown += '\n';
    } else if (item.route) {
      // If it's a standalone page, add it as a list item under a general section
      const description = item.description || item.frontMatter?.description;
      const fullUrl = `${baseUrl}${item.route}`;

      if (description) {
        markdown += `- [${title}](${fullUrl}): ${description}\n`;
      } else {
        markdown += `- [${title}](${fullUrl})\n`;
      }

      // Add newline after standalone pages to separate from following sections
      markdown += '\n';
    }
  }

  return markdown;
}

export async function GET() {
  try {
    const pageMap = ((await getPageMap()) as PageMapItem[]).filter(
      p => !p?.route || p.route !== '/',
    );
    const baseUrl = config.baseUri;

    const markdown = generateMarkdownFromPageMap(pageMap, baseUrl);

    const content = `# Nouns DAO Documentation

Nouns DAO is a Decentralized Autonomous Organization (DAO) empowering Nouns NFT owners to shape and govern the project by voting on proposals funded by the Treasury. Nouns NFTs are auctioned daily, and the proceeds go to the Nouns Treasury.

${markdown}`;

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating llms.txt:', error);
    return new NextResponse('Error generating documentation', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}
