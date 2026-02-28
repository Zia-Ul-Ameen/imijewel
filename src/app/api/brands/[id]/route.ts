import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { brands } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const [brand] = await db.select().from(brands).where(eq(brands.id, id)).limit(1);
        if (!brand) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(brand);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { id } = await params;
        const body = await request.json();
        const [updated] = await db.update(brands).set(body).where(eq(brands.id, id)).returning();
        if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { id } = await params;
        const [deleted] = await db.delete(brands).where(eq(brands.id, id)).returning();
        if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ message: 'Deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
