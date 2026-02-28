import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="bg-zinc-950 border-t border-zinc-800">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div>
                        <h3 className="text-2xl font-rethink font-bold text-white mb-4">
                            SBAZ<span className="text-zinc-400">WIDE</span>
                        </h3>
                        <p className="text-zinc-400 mb-4">
                            Luxury looks. Smart value. Experience iconic design aesthetics without the luxury price tag.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                                    Mens
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                                    Womens
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Customer Service</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                                    Shipping Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                                    Returns & Exchanges
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                                    FAQs
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-zinc-400">
                                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span>support@sbazwide.com</span>
                            </li>
                            <li className="flex items-start gap-2 text-zinc-400">
                                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-start gap-2 text-zinc-400">
                                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span>123 Fashion Street, NY 10001</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-zinc-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-zinc-500 text-sm">
                            © 2026 <span className="font-rethink">SBAZWIDE</span>. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <Link href="#" className="text-zinc-500 hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="text-zinc-500 hover:text-white transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
