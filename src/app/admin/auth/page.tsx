"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminAuthPage() {
    const router = useRouter();
    const [email, setEmail] = useState("admin@imijewel.com");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            toast.error("Invalid credentials. Please check your email and password.");
        } else {
            toast.success("Welcome back, Admin!");
            router.push("/admin/dashboard");
            router.refresh();
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-rose-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex flex-col -space-y-1 group">
                            <span className="text-2xl font-medium font-rethink text-gold tracking-wider transition-transform group-hover:scale-105">
                                IMIJEWEL
                            </span>
                            <span className="text-[8px] md:text-[10px] font-sans font-medium tracking-[0.2em] text-gold/80 uppercase">
                                Premium Collections
                            </span>
                    </div>
                    <p className="text-zinc-400 mt-2 text-sm">Admin Panel</p>
                </div>

                {/* Card */}
                <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-white">Sign in</h2>
                        <p className="text-zinc-500 text-sm mt-1">Enter your admin credentials to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-zinc-800/60 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-colors"
                                    placeholder="admin@imijewel.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-12 py-3 bg-zinc-800/60 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-colors"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98] mt-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
