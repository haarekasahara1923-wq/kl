import { NextResponse } from 'next/server';
import { db } from '@/db';
import { settings as appSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// Force dynamic rendering — prevents Vercel from caching this route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allSettings = await db.select().from(appSettings);
    return NextResponse.json(allSettings);
  } catch (error: any) {
    console.error('[Settings GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    // ── STEP 1: Auth check ──────────────────────────────────
    const session = await auth();
    console.log('[Settings PUT] session:', JSON.stringify({
      exists: !!session,
      role: (session?.user as any)?.role ?? 'none',
      email: session?.user?.email ?? 'none',
    }));

    if (!session || (session.user as any).role !== 'admin') {
      console.warn('[Settings PUT] Unauthorized - role:', (session?.user as any)?.role);
      return NextResponse.json(
        { error: 'Unauthorized. Only admins can modify settings.' },
        { status: 401 }
      );
    }

    // ── STEP 2: Parse body ──────────────────────────────────
    let body: any;
    try {
      body = await req.json();
    } catch (_e) {
      console.error('[Settings PUT] Failed to parse JSON body');
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { settings: newSettings } = body;
    console.log('[Settings PUT] received settings count:', Array.isArray(newSettings) ? newSettings.length : 'not an array');
    console.log('[Settings PUT] payload:', JSON.stringify(newSettings));

    if (!Array.isArray(newSettings)) {
      return NextResponse.json(
        { error: 'Invalid payload: expected { settings: [...] }' },
        { status: 400 }
      );
    }

    // ── STEP 3: Upsert each setting ─────────────────────────
    const updated = [];
    for (const setting of newSettings) {
      if (!setting.key) {
        console.warn('[Settings PUT] Skipping entry with empty key:', setting);
        continue;
      }

      console.log(`[Settings PUT] Processing key="${setting.key}" value="${setting.value}"`);

      const existing = await db
        .select({ id: appSettings.id })
        .from(appSettings)
        .where(eq(appSettings.key, setting.key))
        .limit(1);

      console.log(`[Settings PUT] key="${setting.key}" exists in DB:`, existing.length > 0);

      if (existing.length > 0) {
        const [res] = await db
          .update(appSettings)
          .set({ value: setting.value ?? null, updatedAt: new Date() })
          .where(eq(appSettings.key, setting.key))
          .returning();
        console.log(`[Settings PUT] Updated key="${setting.key}":`, !!res);
        if (res) updated.push(res);
      } else {
        const [res] = await db
          .insert(appSettings)
          .values({ key: setting.key, value: setting.value ?? null })
          .returning();
        console.log(`[Settings PUT] Inserted key="${setting.key}":`, !!res);
        if (res) updated.push(res);
      }
    }

    console.log('[Settings PUT] Done. Total updated/inserted:', updated.length);
    return NextResponse.json({ success: true, updated });

  } catch (error: any) {
    console.error('[Settings PUT] Unhandled error:', error?.message, error);
    return NextResponse.json(
      { error: error?.message || 'Failed to save settings' },
      { status: 500 }
    );
  }
}
