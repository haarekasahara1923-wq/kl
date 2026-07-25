import type { Metadata } from 'next';
import { db } from '@/db';
import { galleryItems, galleryAlbums } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import GalleryPageClient from './GalleryPageClient';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'View photos and videos from K.L. International School events, activities, and campus life.',
};

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  let items: any[] = [];
  try {
    // Fetch all gallery items directly — no album filtering needed
    items = await db
      .select({
        id: galleryItems.id,
        url: galleryItems.url,
        caption: galleryItems.caption,
        type: galleryItems.type,
        publicId: galleryItems.publicId,
        createdAt: galleryItems.createdAt,
      })
      .from(galleryItems)
      .innerJoin(galleryAlbums, eq(galleryItems.albumId, galleryAlbums.id))
      .where(eq(galleryAlbums.isPublished, true))
      .orderBy(desc(galleryItems.createdAt));
  } catch (e) {
    console.error('[Gallery Page] Failed to load items:', e);
  }
  return <GalleryPageClient items={items} />;
}
