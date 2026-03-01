'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Image, Package, Settings, LogOut, Menu, X, ChevronRight, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/hero-content', label: 'Hero Content', icon: Image },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/management', label: 'Management', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin/auth');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-white">
                    <Gem className="w-8 h-8 text-rose-400 animate-pulse" />
                    <p className="text-sm text-zinc-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="fixed inset-0 flex overflow-hidden bg-zinc-50">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 bottom-0 left-0 z-50 w-64 bg-zinc-950 border-r border-white/5 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Logo */}
                <div className="flex items-center justify-start px-6 border-b border-white/5">
                    <Link href="/admin/dashboard" className="text-xl font-black text-white">
                        <div className="text-center my-2.5">
                            <div className="flex flex-col -space-y-1 group">
                                <span className="text-2xl font-medium font-rethink text-rose-400 tracking-wider transition-transform group-hover:scale-105">
                                    IMIJEWEL
                                </span>
                                <span className="text-[8px] md:text-[10px] font-sans font-medium tracking-[0.2em] text-rose-400/80 uppercase">
                                    Premium Collections
                                </span>
                            </div>
                        </div>
                    </Link>
                    <button className="lg:hidden text-zinc-400" onClick={() => setSidebarOpen(false)}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto pt-6">
                    {navLinks.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href || pathname.startsWith(href + '/');
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                                    isActive
                                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                )}
                            >
                                <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-rose-400' : 'text-zinc-500 group-hover:text-white')} />
                                {label}
                                {isActive && <ChevronRight className="w-3 h-3 ml-auto text-rose-400/60" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User / Logout */}
                <div className="p-3 border-t border-white/5">
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                        <div className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                            <span className="text-rose-400 text-xs font-bold">A</span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-zinc-300 truncate">{session.user?.email}</p>
                            <p className="text-[10px] text-zinc-600">Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/admin/auth' })}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top bar */}
                <header className="h-16 bg-white border-b border-zinc-100 flex items-center justify-between px-4 md:px-6 shrink-0">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg hover:bg-zinc-100 transition-colors"
                    >
                        <Menu className="w-5 h-5 text-zinc-600" />
                    </button>

                    <div className="flex items-center gap-3 ml-auto">
                        <Link
                            href="/"
                            target="_blank"
                            className="text-xs text-zinc-500 hover:text-zinc-700 transition-colors hidden md:block"
                        >
                            View Store ↗
                        </Link>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="mx-auto max-w-6xl">{children}</div>
                </main>
            </div>
        </div>
    );
}
