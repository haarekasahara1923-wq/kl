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
      const res = await db.insert(settings).values({
        key: setting.key,
        value: setting.value,
      }).onConflictDoUpdate({
        target: settings.key,
        set: { value: setting.value, updatedAt: new Date() },
      }).returning();
      updated.push(res[0]);
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
