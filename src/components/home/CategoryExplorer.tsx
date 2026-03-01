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

import { useCategoryStore } from "@/stores/category.store";

export const CategoryExplorer = () => {
    const { categories, loading, fetchAll } = useCategoryStore();

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

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
                <h3 className="text-xl md:text-3xl font-medium font-sans px-4 text-center text-gold tracking-wider pb-3 md:pb-6">EXPLORE BY CATEGORY</h3>
                <div className="flex items-center px-4 justify-center gap-4 md:gap-8 overflow-x-auto no-scrollbar">
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
                                        className="object-cover transition-all duration-500 scale-100 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100">
                                        <span className="text-2xl">💎</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none" />
                            </div>
                            <span className="text-xs font-black font-medium text-black uppercase tracking-widest text-center group-hover:text-rose-500 transition-colors">
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
                        <span className="text-xs font-medium font-black text-black uppercase tracking-widest text-center group-hover:text-rose-500 transition-colors">
                            All
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
};
