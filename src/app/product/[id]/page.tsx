import { Metadata } from "next";
import { db } from "@/lib/db";
import { products, categories, brands } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import { Footer } from "@/components/home/Footer";

interface Product {
    id: string;
    name: string;
    modelNumber: string;
    description: string | null;
    price: string | number;
    offerPrice: string | number | null;
    images: { url: string; fileId: string }[];
    categoryId: string | null;
    brandId: string | null;
    tagIds: string[];
    features: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    isActive: boolean;
    stock: number;
    categoryName?: string | null;
    brandName?: string | null;
}

async function getProduct(id: string): Promise<Product | null> {
    try {
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
                features: products.features,
                metaTitle: products.metaTitle,
                metaDescription: products.metaDescription,
                isActive: products.isActive,
                stock: products.stock,
                categoryName: categories.name,
                brandName: brands.name,
            })
            .from(products)
            .leftJoin(categories, eq(products.categoryId, categories.id))
            .leftJoin(brands, eq(products.brandId, brands.id))
            .where(eq(products.id, id))
            .limit(1);

        return (product as Product) || null;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

export async function generateStaticParams() {
    const allProducts = await db.select({ id: products.id }).from(products).where(eq(products.isActive, true));
    return allProducts.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) return { title: "Product Not Found" };

    const title = product.metaTitle || `${product.name} – ImiJewel`;
    const description = product.metaDescription || product.description || `Buy ${product.name} at ImiJewel. High quality imitation jewellery.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: product.images.map(img => img.url),
        },
    };
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product || !product.isActive) {
        notFound();
    }

    // JSON-LD structured data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": product.images.map(img => img.url),
        "description": product.description || `High quality ${product.name} from ImiJewel.`,
        "sku": product.modelNumber,
        "brand": {
            "@type": "Brand",
            "name": product.brandName || "ImiJewel"
        },
        "offers": {
            "@type": "Offer",
            "url": `${process.env.NEXT_PUBLIC_BASE_URL || ''}/product/${product.id}`,
            "priceCurrency": "INR",
            "price": product.offerPrice || product.price,
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "itemCondition": "https://schema.org/NewCondition"
        }
    };

    return (
        <main className="min-h-screen bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDetailClient id={id} />
            <Footer />
        </main>
    );
}
