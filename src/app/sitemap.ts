import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { products, categories } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://imijewel.vercel.app';

    // Fetch all active products
    const allProducts = await db
        .select({ id: products.id, updatedAt: products.createdAt })
        .from(products)
        .where(eq(products.isActive, true));

    // Fetch all categories
    const allCategories = await db
        .select({ id: categories.id })
        .from(categories);

    const productUrls: MetadataRoute.Sitemap = allProducts.map((p) => ({
        url: `${baseUrl}/product/${p.id}`,
        lastModified: p.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const categoryUrls: MetadataRoute.Sitemap = allCategories.map((c) => ({
        url: `${baseUrl}/shop?categoryId=${c.id}`,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/shop`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...categoryUrls,
        ...productUrls,
    ];
}
