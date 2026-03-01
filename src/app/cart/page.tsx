"use client";

import { Footer } from "@/components/home/Footer";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCartStore();
    const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '');

    const handleWhatsAppOrder = () => {
        if (cart.length === 0) {
            return;
        }

        const lines = cart.map((item) => {
            const price = item.offerPrice ?? item.price;
            return `• *${item.name}*\n  Qty: ${item.quantity} × ₹${price.toLocaleString()} = ₹${(price * item.quantity).toLocaleString()}\n  Image: ${item.image}`;
        });

        const total = totalPrice();
        const message =
            `🛍️ *New Order from ImiJewel*\n\n` +
            lines.join('\n\n') +
            `\n\n━━━━━━━━━━━━━━━\n` +
            `*Total Items:* ${totalItems()}\n` +
            `*Total Amount:* ₹${total.toLocaleString()}\n\n` +
            `Please confirm availability and payment details. Thank you!`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    if (cart.length === 0) {
        return (
            <main className="min-h-screen bg-zinc-50">
                <div className="pt-20 flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                    <ShoppingBag className="w-16 h-16 text-zinc-300 mb-4" />
                    <h1 className="text-2xl font-black text-zinc-900 mb-2">Your cart is empty</h1>
                    <p className="text-zinc-500 mb-6">Add some beautiful jewellery to get started</p>
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
            <div className="pt-20">
                <div className="container mx-auto px-4 md:px-6 py-8 max-w-4xl">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <Link href="/shop" className="text-zinc-500 hover:text-zinc-700 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl uppercase md:text-3xl font-medium font-sans text-center text-black tracking-wider">
                            Shopping Cart
                            <span className="ml-2 text-base font-medium text-zinc-500">({totalItems()} items)</span>
                        </h1>
                    </div>
                    <Dialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
                        <DialogTrigger asChild>
                            <button
                                className="text-sm text-zinc-400 hover:text-red-500 transition-colors underline mb-4 mt-2"
                            >
                                Clear all items
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] rounded-3xl border-zinc-100 shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-zinc-900">Clear Shopping Cart?</DialogTitle>
                                <DialogDescription className="text-zinc-500 pt-2">
                                    This will remove all items from your cart. This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="mt-6 flex flex-row gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsClearDialogOpen(false)}
                                    className="rounded-xl border-zinc-200 w-1/2 md:w-auto text-zinc-600 hover:bg-zinc-50 h-11 font-bold"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        clearCart();
                                        setIsClearDialogOpen(false);
                                    }}
                                    className="rounded-xl bg-red-500 hover:bg-red-600 w-1/2 md:w-auto h-11 font-bold text-white shadow-lg shadow-red-500/20"
                                >
                                    Confirm Clear
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-3">
                            {cart.map((item) => {
                                const price = item.offerPrice ?? item.price;
                                return (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-2xl border border-zinc-100 p-4 flex gap-4 shadow-sm"
                                    >
                                        {/* Image */}
                                        <Link href={`/product/${item.id}`} className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-zinc-50 hover:opacity-80 transition-opacity">
                                            {item.image ? (
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-2xl">💎</div>
                                            )}
                                        </Link>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <Link href={`/product/${item.id}`}>
                                                <h3 className="font-semibold text-zinc-900 text-sm line-clamp-2 hover:text-gold transition-colors">{item.name}</h3>
                                            </Link>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-base font-black text-zinc-900">₹{(price * item.quantity).toLocaleString()}</span>
                                                {item.offerPrice && (
                                                    <span className="text-xs text-zinc-400 line-through">₹{item.price.toLocaleString()}</span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                {/* Quantity */}
                                                <div className="flex items-center gap-2 border border-zinc-200 rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                {/* Remove */}
                                                <button
                                                    onClick={() => { removeFromCart(item.id); }}
                                                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm sticky top-28">
                                <h2 className="font-black text-zinc-900 text-lg mb-4">Order Summary</h2>

                                <div className="space-y-2 text-sm border-b border-zinc-100 pb-4 mb-4">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex justify-between text-zinc-600">
                                            <Link href={`/product/${item.id}`} className="line-clamp-1 flex-1 pr-2 hover:text-gold transition-colors">
                                                {item.name} ×{item.quantity}
                                            </Link>
                                            <span className="shrink-0 font-medium">
                                                ₹{((item.offerPrice ?? item.price) * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between text-lg font-black text-zinc-900 mb-6">
                                    <span>Total</span>
                                    <span>₹{totalPrice().toLocaleString()}</span>
                                </div>

                                {/* WhatsApp Order Button */}
                                <button
                                    onClick={handleWhatsAppOrder}
                                    className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bc5a] text-white py-4 rounded-2xl font-bold text-base transition-all active:scale-95 shadow-lg shadow-green-500/20"
                                >
                                    <WhatsAppIcon className="w-6 h-6 fill-white" />
                                    Order via WhatsApp
                                </button>

                                <p className="text-xs text-zinc-400 text-center mt-3 leading-relaxed">
                                    You&apos;ll be redirected to WhatsApp to confirm your order with our team
                                </p>

                                <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                    <p className="text-xs text-amber-700 font-medium">
                                        📦 Free delivery on orders above ₹500 · Cash on Delivery available
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
