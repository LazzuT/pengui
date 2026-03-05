import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
    getDistroBySlug,
    getAllDistroSlugs,
    getCommandsByDistro,
} from "@/lib/commands";
import CommandCard from "@/components/CommandCard";

export function generateStaticParams() {
    return getAllDistroSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const distro = getDistroBySlug(slug);
    if (!distro) return { title: "Dağıtım Bulunamadı" };

    return {
        title: `${distro.name} Komutları`,
        description: `${distro.name} dağıtımına özel Linux komutları. Paket yöneticisi: ${distro.packageManager}.`,
        openGraph: {
            title: `${distro.name} Komutları | Pengui`,
            description: `${distro.name} Linux komutları ve paket yönetimi.`,
            url: `https://pengui.org/distro/${slug}`,
            siteName: "Pengui",
            locale: "tr_TR",
        },
    };
}

export default async function DistroDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const distro = getDistroBySlug(slug);

    if (!distro) {
        notFound();
    }

    const commands = getCommandsByDistro(slug);
    const allDistroSlugs = getAllDistroSlugs();

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
                <Link href="/" className="hover:text-terminal-green transition-colors">Ana Sayfa</Link>
                <span>/</span>
                <Link href="/distro" className="hover:text-terminal-green transition-colors">Dağıtımlar</Link>
                <span>/</span>
                <span className="text-slate-300">{distro.name}</span>
            </nav>

            {/* Header */}
            <div className="mb-10 animate-fade-in">
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-5xl">{distro.icon}</span>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white">
                            {distro.name}
                        </h1>
                        <span className="text-sm text-slate-400">Paket Yöneticisi: <code className="text-accent font-mono">{distro.packageManager}</code></span>
                    </div>
                </div>
                <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
                    {distro.description}
                </p>
            </div>

            {/* Commands */}
            {commands.length > 0 ? (
                <section className="mb-16">
                    <h2 className="text-xl font-bold text-slate-200 mb-6">
                        📦 {distro.name} Komutları
                        <span className="text-sm font-normal text-slate-500 ml-2">{commands.length} komut</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {commands.map((cmd) => (
                            <CommandCard key={cmd.slug} command={cmd} />
                        ))}
                    </div>
                </section>
            ) : (
                <div className="mb-16 p-6 bg-surface-card border border-border-subtle rounded-xl text-center">
                    <p className="text-slate-400">Bu dağıtıma özel komut henüz eklenmemiş.</p>
                </div>
            )}

            {/* Other Distros */}
            <section>
                <h2 className="text-lg font-semibold text-slate-200 mb-4">Diğer Dağıtımlar</h2>
                <div className="flex flex-wrap gap-3">
                    {allDistroSlugs
                        .filter((s) => s !== slug)
                        .map((s) => {
                            const d = getDistroBySlug(s);
                            if (!d) return null;
                            return (
                                <Link
                                    key={s}
                                    href={`/distro/${s}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-surface-card border border-border-subtle rounded-lg hover:border-accent/50 hover:bg-surface-hover transition-all text-sm"
                                >
                                    <span>{d.icon}</span>
                                    <span className="text-slate-300">{d.name}</span>
                                </Link>
                            );
                        })}
                </div>
            </section>
        </div>
    );
}
