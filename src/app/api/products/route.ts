import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { brands, categories, tags, products } from '@/lib/schema';
import { ilike, eq, inArray, and, desc, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET /api/products — public
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const categoryId = searchParams.get('categoryId');
        const brandId = searchParams.get('brandId');
        const tagId = searchParams.get('tagId');
        const isActive = searchParams.get('isActive');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = (page - 1) * limit;

        const conditions: any[] = [];

        if (search) {
            conditions.push(
                sql`(${products.name} ILIKE ${`%${search}%`} OR ${products.modelNumber} ILIKE ${`%${search}%`})`
            );
        }
        if (categoryId) conditions.push(eq(products.categoryId, categoryId));
        if (tagId) {
            conditions.push(sql`${products.tagIds} ? ${tagId}`);
        }
        if (brandId) conditions.push(eq(products.brandId, brandId));
        if (isActive !== null) conditions.push(eq(products.isActive, isActive === 'true'));

        const query = db
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
                features: products.features,
                metaTitle: products.metaTitle,
                metaDescription: products.metaDescription,
                isActive: products.isActive,
                stock: products.stock,
                createdAt: products.createdAt,
                categoryName: categories.name,
                brandName: brands.name,
            })
            .from(products)
            .leftJoin(categories, eq(products.categoryId, categories.id))
            .leftJoin(brands, eq(products.brandId, brands.id));

        const data = conditions.length > 0
            ? await query.where(and(...conditions)).orderBy(desc(products.createdAt)).limit(limit).offset(offset)
            : await query.orderBy(desc(products.createdAt)).limit(limit).offset(offset);

        return NextResponse.json({ products: data, page, limit });
    } catch (error) {
        console.error('GET /api/products error:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

// POST /api/products — admin only
export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, modelNumber, description, price, offerPrice, images, categoryId, brandId, tagIds, isActive, stock, features, metaTitle, metaDescription } = body;

        if (!name || !modelNumber || !price) {
            return NextResponse.json({ error: 'Name, model number and price are required' }, { status: 400 });
        }

        const [created] = await db.insert(products).values({
            name,
            modelNumber,
            description,
            price: price.toString(),
            offerPrice: offerPrice?.toString(),
            images: images || [],
            categoryId: categoryId || null,
            brandId: brandId || null,
            tagIds: tagIds || [],
            isActive: isActive ?? true,
            stock: stock ?? 0,
            features: features || null,
            metaTitle: metaTitle || null,
            metaDescription: metaDescription || null,
        }).returning();

        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error('POST /api/products error:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
