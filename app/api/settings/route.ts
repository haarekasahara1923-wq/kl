import { NextResponse } from 'next/server';
import { db } from '@/db';
import { settings as appSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// Force dynamic rendering — prevents Vercel from caching this route
// as a static GET-only endpoint, which would cause PUT to return 405
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allSettings = await db.select().from(appSettings);
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

    let body: any;
    try {
      body = await req.json();
    } catch (_e) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { settings: newSettings } = body; // Array of { key, value }

    if (!Array.isArray(newSettings) || newSettings.length === 0) {
      return NextResponse.json({ error: 'Invalid payload: expected { settings: [...] }' }, { status: 400 });
    }

    const updated = [];
    for (const setting of newSettings) {
      if (!setting.key) continue;

      const existing = await db
        .select({ id: appSettings.id })
        .from(appSettings)
        .where(eq(appSettings.key, setting.key))
        .limit(1);

      if (existing.length > 0) {
        const [res] = await db
          .update(appSettings)
          .set({ value: setting.value ?? null, updatedAt: new Date() })
          .where(eq(appSettings.key, setting.key))
          .returning();
        if (res) updated.push(res);
      } else {
        const [res] = await db
          .insert(appSettings)
          .values({ key: setting.key, value: setting.value ?? null })
          .returning();
        if (res) updated.push(res);
      }
    }

    return NextResponse.json({ success: true, updated });
  } catch (error: any) {
    console.error('[Settings PUT] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to save settings' },
      { status: 500 }
    );
  }
}

