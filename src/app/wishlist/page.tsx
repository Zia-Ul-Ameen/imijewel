"use client";

import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlist.store";
import { useCartStore } from "@/stores/cart.store";
import { toast } from "sonner";

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlistStore();
    const addToCart = useCartStore((s) => s.addToCart);

    const handleMoveToCart = (item: typeof wishlist[0]) => {
        addToCart({
            id: item.id,
            name: item.name,
            modelNumber: item.modelNumber,
            price: item.price,
            offerPrice: item.offerPrice,
            image: item.image,
        });
        removeFromWishlist(item.id);
        toast.success("Moved to cart");
    };

    if (wishlist.length === 0) {
        return (
            <main className="min-h-screen bg-zinc-50">
                <Navbar />
                <div className="pt-20 flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                    <Heart className="w-16 h-16 text-zinc-300 mb-4" />
                    <h1 className="text-2xl font-black text-zinc-900 mb-2">Your wishlist is empty</h1>
                    <p className="text-zinc-500 mb-6">Save your favourite pieces here</p>
                    <Link
                        href="/shop"
                        className="px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-zinc-800 transition-colors"
                    >
                        Browse Collection
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-50">
            <Navbar />
            <div className="pt-20">
                <div className="container mx-auto px-4 md:px-6 py-8 max-w-5xl">
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/shop" className="text-zinc-500 hover:text-zinc-700 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-black text-zinc-900">
                            My Wishlist
                            <span className="ml-2 text-base font-medium text-zinc-500">({wishlist.length} items)</span>
                        </h1>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {wishlist.map((item) => {
                            const price = item.offerPrice ?? item.price;
                            const discount = item.offerPrice ? Math.round(((item.price - item.offerPrice) / item.price) * 100) : 0;

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-md transition-shadow group"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-square bg-zinc-50">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-4xl bg-rose-50">💎</div>
                                        )}
                                        {discount > 0 && (
                                            <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg">
                                                -{discount}%
                                            </span>
                                        )}
                                        <button
                                            onClick={() => { removeFromWishlist(item.id); toast.success("Removed from wishlist"); }}
                                            className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                        </button>
                                    </div>

                                    {/* Info */}
                                    <div className="p-3 space-y-2">
                                        <p className="text-[10px] text-zinc-400 font-mono">{item.modelNumber}</p>
                                        <h3 className="text-sm font-semibold text-zinc-900 line-clamp-2 leading-tight">{item.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="font-black text-zinc-900">₹{Number(price).toLocaleString()}</span>
                                            {item.offerPrice && (
                                                <span className="text-xs text-zinc-400 line-through">₹{Number(item.price).toLocaleString()}</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleMoveToCart(item)}
                                            className="w-full flex items-center justify-center gap-2 bg-black text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-zinc-800 transition-colors active:scale-95"
                                        >
                                            <ShoppingCart className="w-3.5 h-3.5" />
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
