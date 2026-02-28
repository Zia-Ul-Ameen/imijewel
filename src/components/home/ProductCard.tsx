"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Tag } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useWishlistStore } from "@/stores/wishlist.store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const addToCart = useCartStore((s) => s.addToCart);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

    const price = Number(product.price);
    const offerPrice = product.offerPrice ? Number(product.offerPrice) : null;
    const image = product.images?.[0]?.url || '';
    const inWishlist = isInWishlist(product.id);
    const discount = offerPrice && price ? Math.round(((price - offerPrice) / price) * 100) : 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.stock === 0) {
            toast.error("Out of stock");
            return;
        }
        addToCart({
            id: product.id,
            name: product.name,
            modelNumber: product.modelNumber,
            price,
            offerPrice: offerPrice ?? undefined,
            image,
        });
        toast.success("Added to cart");
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (inWishlist) {
            removeFromWishlist(product.id);
            toast.success("Removed from wishlist");
        } else {
            addToWishlist({
                id: product.id,
                name: product.name,
                modelNumber: product.modelNumber,
                price,
                offerPrice: offerPrice ?? undefined,
                image,
            });
            toast.success("Added to wishlist");
        }
    };

    return (
        <Link href={`/product/${product.id}`} className="group relative block">
            <div className="relative bg-white rounded-2xl overflow-hidden border border-zinc-100 hover:border-zinc-200 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                {/* Image */}
                <div className="relative aspect-square bg-zinc-50 overflow-hidden">
                    {image ? (
                        <Image
                            src={image}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100">
                            <span className="text-4xl">💎</span>
                        </div>
                    )}

                    {/* Out of stock overlay */}
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-white/90 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Out of Stock
                            </span>
                        </div>
                    )}

                    {/* Discount badge */}
                    {discount > 0 && (
                        <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wide">
                            -{discount}%
                        </div>
                    )}

                    {/* Wishlist button */}
                    <button
                        onClick={handleWishlist}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <Heart
                            className={cn(
                                "w-4 h-4 transition-colors",
                                inWishlist ? "fill-rose-500 text-rose-500" : "text-zinc-600"
                            )}
                        />
                    </button>
                </div>

                {/* Info */}
                <div className="p-3 space-y-2">
                    {/* Category/Brand */}
                    {(product.categoryName || product.brandName) && (
                        <div className="flex items-center gap-1">
                            <Tag className="w-3 h-3 text-zinc-400" />
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
                                {product.categoryName || product.brandName}
                            </span>
                        </div>
                    )}

                    <div>
                        <p className="text-xs text-zinc-400 font-mono mb-0.5">{product.modelNumber}</p>
                        <h3 className="text-sm font-semibold text-zinc-900 line-clamp-2 leading-tight">
                            {product.name}
                        </h3>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                        {offerPrice ? (
                            <>
                                <span className="text-base font-black text-zinc-900">₹{offerPrice.toLocaleString()}</span>
                                <span className="text-xs text-zinc-400 line-through">₹{price.toLocaleString()}</span>
                            </>
                        ) : (
                            <span className="text-base font-black text-zinc-900">₹{price.toLocaleString()}</span>
                        )}
                    </div>

                    {/* Add to Cart */}
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className={cn(
                            "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-200",
                            product.stock === 0
                                ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                                : "bg-black text-white hover:bg-zinc-800 active:scale-95"
                        )}
                    >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Add to Cart
                    </button>
                </div>
            </div>
        </Link>
    );
};
