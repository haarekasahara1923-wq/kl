import type { Metadata } from 'next';
import { db } from '@/db';
import { staff } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import StaffPageClient from './StaffPageClient';

export const metadata: Metadata = {
  title: 'Our Staff',
  description: 'Meet the dedicated faculty and staff of K.L. International School, Gwalior.',
};

export default async function StaffPage() {
  let staffList: any[] = [];
  try {
    staffList = await db.query.staff.findMany({
      where: and(eq(staff.isPublic, true), eq(staff.isActive, true), eq(staff.isDeleted, false)),
    });
  } catch {}
  return <StaffPageClient staffList={staffList} />;
}
