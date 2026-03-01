"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Footer } from "@/components/home/Footer";
import { ProductCard } from "@/components/home/ProductCard";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCategoryStore } from "@/stores/category.store";

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

export default function ShopClient() {
    const [products, setProducts] = useState<Product[]>([]);
    const { categories, fetchAll } = useCategoryStore();
    const [loading, setLoading] = useState(true);
    const [filtersOpen, setFiltersOpen] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        // Read URL params on mount
        const params = new URLSearchParams(window.location.search);
        if (params.get('categoryId')) setSelectedCategory(params.get('categoryId')!);

        fetchAll();
    }, [fetchAll]);

    const fetchProducts = useCallback(async (reset = false) => {
        setLoading(true);
        const currentPage = reset ? 1 : page;
        const params = new URLSearchParams({ isActive: 'true', limit: '20', page: String(currentPage) });
        if (selectedCategory) params.set('categoryId', selectedCategory);
        if (searchQuery) params.set('search', searchQuery);

        try {
            const res = await fetch(`/api/products?${params}`);
            const data = await res.json();
            const newProducts = data.products || [];
            setProducts(prev => reset ? newProducts : [...prev, ...newProducts]);
            setHasMore(newProducts.length === 20);
            if (reset) setPage(2); else setPage(p => p + 1);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [selectedCategory, searchQuery, page]);

    useEffect(() => {
        fetchProducts(true);
    }, [selectedCategory]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProducts(true);
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSearchQuery('');
    };

    const hasFilters = selectedCategory || searchQuery;

    const activeCategoryName = categories.find(c => c.id === selectedCategory)?.name || 'All Categories';

    return (
        <main className="min-h-screen bg-zinc-50 font-sans">
            <div className="pt-20">
                {/* Header Section */}
                <div className="bg-white border-b border-zinc-100 sticky top-20 z-40 transition-all duration-300">
                    <div className="container mx-auto px-4 md:px-12 relative">
                        {/* Search and Main Actions */}
                        <div className="py-6 flex flex-col md:flex-row items-center gap-4">
                            <form onSubmit={handleSearch} className="w-full md:flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Search precious collections..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm focus:outline-none focus:border-gold/30 focus:ring-4 focus:ring-gold/5 transition-all placeholder:text-zinc-400"
                                />
                            </form>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <button
                                    onClick={() => setFiltersOpen(!filtersOpen)}
                                    className={cn(
                                        "flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-3.5 border rounded-2xl text-sm font-bold tracking-tight transition-all duration-300",
                                        filtersOpen
                                            ? "bg-black text-white border-black shadow-lg shadow-black/10"
                                            : "bg-white text-zinc-900 border-zinc-100 hover:border-zinc-300 shadow-sm"
                                    )}
                                >
                                    <SlidersHorizontal className="w-4 h-4" />
                                    <span>{activeCategoryName}</span>
                                    <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", filtersOpen && "rotate-180")} />
                                </button>

                                {hasFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="p-3.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                                        title="Clear all filters"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Dropdown-style Category Grid - Absolute Positioning */}
                        <div className={cn(
                            "absolute top-full left-0 right-0 bg-white border border-t-0 border-zinc-100 rounded-b-[2rem] shadow-2xl z-50 transition-all duration-500 ease-out p-4 md:p-6",
                            filtersOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-4 opacity-0 invisible pointer-events-none"
                        )}>
                            <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
                                <div className="flex flex-wrap gap-2 md:gap-3 p-1">
                                    <button
                                        onClick={() => { setSelectedCategory(''); setFiltersOpen(false); }}
                                        className={cn(
                                            "px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                                            selectedCategory === ''
                                                ? "bg-black text-white shadow-md shadow-black/10"
                                                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                        )}
                                    >
                                        All Categories
                                    </button>

                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => { setSelectedCategory(category.id); setFiltersOpen(false); }}
                                            className={cn(
                                                "px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                                                selectedCategory === category.id
                                                    ? "bg-black text-white shadow-md shadow-black/10"
                                                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                            )}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div className="container mx-auto px-4 md:px-6 py-8">
                    {loading && products.length === 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="animate-pulse bg-white rounded-2xl overflow-hidden border border-zinc-100">
                                    <div className="aspect-square bg-zinc-100" />
                                    <div className="p-3 space-y-2">
                                        <div className="h-3 bg-zinc-100 rounded w-2/3" />
                                        <div className="h-4 bg-zinc-100 rounded" />
                                        <div className="h-4 bg-zinc-100 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 text-zinc-500">
                            <div className="text-5xl mb-4">🔍</div>
                            <p className="text-lg font-medium">No products found</p>
                            <p className="text-sm mt-1">Try adjusting your filters or search</p>
                            <button onClick={clearFilters} className="mt-4 px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors">
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-zinc-500">
                                    {products.length} product{products.length !== 1 ? 's' : ''} found
                                </p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {hasMore && (
                                <div className="flex justify-center mt-8">
                                    <button
                                        onClick={() => fetchProducts(false)}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Loading...' : 'Load More'}
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
