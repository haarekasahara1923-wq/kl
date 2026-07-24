import { NextResponse } from 'next/server';
import { db } from '@/db';
import { galleryItems } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const items = await db.query.galleryItems.findMany({
      where: eq(galleryItems.albumId, params.id),
      orderBy: [asc(galleryItems.sortOrder)],
    });
    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch items' }, { status: 500 });
  }
}
