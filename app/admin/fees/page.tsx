import { db } from '@/db';
import { feePayments, feeStructures } from '@/db/schema';
import FeesClient from './FeesClient';

export default async function FeesPage() {
  let payments: any[] = [];
  let structures: any[] = [];
  try {
    payments = await db.query.feePayments.findMany({
      with: { student: true, feeStructure: true },
      orderBy: (p, { desc }) => [desc(p.createdAt)],
    });
    structures = await db.query.feeStructures.findMany();
  } catch {}
  return <FeesClient payments={payments} structures={structures} />;
}
