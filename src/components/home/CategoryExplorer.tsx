"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string | null;
}

export const CategoryExplorer = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCategories(data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section className="bg-white py-8 md:py-12 border-b border-zinc-100">
                <div className="container md:mx-auto">
                    <div className="flex items-center justify-start px-4 md:justify-center gap-8 md:gap-12">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 shrink-0 animate-pulse">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-zinc-100" />
                                <div className="w-12 h-3 bg-zinc-100 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!categories.length) return null;

    return (
        <section className="bg-white py-8 md:py-12 border-b border-zinc-100 overflow-hidden">
            <div className="container md:mx-auto">
                <div className="flex items-center justify-start px-4 md:justify-center gap-6 md:gap-12 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/shop?categoryId=${category.id}`}
                            className="flex flex-col items-center gap-3 group shrink-0"
                        >
                            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-zinc-50 border-2 border-zinc-100 group-hover:border-rose-300 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:shadow-rose-100">
                                {category.image ? (
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100">
                                        <span className="text-2xl">💎</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none" />
                            </div>
                            <span className="text-[10px] font-black text-black uppercase tracking-widest text-center group-hover:text-rose-500 transition-colors">
                                {category.name}
                            </span>
                        </Link>
                    ))}

                    {/* All Categories */}
                    <Link
                        href="/shop"
                        className="flex flex-col items-center gap-3 group shrink-0"
                    >
                        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-zinc-50 border-2 border-zinc-200 group-hover:border-rose-300 group-hover:bg-rose-50 transition-all duration-300">
                            <div className="grid grid-cols-2 gap-1">
                                <div className="w-2 h-2 bg-zinc-400 group-hover:bg-rose-400 rounded-sm transition-colors" />
                                <div className="w-2 h-2 bg-zinc-400 group-hover:bg-rose-400 rounded-sm transition-colors" />
                                <div className="w-2 h-2 bg-zinc-400 group-hover:bg-rose-400 rounded-sm transition-colors" />
                                <div className="w-2 h-2 bg-zinc-400 group-hover:bg-rose-400 rounded-sm transition-colors" />
                            </div>
                        </div>
                        <span className="text-[10px] font-black text-black uppercase tracking-widest text-center group-hover:text-rose-500 transition-colors">
                            All
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
};
