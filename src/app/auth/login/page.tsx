"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#fef7ee] font-sans overflow-hidden">
            {/* Left Side: Form */}
            <div className="flex-1 flex items-center justify-center px-8 lg:px-16 z-10 relative">
                <div className="w-full max-w-[480px]">
                    <div className="mb-12">
                        <h1 className="text-3xl font-extrabold text-[#1a1a1a] tracking-tight mb-2">SupportIQ</h1>
                        <p className="text-zinc-500 font-medium">Welcome back. Sign in to your account.</p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-3xl rounded-[40px] border border-white/40 p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="rounded-2xl bg-red-500/5 p-4 text-xs font-bold text-red-500 border border-red-500/10">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-[#1a1a1a] ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="john@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-14 rounded-2xl border border-zinc-200/60 bg-white px-5 text-sm text-[#1a1a1a] placeholder-zinc-400 focus:border-[#ffcc33] focus:outline-none focus:ring-4 focus:ring-[#ffcc33]/10 transition-all shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-[#1a1a1a] ml-1">Password</label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-14 rounded-2xl border border-zinc-200/60 bg-white px-5 text-sm text-[#1a1a1a] placeholder-zinc-400 focus:border-[#ffcc33] focus:outline-none focus:ring-4 focus:ring-[#ffcc33]/10 transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 mt-4 rounded-2xl bg-[#ffcc33] text-[15px] font-bold text-[#1a1a1a] shadow-xl shadow-[#ffcc33]/20 hover:bg-[#ffb300] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </button>

                            <p className="text-center text-sm font-medium text-zinc-500 mt-8">
                                Don&apos;t have an account?{" "}
                                <Link href="/auth/register" className="text-[#1a1a1a] font-bold hover:underline decoration-zinc-300 underline-offset-4 transition-all">
                                    Create one for free
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>

            {/* Right Side: Visual */}
            <div className="hidden lg:flex flex-1 relative p-6 items-stretch">
                <div className="relative flex-1 rounded-[48px] overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 via-sky-100 to-indigo-100">
                    <Image
                        src="/images/register-bg.png"
                        alt="SupportIQ Interface"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

                    {/* Floating Badge - top right */}
                    <div className="absolute top-8 right-8 bg-white/80 backdrop-blur-xl p-4 rounded-3xl shadow-xl border border-white/60">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-400/20 flex items-center justify-center text-blue-600 flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-[#1a1a1a]">Secure & Encrypted</p>
                                <p className="text-[10px] text-zinc-500">Enterprise-grade security</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats badge - bottom left */}
                    <div className="absolute bottom-8 left-8 bg-white/80 backdrop-blur-xl p-4 rounded-3xl shadow-xl border border-white/60">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-[#1a1a1a]">AI Productivity</p>
                                <p className="text-[10px] text-zinc-500">+40% response efficiency</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
