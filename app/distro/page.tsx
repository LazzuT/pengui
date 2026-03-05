import Link from "next/link";
import { Metadata } from "next";
import { getAllDistros, getCommandCountByDistro } from "@/lib/commands";

export const metadata: Metadata = {
    title: "Linux Dağıtımları",
    description: "Arch Linux, Ubuntu, Debian ve Fedora dağıtımlarına özel komutlar ve paket yöneticileri.",
    openGraph: {
        title: "Linux Dağıtımları | Pengui",
        description: "Arch Linux, Ubuntu, Debian ve Fedora dağıtımlarına özel komutlar.",
        url: "https://pengui.org/distro",
        siteName: "Pengui",
        locale: "tr_TR",
    },
};

export default function DistroPage() {
    const distros = getAllDistros();
    const distroCounts = getCommandCountByDistro();

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            {/* Header */}
            <div className="mb-10 animate-fade-in">
                <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <Link href="/" className="hover:text-terminal-green transition-colors">Ana Sayfa</Link>
                    <span>/</span>
                    <span className="text-slate-300">Dağıtımlar</span>
                </nav>
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                    🐧 Linux <span className="gradient-text">Dağıtımları</span>
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                    Her Linux dağıtımının kendine özgü paket yöneticileri ve araçları vardır.
                    Kullandığınız dağıtıma özel komutları keşfedin.
                </p>
            </div>

            {/* Distro Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
                {distros.map((distro) => (
                    <Link
                        key={distro.slug}
                        href={`/distro/${distro.slug}`}
                        className="group block p-6 bg-surface-card border border-border-subtle rounded-2xl hover:border-accent/50 hover:bg-surface-hover transition-all duration-200 hover:shadow-lg hover:shadow-accent/5"
                    >
                        <div className="flex items-start gap-4">
                            <span className="text-4xl">{distro.icon}</span>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-white group-hover:text-accent transition-colors mb-1">
                                    {distro.name}
                                </h2>
                                <p className="text-sm text-slate-400 leading-relaxed mb-3">
                                    {distro.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs">
                                    <span className="px-2.5 py-1 bg-surface-dark rounded-full text-slate-300">
                                        📦 {distro.packageManager}
                                    </span>
                                    <span className="text-slate-500">
                                        {distroCounts[distro.slug] || 0} komut
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Info */}
            <div className="bg-surface-card border border-border-subtle rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-3">💡 Hangi dağıtımı seçmeliyim?</h3>
                <div className="space-y-3 text-sm text-slate-400">
                    <p>
                        <strong className="text-slate-300">Yeni başlıyorsanız:</strong> Ubuntu veya Debian ile başlamanız önerilir. Geniş topluluk desteği ve bol kaynak mevcuttur.
                    </p>
                    <p>
                        <strong className="text-slate-300">İleri seviye kullanıcılar:</strong> Arch Linux tam kontrol ve öğrenme deneyimi sunar.
                    </p>
                    <p>
                        <strong className="text-slate-300">Sunucu ve kurumsal:</strong> Fedora/RHEL ekosistemi güçlü kurumsal destek sağlar.
                    </p>
                </div>
            </div>
        </div>
    );
}
