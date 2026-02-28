import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { heroContent } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// PATCH /api/hero-content/[id]
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await request.json();

        const [updated] = await db
            .update(heroContent)
            .set({ ...body })
            .where(eq(heroContent.id, id))
            .returning();

        if (!updated) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error('PATCH /api/hero-content/[id] error:', error);
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

// DELETE /api/hero-content/[id]
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const [deleted] = await db
            .delete(heroContent)
            .where(eq(heroContent.id, id))
            .returning();

        if (!deleted) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error('DELETE /api/hero-content/[id] error:', error);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}

// GET /api/hero-content/[id]
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const [slide] = await db
            .select()
            .from(heroContent)
            .where(eq(heroContent.id, id))
            .limit(1);

        if (!slide) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json(slide);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}
