import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
    getCommandBySlug,
    getAllCommandSlugs,
    getRelatedCommands,
    getCategoryBySlug,
} from "@/lib/commands";
import { getLearningModuleBySlug } from "@/lib/learning";
import DangerWarning from "@/components/DangerWarning";
import CopyButton from "@/components/CopyButton";

// Yeni hafif uyarı bileşenimiz (sadece bu dosyada veya global olabilir, buraya inline koyalım)
function InfoWarning({ text }: { text: string }) {
    return (
        <div className="mb-8 animate-fade-in bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex items-start gap-3">
            <span className="text-xl mt-0.5">ℹ️</span>
            <p className="text-sm text-slate-200 leading-relaxed max-w-[95%]">
                <strong className="text-orange-400 font-semibold mr-1">Not:</strong>
                <span dangerouslySetInnerHTML={{ __html: text.replace(/`([^`]+)`/g, '<code class="text-orange-300 bg-orange-500/10 px-1 py-0.5 rounded font-mono">$1</code>') }} />
            </p>
        </div>
    );
}

// SSG: tüm komut slug'larını önceden oluştur
export function generateStaticParams() {
    return getAllCommandSlugs().map((slug) => ({ slug }));
}

// Dinamik metadata
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const command = getCommandBySlug(slug);
    if (!command) return { title: "Komut Bulunamadı" };

    return {
        title: `${command.command} komutu`,
        description: `${command.command} Linux komutu: ${command.description_tr}. Türkçe açıklama, kullanım örnekleri ve parametreler.`,
        openGraph: {
            title: `${command.command} komutu | Pengui`,
            description: `${command.command} Linux komutu: ${command.detail_tr}`,
            url: `https://pengui.org/komut/${command.slug}`,
            siteName: "Pengui",
            locale: "tr_TR",
            type: "article",

        },
        twitter: {
            card: "summary_large_image",
            title: `${command.command} komutu | Pengui`,
            description: command.description_tr,
        },
        alternates: {
            canonical: `https://pengui.org/komut/${command.slug}`,
        }
    };
}

