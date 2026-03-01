"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, Loader2, ChevronRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Footer } from "@/components/home/Footer";
import { ProductCard } from "@/components/home/ProductCard";
import { cn } from "@/lib/utils";

interface Product {
    id: string;
    name: string;
    modelNumber: string;
    description: string | null;
    price: string | number;
    offerPrice: string | number | null;
    images: { url: string; fileId: string }[];
    categoryId: string | null;
    categoryName?: string;
    brandName?: string;
    tagIds: string[];
    features: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    stock: number;
}

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [taggedProducts, setTaggedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [openSections, setOpenSections] = useState<string[]>(["description"]); // Default open
    const addToCart = useCartStore((s) => s.addToCart);
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '');

    const toggleSection = (section: string) => {
        setOpenSections(prev =>
            prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
        );
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();
                setProduct(data);

                // Fetch related products (same category)
                if (data.categoryId) {
                    const relRes = await fetch(`/api/products?categoryId=${data.categoryId}&limit=4`);
                    const relData = await relRes.json();
                    setRelatedProducts(relData.products.filter((p: Product) => p.id !== id));
                }

                // Fetch tagged products (Related Collections)
                if (data.tagIds && data.tagIds.length > 0) {
                    const tagId = data.tagIds[0]; // Fetch by the first tag
                    const tagRes = await fetch(`/api/products?tagId=${tagId}&limit=4`);
                    const tagData = await tagRes.json();
                    setTaggedProducts(tagData.products.filter((p: Product) => p.id !== id));
                }
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddToCart = () => {
        if (!product || product.stock === 0) return;
        addToCart({
            id: product.id,
            name: product.name,
            modelNumber: product.modelNumber,
            price: Number(product.price),
            offerPrice: product.offerPrice ? Number(product.offerPrice) : undefined,
            image: product.images[0]?.url || "",
        });
    };

    const handleWhatsAppInquiry = () => {
        if (!product) return;
        const currentPrice = product.offerPrice || product.price;
        const productUrl = typeof window !== 'undefined' ? window.location.href : '';
        const message =
            `🛍️ *Inquiry from ImiJewel*\n\n` +
            `• *Product:* ${product.name}\n` +
            `• *Price:* ₹${Number(currentPrice).toLocaleString()}\n` +
            `• *Link:* ${productUrl}\n\n` +
            `Please confirm availability and sharing more pictures. Thank you!`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Product not found</h1>
                <Link href="/shop" className="text-gold underline">Back to Shop</Link>
            </div>
        );
    }

    const price = Number(product.price);
    const offerPrice = product.offerPrice ? Number(product.offerPrice) : null;
    const discount = offerPrice ? Math.round(((price - offerPrice) / price) * 100) : 0;

    // Parse features
    const featureList = product.features
        ? product.features.split(';').map(f => f.trim()).filter(f => f.length > 0)
        : [];

    return (
        <main className="min-h-screen bg-white">
            <div className="pt-24 lg:pt-28 pb-12">
                <div className="container mx-auto px-4">
                    {/* Breadcrumbs / Back */}
                    <div className="flex items-center gap-2 mb-3 md:mb-6 text-sm text-zinc-500">
                        <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
                            <ArrowLeft className="w-4 h-4" /> Home
                        </Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href="/shop" className="hover:text-black transition-colors flex items-center gap-1">
                            Shop
                        </Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-zinc-900 font-medium truncate">Product</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-16">
                        {/* Image Section */}
                        <div>
                            {/* Mobile Image Section */}
                            <div className="lg:hidden -mx-4">
                                {product.images.length > 1 ? (
                                    <div className="overflow-x-auto snap-x snap-mandatory flex scrollbar-hide">
                                        {product.images.map((img, idx) => (
                                            <div key={img.fileId} className="w-[85vw] shrink-0 snap-start pl-4 first:pl-4 last:pr-4 aspect-square">
                                                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100">
                                                    <Image
                                                        src={img.url}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                        priority={idx === 0}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        {/* Spacer for last item peek */}
                                        <div className="w-4 shrink-0" />
                                    </div>
                                ) : (
                                    <div className="px-4 aspect-square">
                                        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100">
                                            <Image
                                                src={product.images[0]?.url || ""}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                priority
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Desktop Gallery */}
                            <div className="hidden lg:block relative aspect-square rounded-3xl overflow-hidden bg-zinc-50 border border-zinc-100 shadow-sm">
                                <Image
                                    src={product.images[activeImage]?.url || ""}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-all duration-500"
                                />
                            </div>

                            {/* Thumbnails (Desktop) */}
                            <div className="hidden pt-4 lg:flex gap-4 overflow-x-auto pb-2">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={img.fileId}
                                        onClick={() => setActiveImage(idx)}
                                        className={cn(
                                            "relative w-24 h-24 rounded-xl overflow-hidden border-2 transition-all",
                                            activeImage === idx ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"
                                        )}
                                    >
                                        <Image src={img.url} alt="" fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="flex flex-col">
                            {/* Header Info */}
                            <div>
                                {product.brandName && (
                                    <span className="text-gold text-xs font-black uppercase tracking-widest">{product.brandName}</span>
                                )}
                                <h1 className="text-3xl lg:text-5xl my-0 font-black text-zinc-900 leading-tight line-clamp-3">
                                    {product.name}
                                </h1>
                                <p className="text-xs font-mono text-zinc-400">MODEL NO: {product.modelNumber}</p>
                            </div>

                            {/* Price Section - Reverted to Simple Bold UI */}
                            <div className="flex items-baseline gap-4 mb-4 border-t border-zinc-100 pt-4 mt-4">
                                <span className="text-4xl font-black text-zinc-900 tracking-tighter">
                                    ₹{Number(offerPrice || price).toLocaleString()}
                                </span>
                                {offerPrice && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl text-zinc-400 line-through decoration-zinc-300">
                                            ₹{price.toLocaleString()}
                                        </span>
                                        <span className="text-xs font-black bg-zinc-100 backdrop-blur-sm text-gold px-2 py-0.5 rounded-full">
                                            {discount}% OFF
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mb-8">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className={cn(
                                        "flex-[2] flex items-center justify-center gap-3 h-14 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95",
                                        product.stock === 0
                                            ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                                            : "bg-zinc-900 text-white hover:bg-black shadow-xl shadow-zinc-200"
                                    )}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                                </button>
                                <button
                                    onClick={handleWhatsAppInquiry}
                                    className="flex-1 h-14 flex items-center justify-center gap-3 rounded-2xl border-2 border-[#25D366] text-[#25D366] font-black text-sm uppercase tracking-widest hover:bg-[#25D366] hover:text-white transition-all active:scale-95 group"
                                >
                                    <WhatsAppIcon className="w-5 h-5 fill-current" />
                                    <span>Inquiry</span>
                                </button>
                            </div>

                            {/* Related Collections (by Tags) - Refined & Compact */}
                            {taggedProducts.length > 0 && (
                                <div className="mb-8 p-0">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-4">Complete the look</h3>
                                    <div className="grid grid-cols-4 gap-2">
                                        {taggedProducts.map(p => (
                                            <Link
                                                key={p.id}
                                                href={`/product/${p.id}`}
                                                className="group block"
                                            >
                                                <div className="aspect-square relative rounded-lg overflow-hidden bg-zinc-50 border border-zinc-100 transition-all group-hover:border-gold/50">
                                                    <Image
                                                        src={p.images[0]?.url || ""}
                                                        alt={p.name}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                </div>
                                                <div className="mt-1.5 overflow-hidden">
                                                    <p className="text-sm font-bold text-zinc-900 truncate group-hover:text-gold transition-colors line-clamp-2">{p.name}</p>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <p className="text-sm font-black text-zinc-900">₹{Number(p.offerPrice || p.price).toLocaleString()}</p>
                                                        {p.offerPrice && (
                                                            <p className="text-[10px] text-zinc-400 line-through decoration-zinc-300">₹{Number(p.price).toLocaleString()}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Accordion Sections */}
                            <div className="space-y-0 border-t border-zinc-100">
                                {/* Description Accordion */}
                                <div className="border-b border-zinc-100">
                                    <button
                                        onClick={() => toggleSection('description')}
                                        className="w-full py-5 flex items-center justify-between text-left group"
                                    >
                                        <span className="text-sm font-black uppercase tracking-[0.2em] text-zinc-900 group-hover:text-gold transition-colors">Description</span>
                                        <ChevronRight className={cn(
                                            "w-4 h-4 text-zinc-400 transition-transform duration-300",
                                            openSections.includes('description') && "rotate-90 text-zinc-900"
                                        )} />
                                    </button>
                                    <div className={cn(
                                        "overflow-hidden transition-all duration-300",
                                        openSections.includes('description') ? "max-h-96 opacity-100 mb-6" : "max-h-0 opacity-0"
                                    )}>
                                        <div className="prose prose-zinc prose-sm max-w-none text-zinc-600 leading-relaxed font-semibold text-md lg:text-base">
                                            {product.description || "Crafted with precision and elegance, this piece embodies the timeless beauty of ImiJewel's finest collections."}
                                        </div>
                                    </div>
                                </div>

                                {/* Specifications Accordion */}
                                {featureList.length > 0 && (
                                    <div className="border-b border-zinc-100">
                                        <button
                                            onClick={() => toggleSection('specifications')}
                                            className="w-full py-5 flex items-center justify-between text-left group"
                                        >
                                            <span className="text-sm font-black uppercase tracking-[0.2em] text-zinc-900 group-hover:text-gold transition-colors">Specifications</span>
                                            <ChevronRight className={cn(
                                                "w-4 h-4 text-zinc-400 transition-transform duration-300",
                                                openSections.includes('specifications') && "rotate-90 text-zinc-900"
                                            )} />
                                        </button>
                                        <div className={cn(
                                            "overflow-hidden transition-all duration-300",
                                            openSections.includes('specifications') ? "max-h-96 opacity-100 mb-6" : "max-h-0 opacity-0"
                                        )}>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 p-5 bg-zinc-50 border border-zinc-100 rounded-2xl">
                                                {featureList.map((feature, i) => {
                                                    const [key, val] = feature.split(':');
                                                    return (
                                                        <div key={i} className="flex items-center justify-between py-1.5 border-b border-zinc-200 last:border-0 border-dotted">
                                                            <span className="text-sm uppercase font-bold text-zinc-400">{key?.trim()}</span>
                                                            <span className="text-sm font-black text-zinc-900">{val?.trim()}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-8 flex flex-wrap items-center gap-x-8 gap-y-4 justify-center text-[10px] font-black text-gold uppercase tracking-[0.2em]">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-gold" />
                                    <span>Authentic</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-gold" />
                                    <span>Premium</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-gold" />
                                    <span>Free Shipping</span>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Similar Products (by Category) */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-zinc-100">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl uppercase md:text-3xl font-medium font-sans text-center text-gold tracking-wider">Similar Products</h2>
                                    <p className="text-zinc-500 text-sm mt-1">More from {product.categoryName || 'this category'}</p>
                                </div>
                                <Link
                                    href={`/shop?categoryId=${product.categoryId}`}
                                    className="text-xs font-black uppercase tracking-widest text-gold hover:underline"
                                >
                                    View All
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                                {relatedProducts.map(p => (
                                    <ProductCard key={p.id} product={p as any} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
