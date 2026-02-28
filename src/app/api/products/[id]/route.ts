import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, categories, brands } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const [product] = await db
            .select({
                id: products.id,
                name: products.name,
                modelNumber: products.modelNumber,
                description: products.description,
                price: products.price,
                offerPrice: products.offerPrice,
                images: products.images,
                categoryId: products.categoryId,
                brandId: products.brandId,
                tagIds: products.tagIds,
                isActive: products.isActive,
                stock: products.stock,
                createdAt: products.createdAt,
                categoryName: categories.name,
                brandName: brands.name,
            })
            .from(products)
            .leftJoin(categories, eq(products.categoryId, categories.id))
            .leftJoin(brands, eq(products.brandId, brands.id))
            .where(eq(products.id, id))
            .limit(1);

        if (!product) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

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

        // Convert price fields to strings for decimal columns
        const updateData: any = { ...body };
        if (updateData.price !== undefined) updateData.price = updateData.price.toString();
        if (updateData.offerPrice !== undefined) updateData.offerPrice = updateData.offerPrice?.toString();

        const [updated] = await db
            .update(products)
            .set(updateData)
            .where(eq(products.id, id))
            .returning();

        if (!updated) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error('PATCH /api/products/[id] error:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

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
            .delete(products)
            .where(eq(products.id, id))
            .returning();

        if (!deleted) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
