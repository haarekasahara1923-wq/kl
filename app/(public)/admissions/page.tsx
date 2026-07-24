import type { Metadata } from 'next';
import AdmissionsPageClient from './AdmissionsPageClient';

export const metadata: Metadata = {
  title: 'Admissions',
  description: 'Apply for admission at K.L. International School, Gwalior. Admissions open for 2026-27.',
};

export default function AdmissionsPage() {
  return <AdmissionsPageClient />;
}
