import { Metadata } from "next";
import Link from "next/link";
import { getAllLearningModules } from "@/lib/learning";

export const metadata: Metadata = {
    title: "Linux Öğrenme Rotası",
    description: "Sıfırdan ileri seviyeye Linux terminalini ve dosya sistemini adım adım öğrenin.",
};

export default function OgrenPage() {
    const modules = getAllLearningModules();

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <div className="text-center mb-12 animate-slide-up">
                <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                    Linux <span className="text-terminal-green">Öğrenme Rotası</span>
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                    Terminal korkunuzu yenin. Sıfırdan başlayarak Linux dosya sistemini, izinleri ve temel komutları mantığıyla anlayın.
                </p>
            </div>

            <div className="space-y-6">
                {modules.map((mod, index) => (
                    <Link
                        key={mod.slug}
                        href={`/ogren/${mod.slug}`}
                        className="block group bg-surface-card border border-border-subtle hover:border-terminal-green/50 rounded-2xl p-6 transition-all animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="flex items-start gap-4">
                            <div className="text-3xl mt-1">{mod.icon}</div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-sm font-bold text-slate-500">Adım {index + 1}</span>
                                    <h2 className="text-xl font-bold text-slate-200 group-hover:text-terminal-green transition-colors">
                                        {mod.title}
                                    </h2>
                                </div>
                                <p className="text-slate-400 leading-relaxed">
                                    {mod.description}
                                </p>
                                {mod.commands && mod.commands.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {mod.commands.slice(0, 5).map(cmd => (
                                            <span key={cmd} className="text-xs px-2 py-1 bg-surface-dark border border-border-subtle rounded-md text-slate-300 font-mono">
                                                {cmd}
                                            </span>
                                        ))}
                                        {mod.commands.length > 5 && (
                                            <span className="text-xs px-2 py-1 text-slate-500">+{mod.commands.length - 5} komut</span>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="hidden sm:flex items-center text-slate-500 group-hover:text-terminal-green transition-colors">
                                <span className="text-2xl">→</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div >
    );
}
