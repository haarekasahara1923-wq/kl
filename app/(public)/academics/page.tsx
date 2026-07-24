import type { Metadata } from 'next';
import AcademicsPageClient from './AcademicsPageClient';

export const metadata: Metadata = {
  title: 'Academics',
  description: 'Explore K.L. International School academic programs — from Nursery to Class XII, CBSE curriculum with smart classrooms.',
};

export default function AcademicsPage() {
  return <AcademicsPageClient />;
}
