import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { heroContent } from '@/lib/schema';
import { eq, asc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET /api/hero-content — public, returns all active slides sorted by order
export async function GET() {
    try {
        const slides = await db
            .select()
            .from(heroContent)
            .where(eq(heroContent.isActive, true))
            .orderBy(asc(heroContent.order));
        return NextResponse.json(slides);
    } catch (error) {
        console.error('GET /api/hero-content error:', error);
        return NextResponse.json({ error: 'Failed to fetch hero content' }, { status: 500 });
    }
}

// GET /api/hero-content?all=true — admin, returns all slides
export async function GET_ALL() {
    try {
        const slides = await db.select().from(heroContent).orderBy(asc(heroContent.order));
        return NextResponse.json(slides);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

// POST /api/hero-content — admin only
export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, description, image, imagekitFileId, brandName, exploreLink, isActive, order } = body;

        if (!title || !image) {
            return NextResponse.json({ error: 'Title and image are required' }, { status: 400 });
        }

        const [created] = await db.insert(heroContent).values({
            title,
            description,
            image,
            imagekitFileId,
            brandName,
            exploreLink: exploreLink || '/shop',
            isActive: isActive ?? true,
            order: order ?? 0,
        }).returning();

        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error('POST /api/hero-content error:', error);
        return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
    }
}
