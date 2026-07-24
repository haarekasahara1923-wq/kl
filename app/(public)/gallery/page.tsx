import type { Metadata } from 'next';
import { db } from '@/db';
import { galleryAlbums } from '@/db/schema';
import { eq } from 'drizzle-orm';
import GalleryPageClient from './GalleryPageClient';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'View photos and videos from K.L. International School events, activities, and campus life.',
};

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  let albums: any[] = [];
  try {
    const rawAlbums = await db.query.galleryAlbums.findMany({
      where: eq(galleryAlbums.isPublished, true),
      with: { items: { limit: 1 } },
    });
    albums = rawAlbums;
  } catch {}
  return <GalleryPageClient albums={albums} />;
}
