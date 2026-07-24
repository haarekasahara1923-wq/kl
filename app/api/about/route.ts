import { NextResponse } from 'next/server';
import { db } from '@/db';
import { aboutContent } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const content = await db.query.aboutContent.findMany();
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch about content' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session || !['admin', 'operations'].includes((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { section, name, designation, message, qualifications, photoUrl, photoPublicId } = body;

    if (!section || !name || !designation || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Build set object — only include photo fields if they were explicitly provided
    const setData: any = {
      name,
      designation,
      message,
      qualifications: qualifications || null,
      updatedAt: new Date(),
    };
    if (photoUrl !== undefined) setData.photoUrl = photoUrl;
    if (photoPublicId !== undefined) setData.photoPublicId = photoPublicId;

    const existing = await db.query.aboutContent.findFirst({
      where: eq(aboutContent.section, section),
    });

    let updated;
    if (existing) {
      updated = await db.update(aboutContent).set(setData).where(eq(aboutContent.section, section)).returning();
    } else {
      updated = await db.insert(aboutContent).values({
        section,
        name,
        designation,
        message,
        qualifications: qualifications || null,
        photoUrl: photoUrl || null,
        photoPublicId: photoPublicId || null,
      }).returning();
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}

