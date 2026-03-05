"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="glass sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="text-2xl">🐧</span>
                        <span className="text-xl font-bold gradient-text group-hover:opacity-80 transition-opacity">
                            Pengui
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="/"
                            className="text-sm text-slate-300 hover:text-terminal-green transition-colors"
                        >
                            Ana Sayfa
                        </Link>
                        <Link
                            href="/ogren"
                            className="text-sm font-semibold text-terminal-green hover:opacity-80 transition-opacity"
                        >
                            Öğren
                        </Link>
                        <Link
                            href="/kategori/dosya-yonetimi"
                            className="text-sm text-slate-300 hover:text-terminal-green transition-colors"
                        >
                            Kategoriler
                        </Link>
                        <Link
                            href="/distro"
                            className="text-sm text-slate-300 hover:text-terminal-green transition-colors"
                        >
                            Dağıtımlar
                        </Link>
                        <Link
                            href="/hakkinda"
                            className="text-sm text-slate-300 hover:text-terminal-green transition-colors"
                        >
                            Hakkında
                        </Link>
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
                        aria-label="Menüyü aç"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <nav className="md:hidden pb-4 border-t border-border-subtle pt-4 animate-fade-in">
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm text-slate-300 hover:text-terminal-green transition-colors px-2 py-1"
                            >
                                Ana Sayfa
                            </Link>
                            <Link
                                href="/ogren"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm font-semibold text-terminal-green hover:opacity-80 transition-opacity px-2 py-1"
                            >
                                Öğren
                            </Link>
                            <Link
                                href="/kategori/dosya-yonetimi"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm text-slate-300 hover:text-terminal-green transition-colors px-2 py-1"
                            >
                                Kategoriler
                            </Link>
                            <Link
                                href="/distro"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm text-slate-300 hover:text-terminal-green transition-colors px-2 py-1"
                            >
                                Dağıtımlar
                            </Link>
                            <Link
                                href="/hakkinda"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm text-slate-300 hover:text-terminal-green transition-colors px-2 py-1"
                            >
                                Hakkında
                            </Link>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}
