import { NextResponse } from 'next/server';
import { db } from '@/db';
import { galleryItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !['admin', 'operations'].includes((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { albumId, url, publicId, caption, type, sortOrder } = body;

    if (!albumId || !url || !publicId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newItem = await db.insert(galleryItems).values({
      albumId,
      url,
      publicId,
      caption,
      type: type || 'image',
      sortOrder: sortOrder || 0,
    }).returning();

    return NextResponse.json(newItem[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add gallery item' }, { status: 500 });
  }
}
