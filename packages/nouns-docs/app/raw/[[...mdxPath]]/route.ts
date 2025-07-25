import { readFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { generateStaticParamsFor } from 'nextra/pages';
import { join, resolve } from 'path';

export async function generateStaticParams(): Promise<{ mdxPath: string[] }[]> {
  const nextraParams = await generateStaticParamsFor('mdxPath')();
  return nextraParams.map(param => ({
    mdxPath: param.mdxPath as string[],
  }));
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ mdxPath: string[] }> }
) {
  try {
    const { mdxPath } = await params;

    // Validate path exists
    if (!mdxPath || mdxPath.length === 0) {
      return new NextResponse('Path required', { status: 400 });
    }

    // Join path segments and ensure security
    const filePath = mdxPath.join('/');

    // Prevent directory traversal attacks
    if (filePath.includes('..') || filePath.includes('\\')) {
      return new NextResponse('Invalid path', { status: 400 });
    }

    // Construct the full file path in the content directory
    const contentDir = resolve(process.cwd(), 'content');
    const fullPath = join(contentDir, `${filePath}.mdx`);

    // Ensure the resolved path is within the content directory
    if (!fullPath.startsWith(contentDir)) {
      return new NextResponse('Invalid path', { status: 400 });
    }

    // Read the markdown file
    const content = await readFile(fullPath, 'utf-8');

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return new NextResponse('File not found', { status: 404 });
    }

    console.error('Error reading file:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}