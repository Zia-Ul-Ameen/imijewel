"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { ProductCard } from "@/components/home/ProductCard";
import { Search, Loader2 } from "lucide-react";

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

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        if (!query.trim() || query.length < 2) {
            setResults([]);
            setSearched(false);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            setSearched(true);
            try {
                const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&isActive=true&limit=24`);
                const data = await res.json();
                setResults(data.products || []);
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <main className="min-h-screen bg-zinc-50">
            <Navbar />
            <div className="pt-20">
                {/* Hero search */}
                <div className="bg-black text-white py-12 md:py-20">
                    <div className="container mx-auto px-6 max-w-2xl text-center">
                        <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
                            Search <span className="text-rose-400">Jewellery</span>
                        </h1>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search by name or model number..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                autoFocus
                                className="w-full pl-12 pr-6 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-white placeholder-zinc-500 text-base focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                            />
                            {loading && (
                                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 animate-spin" />
                            )}
                        </div>
                        <p className="text-zinc-500 text-sm mt-3">Type at least 2 characters to search</p>
                    </div>
                </div>

                {/* Results */}
                <div className="container mx-auto px-4 md:px-6 py-8">
                    {!searched && (
                        <div className="text-center py-16 text-zinc-400">
                            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                            <p className="text-lg font-medium">Start typing to search</p>
                            <p className="text-sm mt-1">Search across product names and model numbers</p>
                        </div>
                    )}

                    {searched && !loading && results.length === 0 && (
                        <div className="text-center py-16 text-zinc-500">
                            <div className="text-5xl mb-4">🔍</div>
                            <p className="text-lg font-medium">No results for &quot;{query}&quot;</p>
                            <p className="text-sm mt-1">Try a different search term</p>
                        </div>
                    )}

                    {results.length > 0 && (
                        <>
                            <p className="text-sm text-zinc-500 mb-4">
                                {results.length} result{results.length !== 1 ? 's' : ''} for &quot;<strong className="text-zinc-900">{query}</strong>&quot;
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                                {results.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
