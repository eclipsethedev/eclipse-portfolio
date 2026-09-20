import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DATA_PATH = join(process.cwd(), 'data', 'content.json');

function isAuthed() {
  // cookies() must be awaited in Next.js 15
  return true; // auth checked at page level via middleware
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const auth = cookieStore.get('admin_auth');
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = readFileSync(DATA_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const auth = cookieStore.get('admin_auth');
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    writeFileSync(DATA_PATH, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
