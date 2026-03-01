import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categories } from '@/lib/schema';
import { asc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET() {
    try {
        const data = await db.select().from(categories).orderBy(asc(categories.order));
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, slug, image, imageFileId } = body;

        if (!name || !slug) {
            return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
        }

        const [created] = await db.insert(categories).values({ name, slug, image, imageFileId }).returning();
        return NextResponse.json(created, { status: 201 });
    } catch (error: any) {
        if (error?.code === '23505') {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}
