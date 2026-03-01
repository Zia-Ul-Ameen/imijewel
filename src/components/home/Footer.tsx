import Link from "next/link";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export const Footer = () => {
    return (
        <footer className="bg-zinc-950 border-t border-zinc-900">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="flex flex-col -space-y-1 group">
                            <span className="text-2xl font-medium font-rethink text-gold tracking-wider transition-transform group-hover:scale-105">
                                IMIJEWEL
                            </span>
                            <span className="text-[8px] md:text-[10px] font-sans font-medium tracking-[0.2em] text-gold/80 uppercase">
                                Premium Collections
                            </span>
                        </Link>
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
                            Timeless elegance for the modern soul. Discover our curated collection of premium jewellery designed to make every moment unforgettable.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-gold hover:bg-zinc-800 transition-all duration-300">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-gold hover:bg-zinc-800 transition-all duration-300">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-gold hover:bg-zinc-800 transition-all duration-300">
                                <WhatsAppIcon className="w-5 h-5 fill-current" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Collection</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/shop" className="text-zinc-500 hover:text-gold transition-colors text-sm">
                                    All Jewellery
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop?category=Necklace" className="text-zinc-500 hover:text-gold transition-colors text-sm">
                                    Necklaces
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop?category=Earrings" className="text-zinc-500 hover:text-gold transition-colors text-sm">
                                    Earrings
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop?category=Rings" className="text-zinc-500 hover:text-gold transition-colors text-sm">
                                    Designer Rings
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Customer Care</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="#" className="text-zinc-500 hover:text-gold transition-colors text-sm">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-zinc-500 hover:text-gold transition-colors text-sm">
                                    Shipping & Delivery
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-zinc-500 hover:text-gold transition-colors text-sm">
                                    Returns Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Contact</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-zinc-500">
                                <Mail className="w-5 h-5 text-gold shrink-0" />
                                <span className="text-sm">hello@imijewel.com</span>
                            </li>
                            <li className="flex items-start gap-3 text-zinc-500">
                                <Phone className="w-5 h-5 text-gold shrink-0" />
                                <span className="text-sm">+91 91765 43210</span>
                            </li>
                            <li className="flex items-start gap-3 text-zinc-500">
                                <MapPin className="w-5 h-5 text-gold shrink-0" />
                                <span className="text-sm">Mumbai, Maharashtra</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-zinc-900 pt-8 mt-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-zinc-600 text-[10px] uppercase tracking-widest">
                            © 2026 <span className="text-zinc-400 font-bold">IMIJEWEL</span>. All rights reserved.
                        </p>
                        <div className="flex gap-8">
                            <span className="text-zinc-700 text-[10px] uppercase tracking-widest">Handcrafted in India</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
