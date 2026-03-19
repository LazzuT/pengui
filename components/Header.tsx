"use client";

import Link from "next/link";
import { useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { favorites, isLoaded } = useFavorites();

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
                            href="/linux"
                            className="text-sm text-slate-300 hover:text-terminal-green transition-colors relative group"
                        >
                            Linux Rehberi
                            <span className="absolute -top-2 -right-3 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                        </Link>
                        <Link
                            href="/ogren"
                            className="text-sm font-semibold text-terminal-green hover:opacity-80 transition-opacity"
                        >
                            Öğren
                        </Link>
                        <Link
                            href="/kategori"
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
                        
                        {/* Desktop Favorites Link */}
                        <Link
                            href="/favoriler"
                            className="text-sm text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1.5 ml-2 pl-4 border-l border-border-subtle"
                        >
                            <span>⭐</span>
                            Favorilerim
                            {isLoaded && favorites.length > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-surface-dark border border-border-default text-slate-400 leading-none">
                                    {favorites.length}
                                </span>
                            )}
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
                                href="/linux"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm text-slate-300 hover:text-terminal-green transition-colors px-2 py-1 flex items-center justify-between"
                            >
                                Linux Rehberi
                                <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 text-[10px] uppercase font-bold tracking-wider">YENİ</span>
                            </Link>
                            <Link
                                href="/ogren"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm font-semibold text-terminal-green hover:opacity-80 transition-opacity px-2 py-1"
                            >
                                Öğren
                            </Link>
                            <Link
                                href="/kategori"
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
                            
                            {/* Mobile Favorites Link */}
                            <div className="border-t border-border-subtle mt-2 pt-2">
                                <Link
                                    href="/favoriler"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-sm text-slate-300 hover:text-amber-400 transition-colors px-2 py-1 flex items-center gap-2"
                                >
                                    <span>⭐</span>
                                    <span>Favorilerim</span>
                                    {isLoaded && favorites.length > 0 && (
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-surface-dark border border-border-default text-slate-400 leading-none">
                                            {favorites.length}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}
