import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sayfa Bulunamadı | Pengui",
    description: "Aradığınız Linux komutu veya sayfası bulunamadı.",
};

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6">
            <div className="text-center animate-slide-up">
                {/* Error Code & Icon */}
                <div className="relative mb-8">
                    <span className="text-8xl sm:text-[120px] font-black text-slate-800/50 block leading-none select-none">
                        404
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl sm:text-6xl animate-pulse">🐧</span>
                    </div>
                </div>

                {/* Headings */}
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-200 mb-4">
                    Terminal'de kayboldunuz!
                </h1>
                <p className="text-lg text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
                    Aradığınız komut veya sayfa sistemde bulunamadı. Belki yanlış bir dizin (klasör) yazdınız ya da henüz bu komutu desteklemiyoruz.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="w-full sm:w-auto px-6 py-3 bg-terminal-green text-surface-dark font-semibold rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                        Ana Sayfaya Dön
                    </Link>
                    <Link
                        href="/kategori/dosya-yonetimi"
                        className="w-full sm:w-auto px-6 py-3 bg-surface-card border border-border-subtle text-slate-300 font-semibold rounded-xl hover:border-terminal-green/50 hover:text-terminal-green transition-all"
                    >
                        Kategorilere Göz At
                    </Link>
                </div>

                {/* Terminal Hint */}
                <div className="mt-12 bg-surface-card border border-border-subtle rounded-xl p-4 inline-block text-left">
                    <code className="text-sm font-mono">
                        <span className="text-slate-500">$</span>
                        <span className="text-terminal-green ml-2">cd</span> <span className="text-slate-300">/home</span>
                    </code>
                </div>
            </div>
        </div>
    );
}
