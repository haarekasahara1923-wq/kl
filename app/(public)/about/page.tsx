import type { Metadata } from 'next';
import { db } from '@/db';
import { aboutContent } from '@/db/schema';
import { eq } from 'drizzle-orm';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about K.L. International School — our history, vision, mission, Director and Principal messages.',
};

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  let director = null;
  let principal = null;
  try {
    director = await db.query.aboutContent.findFirst({ where: eq(aboutContent.section, 'director') });
    principal = await db.query.aboutContent.findFirst({ where: eq(aboutContent.section, 'principal') });
  } catch {}
  return <AboutPageClient director={director} principal={principal} />;
}