export default async function CommandPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const command = getCommandBySlug(slug);

    if (!command) {
        notFound();
    }

    const category = getCategoryBySlug(command.category);
    const relatedCommands = getRelatedCommands(command);

    // Öğrenme rotası kontrolü
    const firstCommandsModule = getLearningModuleBySlug("ilk-komutlar");
    const isInLearningPath = firstCommandsModule?.commands?.includes(command.slug);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": `${command.command} Komutu Nedir ve Nasıl Kullanılır?`,
        "description": command.description_tr,
        "author": {
            "@type": "Organization",
            "name": "Pengui"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Pengui",
            "url": "https://pengui.org"
        },
        "datePublished": "2026-03-04",
        "dateModified": new Date().toISOString().split('T')[0]
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
                <Link href="/" className="hover:text-terminal-green transition-colors">
                    Ana Sayfa
                </Link>
                <span>/</span>
                {category && (
                    <>
                        <Link
                            href={`/kategori/${category.slug}`}
                            className="hover:text-terminal-green transition-colors"
                        >
                            {category.name}
                        </Link>
                        <span>/</span>
                    </>
                )}
                <span className="text-slate-300">{command.command}</span>
            </nav>

            {/* Learning Path Banner */}
            {isInLearningPath && (
                <div className="mb-8 animate-fade-in bg-terminal-green/10 border border-terminal-green/30 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🚀</span>
                        <p className="text-sm text-slate-200">
                            Bu komut <strong className="text-terminal-green">Linux öğrenme rotasında</strong> yer alır.
                        </p>
                    </div>
                    <Link
                        href="/ogren/ilk-komutlar"
                        className="text-sm font-semibold text-terminal-green hover:underline shrink-0"
                    >
                        Rotayı Gör →
                    </Link>
                </div>
            )}

            {/* Danger Warning */}
            {command.dangerous && <DangerWarning />}

            {/* General Info / Install Warning */}
            {command.warning && <InfoWarning text={command.warning} />}

            {/* Header */}
            <div className="mb-10 animate-fade-in">
                <div className="flex items-center gap-4 mb-4 flex-wrap">
                    <h1 className="text-3xl sm:text-4xl font-bold font-mono text-terminal-green">
                        {command.command}
                    </h1>
                    <span className={`text-xs px-3 py-1 rounded-full badge-${command.difficulty}`}>
                        {command.difficulty}
                    </span>
                    {category && (
                        <Link
                            href={`/kategori/${category.slug}`}
                            className="text-xs px-3 py-1 rounded-full bg-surface-card border border-border-subtle text-slate-400 hover:text-accent hover:border-accent/50 transition-all"
                        >
                            {category.icon} {category.name}
                        </Link>
                    )}
                </div>
                <p className="text-lg text-slate-300">{command.description_tr}</p>
            </div>

            {/* Detail */}
            <section className="mb-10 animate-fade-in" style={{ animationDelay: "0.05s" }}>
                <h2 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                    <span>📖</span> Açıklama
                </h2>
                <p className="text-slate-400 leading-relaxed bg-surface-card border border-border-subtle rounded-xl p-5">
                    {command.detail_tr}
                </p>
            </section>

            {/* Ne Zaman Kullanılır */}
            <section className="mb-10 animate-fade-in" style={{ animationDelay: "0.08s" }}>
                <h2 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                    <span>🎯</span> Ne Zaman Kullanılır?
                </h2>
                <div className="bg-surface-card border border-border-subtle rounded-xl p-5">
                    <p className="text-slate-400 leading-relaxed text-sm">
                        <code className="text-terminal-green font-mono">{command.command}</code> komutu, sistemde temel olarak <strong>{category?.name || command.category}</strong> senaryolarında, <em>{command.description_tr.toLowerCase()}</em> ihtiyacı duyulduğunda tercih edilir.
                    </p>
                </div>
            </section>

            {/* Syntax */}
            <section className="mb-10 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <h2 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                    <span>⌨️</span> Sözdizimi
                </h2>
                <div className="terminal-block group relative">
                    <code>
                        <span className="prompt">$ </span>
                        {command.syntax}
                    </code>
                    <CopyButton text={command.syntax} />
                </div>
            </section>

            {/* Options */}
            {command.options.length > 0 && (
                <section className="mb-10 animate-fade-in" style={{ animationDelay: "0.15s" }}>
                    <h2 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                        <span>🔧</span> Seçenekler (Parametreler)
                    </h2>
                    <div className="bg-surface-card border border-border-subtle rounded-xl max-w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[500px]">
                            <thead>
                                <tr className="border-b border-border-subtle">
                                    <th className="text-left px-5 py-3 text-sm font-semibold text-slate-300">Parametre</th>
                                    <th className="text-left px-5 py-3 text-sm font-semibold text-slate-300">Açıklama</th>
                                </tr>
                            </thead>
                            <tbody>
                                {command.options.map((opt, idx) => (
                                    <tr key={opt.flag} className={idx !== command.options.length - 1 ? "border-b border-border-subtle" : ""}>
                                        <td className="px-5 py-3">
                                            <code className="text-accent font-mono text-sm font-semibold">{opt.flag}</code>
                                        </td>
                                        <td className="px-5 py-3 text-sm text-slate-400">{opt.desc_tr}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {/* Examples */}
            <section className="mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <span>💡</span> Gerçek Kullanım Senaryosu
                </h2>
                <div className="space-y-6">
                    {command.examples.map((ex, idx) => (
                        <div key={idx} className="bg-surface-card border border-border-subtle hover:border-terminal-green/30 transition-colors rounded-xl overflow-hidden">
                            <div className="px-5 py-4 border-b border-border-subtle bg-surface-dark/50">
                                <p className="text-sm text-slate-200 font-medium">{ex.desc_tr}</p>
                            </div>
                            <div className="terminal-block !rounded-none !border-0 group relative !bg-transparent !p-5">
                                <code>
                                    <span className="text-slate-500 mr-2">$</span>
                                    <span className="text-slate-100">{ex.code}</span>
                                </code>
                                <CopyButton text={ex.code} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Related Commands */}
            {(relatedCommands.length > 0 || command.related.length > 0) && (
                <section className="mb-10 animate-fade-in" style={{ animationDelay: "0.25s" }}>
                    <h2 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                        <span>🔗</span> Benzer Komutlar
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {relatedCommands.map((rel) => (
                            <Link
                                key={rel.command}
                                href={`/komut/${rel.slug}`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-surface-card border border-border-subtle rounded-lg hover:border-terminal-green/50 hover:bg-surface-hover transition-all text-sm group"
                            >
                                <code className="text-terminal-green group-hover:text-accent transition-colors font-mono font-semibold">{rel.command}</code>
                                <span className="text-slate-500">—</span>
                                <span className="text-slate-400">{rel.description_tr}</span>
                            </Link>
                        ))}
                        {command.related
                            .filter((s) => !relatedCommands.find((r) => r.slug === s))
                            .map((s) => (
                                <span key={s} className="inline-flex items-center px-3 py-1.5 bg-surface-card border border-border-subtle rounded-lg text-sm text-slate-500">
                                    <code className="font-mono">{s}</code>
                                </span>
                            ))}
                    </div>
                </section>
            )}

            {/* Category Link */}
            {category && (
                <div className="pt-6 border-t border-border-subtle">
                    <Link
                        href={`/kategori/${category.slug}`}
                        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-accent transition-colors"
                    >
                        <span>{category.icon}</span>
                        <span>{category.name} kategorisindeki diğer komutları görüntüle →</span>
                    </Link>
                </div>
            )}
        </div>
    );
}
