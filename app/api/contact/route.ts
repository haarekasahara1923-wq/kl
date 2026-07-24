import { NextResponse } from 'next/server';
import { db } from '@/db';
import { contactEnquiries } from '@/db/schema';
import { contactEnquirySchema } from '@/lib/validations';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = contactEnquirySchema.parse(body);

    const [enquiry] = await db.insert(contactEnquiries).values({
      name: parsed.name,
      email: parsed.email || null,
      phone: parsed.phone,
      subject: parsed.subject || null,
      message: parsed.message,
    }).returning();

    return NextResponse.json(enquiry, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit contact enquiry' }, { status: 400 });
  }
}
