"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useFavorites } from "@/hooks/useFavorites";
import commandsData from "@/data/commands.json";
import { Command } from "@/types/command";
import CommandCard from "@/components/CommandCard";

export default function FavoritesClient() {
    const { favorites, isLoaded } = useFavorites();
    const allCommands = commandsData as Command[];

    const favoriteCommands = useMemo(() => {
        return allCommands.filter((cmd) => favorites.includes(cmd.slug));
    }, [allCommands, favorites]);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
                <Link href="/" className="hover:text-terminal-green transition-colors">
                    Ana Sayfa
                </Link>
                <span>/</span>
                <span className="text-slate-300">Favorilerim</span>
            </nav>

            {/* Header */}
            <div className="mb-10 animate-fade-in">
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">⭐</span>
                    <h1 className="text-3xl font-bold text-slate-100">Favori Komutlarım</h1>
                </div>
                <p className="text-slate-400 text-lg">
                    Daha sonra kolayca erişmek için kaydettiğiniz komutlar.
                </p>
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl inline-block max-w-2xl">
                    <p className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="text-amber-400 pt-0.5">🔒</span>
                        <span><strong>Sadece Sizde:</strong> Favori listeniz hiçbir sunucuya gönderilmez, yalnızca kullandığınız tarayıcıda saklanır. Cihaz değiştirir veya verileri temizlerseniz listeniz sıfırlanır.</span>
                    </p>
                </div>
            </div>

            {/* Content */}
            {!isLoaded ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-terminal-green/30 border-t-terminal-green rounded-full animate-spin"></div>
                </div>
            ) : favoriteCommands.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16 animate-fade-in">
                    {favoriteCommands.map((cmd) => (
                        <CommandCard key={cmd.slug} command={cmd} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 px-4 bg-surface-dark border border-border-subtle rounded-2xl border-dashed animate-fade-in">
                    <div className="text-6xl mb-4 opacity-50 grayscale">🐧</div>
                    <h2 className="text-xl font-semibold text-slate-200 mb-2">Henüz favori komutunuz yok</h2>
                    <p className="text-slate-400 max-w-md mx-auto mb-6">
                        Öğrenirken sık kullandığınız veya faydalı bulduğunuz komutların yanındaki ⭐ ikonuna tıklayarak onları buraya kaydedebilirsiniz.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-terminal-green text-surface-dark font-medium hover:bg-terminal-green/90 transition-colors"
                    >
                        Komutları Keşfet
                    </Link>
                </div>
            )}
        </div>
    );
}
