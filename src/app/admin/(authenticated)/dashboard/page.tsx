'use client';

import { useEffect, useState } from 'react';
import { Package, Image as ImageIcon, Tag, Gem } from 'lucide-react';
import Link from 'next/link';

interface Stats {
    products: number;
    heroSlides: number;
    categories: number;
    brands: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats>({ products: 0, heroSlides: 0, categories: 0, brands: 0 });

    useEffect(() => {
        Promise.all([
            fetch('/api/products?limit=1').then(r => r.json()),
            fetch('/api/hero-content/all').then(r => r.json()),
            fetch('/api/categories').then(r => r.json()),
            fetch('/api/brands').then(r => r.json()),
        ]).then(([products, hero, cats, brands]) => {
            setStats({
                products: products?.products?.length || 0,
                heroSlides: Array.isArray(hero) ? hero.length : 0,
                categories: Array.isArray(cats) ? cats.length : 0,
                brands: Array.isArray(brands) ? brands.length : 0,
            });
        }).catch(console.error);
    }, []);

    const cards = [
        { label: 'Products', value: stats.products, icon: Package, href: '/admin/products', color: 'bg-blue-50 text-blue-600 border-blue-100' },
        { label: 'Hero Slides', value: stats.heroSlides, icon: ImageIcon, href: '/admin/hero-content', color: 'bg-rose-50 text-rose-600 border-rose-100' },
        { label: 'Categories', value: stats.categories, icon: Tag, href: '/admin/management', color: 'bg-purple-50 text-purple-600 border-purple-100' },
        { label: 'Brands', value: stats.brands, icon: Gem, href: '/admin/management', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-zinc-900">Dashboard</h1>
                <p className="text-sm text-zinc-500 mt-1">Welcome to ImiJewel Admin Panel</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map(({ label, value, icon: Icon, href, color }) => (
                    <Link key={label} href={href} className="group">
                        <div className={`bg-white rounded-2xl border p-5 hover:shadow-md transition-all group-hover:-translate-y-0.5 ${color.split(' ')[2]}`}>
                            <div className={`inline-flex p-2.5 rounded-xl ${color.split(' ').slice(0, 2).join(' ')} mb-3`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <p className="text-3xl font-black text-zinc-900">{value}</p>
                            <p className="text-sm text-zinc-500 mt-0.5">{label}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl p-6 text-white">
                <h2 className="text-lg font-bold mb-1">Quick Actions</h2>
                <p className="text-sm text-rose-100 mb-4">Manage your store content</p>
                <div className="flex flex-wrap gap-3">
                    <Link href="/admin/products" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold transition-colors">
                        + Add Product
                    </Link>
                    <Link href="/admin/hero-content" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold transition-colors">
                        + Add Hero Slide
                    </Link>
                    <Link href="/admin/management" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold transition-colors">
                        Manage Categories
                    </Link>
                </div>
            </div>
        </div>
    );
}
