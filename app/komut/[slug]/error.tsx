"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function CommandError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="max-w-xl mx-auto px-4 py-32 text-center" role="alert">
            <div className="text-6xl mb-4">🐧</div>
            <h1 className="text-2xl font-bold text-slate-100 mb-3">Komut yüklenemedi</h1>
            <p className="text-slate-400 mb-8">
                Bu komut sayfası gösterilirken bir hata oluştu.
            </p>
            <div className="flex items-center justify-center gap-3">
                <button
                    onClick={reset}
                    className="px-6 py-3 rounded-xl bg-terminal-green text-surface-dark font-medium hover:bg-terminal-green/90 transition-colors"
                >
                    Tekrar Dene
                </button>
                <Link
                    href="/"
                    className="px-6 py-3 rounded-xl bg-surface-card border border-border-subtle text-slate-300 hover:bg-surface-hover transition-colors"
                >
                    Ana Sayfa
                </Link>
            </div>
        </div>
    );
}
