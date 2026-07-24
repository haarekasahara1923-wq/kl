import { NextResponse } from 'next/server';
import { db } from '@/db';
import { galleryItems } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const albumId = params.id;
    if (!albumId) {
      return NextResponse.json({ items: [] });
    }
    const items = await db
      .select()
      .from(galleryItems)
      .where(eq(galleryItems.albumId, albumId))
      .orderBy(asc(galleryItems.sortOrder));
    return NextResponse.json({ items });
  } catch (error: any) {
    console.error('[Gallery Items GET]', error);
    return NextResponse.json({ items: [], error: error.message || 'Failed to fetch items' }, { status: 500 });
  }
}
