import { NextResponse } from 'next/server';
import { db } from '@/db';
import { admissionEnquiries } from '@/db/schema';
import { admissionEnquirySchema } from '@/lib/validations';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = admissionEnquirySchema.parse(body);

    const [enquiry] = await db.insert(admissionEnquiries).values({
      studentName: parsed.studentName,
      classApplying: parsed.classApplying,
      parentName: parsed.parentName,
      phone: parsed.phone,
      email: parsed.email || null,
      address: parsed.address || null,
      message: parsed.message || null,
    }).returning();

    return NextResponse.json(enquiry, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit admission enquiry' }, { status: 400 });
  }
}
