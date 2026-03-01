"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Tag } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
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

import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export const ProductCard = ({ product }: ProductCardProps) => {
    const addToCart = useCartStore((s) => s.addToCart);
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '');

    const price = Number(product.price);
    const offerPrice = product.offerPrice ? Number(product.offerPrice) : null;
    const image = product.images?.[0]?.url || '';
    const discount = offerPrice && price ? Math.round(((price - offerPrice) / price) * 100) : 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.stock === 0) {
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
    };

    const handleWhatsAppClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const currentPrice = offerPrice || price;
        const productUrl = `${window.location.origin}/product/${product.id}`;
        const message =
            `🛍️ *Inquiry from ImiJewel*\n\n` +
            `• *Product:* ${product.name}\n` +
            `• *Price:* ₹${currentPrice.toLocaleString()}\n` +
            `• *Image:* ${image}\n` +
            `• *Link:* ${productUrl}\n\n` +
            `Please confirm availability and more details. Thank you!`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };


    return (
        <Link href={`/product/${product.id}`} className="group relative block">
            <div className="relative bg-white rounded-3xl p-1 border border-zinc-100 hover:border-zinc-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Image Container */}
                <div className="relative aspect-square bg-[#F3F4F6] rounded-2xl overflow-hidden">
                    {image ? (
                        <Image
                            src={image}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
                            <span className="text-4xl grayscale opacity-20 transition-all duration-500 group-hover:scale-110 group-hover:opacity-40">💎</span>
                        </div>
                    )}

                    {/* Badge - Top Left */}
                    <div className="absolute top-2 left-2 z-10">
                        {discount > 0 ? (
                            <span className="p-1 bg-white/90 backdrop-blur-sm text-gold text-[10px] font-bold uppercase tracking-wider rounded-full border border-gold/10 shadow-sm">
                                -{discount}% Off
                            </span>
                        ) : (
                            <span className="p-1 bg-white/90 backdrop-blur-sm text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded-full border border-emerald-100 shadow-sm">
                                New Arrival
                            </span>
                        )}
                    </div>

                    {/* Out of stock overlay */}
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20">
                            <span className="bg-white text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                                Out of Stock
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-1">
                    {/* Title */}
                    <div className="px-1 pt-1">
                        <h3 className="text-lg font-bold text-zinc-900 line-clamp-2 leading-tight tracking-tight mb-2 transition-colors">
                            {product.name}
                        </h3>
                    </div>

                    {/* Bottom Section: Price & Actions */}
                    <div className="flex px-1 pt-2 items-center justify-between gap-2 border-t border-zinc-100">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest leading-none mb-1">Price</span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-lg font-bold text-zinc-900 tracking-tight">
                                    ₹{(offerPrice || price).toLocaleString()}
                                </span>
                                {offerPrice && (
                                    <span className="text-xs text-zinc-400 line-through decoration-rose-300/50">
                                        ₹{price.toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={handleWhatsAppClick}
                                className="p-2.5 rounded-full bg-[#5BD066] text-emerald-600 hover:bg-[#5BD066]/90 transition-all duration-300 active:scale-90"
                                title="Enquire on WhatsApp"
                            >
                                <WhatsAppIcon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className={cn(
                                    "p-2.5 rounded-full transition-all duration-300 shadow-sm",
                                    product.stock === 0
                                        ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                                        : "bg-gold text-white hover:bg-gold/90 hover:shadow-lg hover:shadow-gold/20 active:scale-90 shadow-md shadow-gold/10"
                                )}
                            >
                                <ShoppingCart className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};
