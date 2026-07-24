import type { Metadata } from 'next';
import { db } from '@/db';
import { certifications } from '@/db/schema';
import { eq } from 'drizzle-orm';
import CertificationsPageClient from './CertificationsPageClient';

export const metadata: Metadata = {
  title: 'Certifications & Accreditations',
  description: 'K.L. International School certifications, accreditations, and awards.',
};

export const dynamic = 'force-dynamic';

export default async function CertificationsPage() {
  let certs: any[] = [];
  try {
    certs = await db.query.certifications.findMany({ where: eq(certifications.isPublished, true) });
  } catch {}
  return <CertificationsPageClient certifications={certs} />;
}
