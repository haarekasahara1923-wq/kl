import type { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact K.L. International School, Gwalior. Phone: 8962678915. Email: support@klinternational.space',
};

export default function ContactPage() {
  return <ContactPageClient />;
}
