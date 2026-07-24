import type { Metadata } from 'next';
import { db } from '@/db';
import { galleryAlbums } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import GalleryPageClient from './GalleryPageClient';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'View photos and videos from K.L. International School events, activities, and campus life.',
};

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  let albums: any[] = [];
  try {
    albums = await db
      .select()
      .from(galleryAlbums)
      .where(eq(galleryAlbums.isPublished, true))
      .orderBy(desc(galleryAlbums.createdAt));
  } catch (e) {
    console.error('[Gallery Page] Failed to load albums:', e);
  }
  return <GalleryPageClient albums={albums} />;
}
