"use client";

import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { ProductCard } from "@/components/home/ProductCard";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";

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

interface Category { id: string; name: string; slug: string; }
interface Brand { id: string; name: string; slug: string; }

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtersOpen, setFiltersOpen] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        // Read URL params on mount
        const params = new URLSearchParams(window.location.search);
        if (params.get('categoryId')) setSelectedCategory(params.get('categoryId')!);
        if (params.get('brandId')) setSelectedBrand(params.get('brandId')!);

        Promise.all([
            fetch('/api/categories').then(r => r.json()),
            fetch('/api/brands').then(r => r.json()),
        ]).then(([cats, brds]) => {
            if (Array.isArray(cats)) setCategories(cats);
            if (Array.isArray(brds)) setBrands(brds);
        });
    }, []);

    const fetchProducts = useCallback(async (reset = false) => {
        setLoading(true);
        const currentPage = reset ? 1 : page;
        const params = new URLSearchParams({ isActive: 'true', limit: '20', page: String(currentPage) });
        if (selectedCategory) params.set('categoryId', selectedCategory);
        if (selectedBrand) params.set('brandId', selectedBrand);
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
    }, [selectedCategory, selectedBrand, searchQuery, page]);

    useEffect(() => {
        fetchProducts(true);
    }, [selectedCategory, selectedBrand]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProducts(true);
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSelectedBrand('');
        setSearchQuery('');
    };

    const hasFilters = selectedCategory || selectedBrand || searchQuery;

    return (
        <main className="min-h-screen bg-zinc-50">
            <Navbar />
            <div className="pt-20">
                {/* Header */}
                <div className="bg-white border-b border-zinc-100 sticky top-20 z-40">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="py-4 flex items-center gap-4">
                            {/* Search */}
                            <form onSubmit={handleSearch} className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Search jewellery..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-200 transition-colors"
                                />
                            </form>

                            {/* Filter toggle */}
                            <button
                                onClick={() => setFiltersOpen(!filtersOpen)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium hover:border-zinc-300 transition-colors"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                <span className="hidden sm:inline">Filters</span>
                                {hasFilters && <span className="w-2 h-2 rounded-full bg-rose-500" />}
                            </button>

                            {hasFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* Filters Panel */}
                        {filtersOpen && (
                            <div className="py-4 border-t border-zinc-100 flex flex-wrap gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Category</label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-rose-300 min-w-[150px]"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Brand</label>
                                    <select
                                        value={selectedBrand}
                                        onChange={(e) => setSelectedBrand(e.target.value)}
                                        className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-rose-300 min-w-[150px]"
                                    >
                                        <option value="">All Brands</option>
                                        {brands.map((b) => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
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
