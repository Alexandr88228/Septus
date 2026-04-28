import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const contentTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.woff2': 'font/woff2',
};

export async function GET(_request: Request, { params }: { params: Promise<{ studio?: string[] }> }) {
  const { studio = [] } = await params;
  const adminRoot = path.join(process.cwd(), 'public', 'admin');
  const requestedPath = studio.length > 0 ? path.join(adminRoot, ...studio) : path.join(adminRoot, 'index.html');
  const safeRequestedPath = path.normalize(requestedPath);

  if (!safeRequestedPath.startsWith(adminRoot)) {
    return new NextResponse('Not found', { status: 404 });
  }

  const filePath = path.extname(safeRequestedPath) ? safeRequestedPath : path.join(adminRoot, 'index.html');
  const fallbackPath = path.join(adminRoot, 'index.html');

  try {
    return fileResponse(await fs.readFile(filePath), filePath);
  } catch {
    try {
      return fileResponse(await fs.readFile(fallbackPath), fallbackPath);
    } catch {
      return new NextResponse('Sanity Studio is not built. Run npm run build:studio.', { status: 404 });
    }
  }
}

function fileResponse(body: Buffer, filePath: string) {
  const extension = path.extname(filePath);
  const arrayBuffer = body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength) as ArrayBuffer;

  return new NextResponse(arrayBuffer, {
    headers: {
      'Content-Type': contentTypes[extension] ?? 'application/octet-stream',
    },
  });
}
