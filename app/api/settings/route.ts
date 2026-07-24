import { NextResponse } from 'next/server';
import { db } from '@/db';
import { settings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const allSettings = await db.select().from(settings);
    return NextResponse.json(allSettings);
  } catch (error: any) {
    console.error('[Settings GET]', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Only admins can modify settings.' }, { status: 401 });
    }

    const body = await req.json();
    const { settings: newSettings } = body; // Array of { key, value }

    if (!Array.isArray(newSettings)) {
      return NextResponse.json({ error: 'Invalid payload: expected { settings: [...] }' }, { status: 400 });
    }

    const updated = [];
    for (const setting of newSettings) {
      if (!setting.key) continue;

      const existing = await db
        .select({ id: settings.id })
        .from(settings)
        .where(eq(settings.key, setting.key))
        .limit(1);

      if (existing.length > 0) {
        const [res] = await db
          .update(settings)
          .set({ value: setting.value ?? null, updatedAt: new Date() })
          .where(eq(settings.key, setting.key))
          .returning();
        updated.push(res);
      } else {
        const [res] = await db
          .insert(settings)
          .values({ key: setting.key, value: setting.value ?? null })
          .returning();
        updated.push(res);
      }
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('[Settings PUT] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save settings' }, { status: 500 });
  }
}
