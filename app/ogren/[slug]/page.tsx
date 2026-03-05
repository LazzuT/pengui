import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getLearningModuleBySlug, getAllLearningModules } from "@/lib/learning";
import { getAllCommands, getCommandBySlug } from "@/lib/commands";
import CommandCard from "@/components/CommandCard";

export function generateStaticParams() {
    return getAllLearningModules().map((mod) => ({ slug: mod.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const module = getLearningModuleBySlug(slug);

    if (!module) return { title: "Modül Bulunamadı" };

    return {
        title: `${module.title} | Linux Öğren | Pengui`,
        description: module.description,
    };
}

export default async function LearningModulePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const module = getLearningModuleBySlug(slug);

    if (!module) {
        notFound();
    }

    const commandsList = (module.commands || [])
        .map(cmdSlug => getCommandBySlug(cmdSlug))
        .filter((c): c is NonNullable<typeof c> => c !== undefined);

    // Bütün modülleri alıp sonrakini/öncekini bulalım
    const allModules = getAllLearningModules();
    const currentIndex = allModules.findIndex(m => m.slug === slug);
    const prevModule = currentIndex > 0 ? allModules[currentIndex - 1] : null;
    const nextModule = currentIndex < allModules.length - 1 ? allModules[currentIndex + 1] : null;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
                <Link href="/" className="hover:text-terminal-green transition-colors">
                    Ana Sayfa
                </Link>
                <span>/</span>
                <Link href="/ogren" className="hover:text-terminal-green transition-colors">
                    Öğren
                </Link>
                <span>/</span>
                <span className="text-slate-300">{module.title}</span>
            </nav>

            {/* Header */}
            <div className="mb-10 animate-fade-in">
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl">{module.icon}</span>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-200">
                        {module.title}
                    </h1>
                </div>
                <p className="text-lg text-slate-400">{module.description}</p>
            </div>

            {/* Content */}
            <section className="mb-12 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <div className="prose prose-invert prose-slate max-w-none prose-h3:text-terminal-green prose-a:text-terminal-green hover:prose-a:text-accent prose-pre:bg-surface-dark prose-pre:border prose-pre:border-border-subtle bg-surface-card border border-border-subtle rounded-2xl p-6 sm:p-8">
                    {/* Basit bir markdown işleyici yerine direkt bölerek render edelim veya react-markdown da kurulabilirdi,
                        ancak string'i basit HTML formatına dönüştürelim (basit markdown formatımız var) */}
                    <div dangerouslySetInnerHTML={{
                        __html: module.content
                            .replace(/### (.*?)\n/g, '<h3>$1</h3>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            .replace(/\`([^`]+)\`/g, '<code class="text-terminal-green bg-surface-dark px-1.5 py-0.5 rounded-md">$1</code>')
                            .replace(/\n\n/g, '</p><p class="mt-4 mb-4 text-slate-300 leading-relaxed">')
                            .replace(/^> (.*?)$/gm, '<blockquote class="border-l-4 border-terminal-green pl-4 italic text-slate-400 my-4">$1</blockquote>')
                            .replace(/- (.*?)\n/g, '<li class="ml-4 list-disc text-slate-300">$1</li>')
                            + '</p>' // en sondaki p'yi kapat
                    }} className="text-slate-300 leading-relaxed [&>p:first-child]:mt-0" />
                </div>
            </section>

            {/* Commands List if any */}
            {commandsList.length > 0 && (
                <section className="mb-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                    <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
                        <span>🧰</span> Bu Bölümdeki Komutlar
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {commandsList.map((cmd) => (
                            <CommandCard key={cmd.slug} command={cmd} />
                        ))}
                    </div>
                </section>
            )}

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border-subtle animate-fade-in" style={{ animationDelay: "0.3s" }}>
                {prevModule ? (
                    <Link
                        href={`/ogren/${prevModule.slug}`}
                        className="w-full sm:w-auto flex flex-col p-4 rounded-xl border border-border-subtle bg-surface-card hover:border-terminal-green/50 transition-colors"
                    >
                        <span className="text-xs text-slate-500 mb-1">← Önceki Adım</span>
                        <span className="font-semibold text-slate-300">{prevModule.title}</span>
                    </Link>
                ) : <div />}

                {nextModule ? (
                    <Link
                        href={`/ogren/${nextModule.slug}`}
                        className="w-full sm:w-auto flex flex-col p-4 rounded-xl border border-border-subtle bg-surface-card hover:border-terminal-green/50 transition-colors sm:text-right"
                    >
                        <span className="text-xs text-slate-500 mb-1">Sonraki Adım →</span>
                        <span className="font-semibold text-terminal-green">{nextModule.title}</span>
                    </Link>
                ) : (
                    <Link
                        href="/ogren"
                        className="w-full sm:w-auto px-6 py-4 rounded-xl border border-border-subtle bg-surface-card hover:bg-surface-hover text-center font-semibold text-slate-300 transition-colors"
                    >
                        Rotayı Tamamladınız 🎉
                    </Link>
                )}
            </div>
        </div>
    );
}
