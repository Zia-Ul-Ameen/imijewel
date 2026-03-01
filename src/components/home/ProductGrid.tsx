"use client";

import { ProductCard } from "./ProductCard";

interface Product {
    id: string;
    name: string;
    modelNumber: string;
    price: string | number;
    offerPrice?: string | number | null;
    images: { url: string; fileId: string }[];
    categoryName?: string | null;
    brandName?: string | null;
    stock: number;
    isActive: boolean;
}

interface ProductGridProps {
    products: Product[];
    title?: string;
    subtitle?: string;
}

export const ProductGrid = ({ products, title, subtitle }: ProductGridProps) => {
    if (!products || products.length === 0) return null;

    return (
        <section className="bg-white py-12 md:py-16 border-b border-zinc-100">
            <div className="container mx-auto px-4 md:px-6">
                {(title || subtitle) && (
                    <div className="text-center mb-8 md:mb-10">
                        {title && (
                            <h2 className="text-xl uppercase md:text-3xl font-medium font-sans px-4 text-center text-gold tracking-wider">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="text-zinc-500 uppercase mt-2 font-rethink tracking-wide font-medium text-xs md:text-base">{subtitle}</p>
                        )}
                        <div className="flex items-center justify-center gap-2 mt-3">
                            <div className="h-0.5 w-12 bg-gold" />
                            <div className="h-1.5 w-1.5 rounded-full bg-gold" />
                            <div className="h-0.5 w-12 bg-gold" />
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};
