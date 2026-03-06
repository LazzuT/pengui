import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-border-subtle mt-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-3">
                            <span className="text-xl">🐧</span>
                            <span className="text-lg font-bold gradient-text">Pengui</span>
                        </Link>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Türkçe Linux komut referansı. Yeni başlayanlar için
                            basit ve anlaşılır açıklamalar.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-200 mb-3">Hızlı Bağlantılar</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-sm text-slate-400 hover:text-terminal-green transition-colors">
                                    Ana Sayfa
                                </Link>
                            </li>
                            <li>
                                <Link href="/kategori" className="text-sm text-slate-400 hover:text-terminal-green transition-colors">
                                    Kategoriler
                                </Link>
                            </li>
                            <li>
                                <Link href="/hakkinda" className="text-sm text-slate-400 hover:text-terminal-green transition-colors">
                                    Hakkında
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* AI Badge */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-200 mb-3">Proje Hakkında</h3>
                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-card border border-border-subtle">
                            <span className="text-sm">🤖</span>
                            <span className="text-xs text-slate-400">
                                Bu site AI destekli olarak geliştirilmiştir
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-10 pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} Pengui — Tüm hakları saklıdır.
                    </p>
                    <p className="text-xs text-slate-500">
                        Made with 💚 for the Turkish Linux community
                    </p>
                </div>
            </div>
        </footer>
    );
}
