import { NextResponse } from 'next/server';
import { db } from '@/db';
import { settings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const allSettings = await db.query.settings.findMany();
    return NextResponse.json(allSettings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized. Only admins can modify settings.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { settings: newSettings } = body; // Array of { key, value }

    if (!Array.isArray(newSettings)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const updated = [];
    for (const setting of newSettings) {
      const existing = await db.query.settings.findFirst({
        where: eq(settings.key, setting.key),
      });

      if (existing) {
        const res = await db.update(settings).set({ value: setting.value, updatedAt: new Date() }).where(eq(settings.key, setting.key)).returning();
        updated.push(res[0]);
      } else {
        const res = await db.insert(settings).values({ key: setting.key, value: setting.value }).returning();
        updated.push(res[0]);
      }
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Settings API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save settings' }, { status: 500 });
  }
}
