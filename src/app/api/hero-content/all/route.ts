import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { heroContent as heroContentTable } from '@/lib/schema';
import { auth } from '@/lib/auth';
import { asc } from 'drizzle-orm';

// GET /api/hero-content/all — admin only, returns all slides 
export async function GET() {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const slides = await db
            .select()
            .from(heroContentTable)
            .orderBy(asc(heroContentTable.order));
        return NextResponse.json(slides);
    } catch (error) {
        console.error('GET /api/hero-content/all error:', error);
        return NextResponse.json({
            error: 'Failed to fetch',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
