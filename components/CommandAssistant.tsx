"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import keywordsData from "@/data/commandKeywords.json";
import tasksData from "@/data/tasks.json";
import { Command } from "@/types/command";
import { Task } from "@/types/task";
import TaskCard from "@/components/TaskCard";
import { search, DisambiguationOption } from "@/lib/search";

interface CommandAssistantProps {
    commands: Command[];
}

// Seçili bazı popüler görevler (Empty State Chips)
const POPULAR_TASKS = [
    "Açık portları gör",
    "Çalışan süreci öldür",
    "En büyük dosyaları bul",
    "İzin değiştir"
];

export default function CommandAssistant({ commands }: CommandAssistantProps) {
    const [query, setQuery] = useState("");
    const [matchedTask, setMatchedTask] = useState<Task | null>(null);
    const [suggestion, setSuggestion] = useState<Command | null>(null);
    const [options, setOptions] = useState<DisambiguationOption[] | null>(null);

    const keywords = keywordsData as Record<string, string>;
    const tasks = tasksData as Task[];

    // Arama mantığı (disambiguation dahil) lib/search.ts ortak motorunda;
    // bileşen yalnızca sonucu state'e yazar.
    const findCommand = useCallback(
        (input: string) => {
            const result = search(input, { commands, keywords, tasks });
            setMatchedTask(result.matchedTask);
            setSuggestion(result.suggestion);
            setOptions(result.disambiguation);
        },
        [commands, keywords, tasks]
    );

    return (
        <section className="mb-16">
            <div className="bg-gradient-to-br from-surface-card to-surface-dark border border-border-subtle rounded-2xl p-6 sm:p-8">
                <h2 className="text-xl font-bold text-slate-200 mb-2 flex items-center gap-2">
                    <span>🤔</span> Ne yapmak istiyorsun?
                </h2>
                <p className="text-sm text-slate-500 mb-5">
                    Yapmak istediğiniz işlemi Türkçe yazın, size uygun komutu önerelim.
                </p>

                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            findCommand(e.target.value);
                        }}
                        placeholder="örnek: klasördeki dosyaları listele"
                        className="w-full px-4 py-3.5 bg-surface-dark border border-border-subtle rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all text-sm"
                        aria-label="Ne yapmak istiyorsun?"
                    />
                </div>

                {/* Popular Task Chips (Empty State) */}
                {!query && (
                    <div className="mt-4 flex flex-wrap gap-2 sm:gap-3 animate-fade-in">
                        {POPULAR_TASKS.map((pt) => (
                            <button
                                key={pt}
                                onClick={() => {
                                    setQuery(pt);
                                    findCommand(pt);
                                }}
                                className="text-xs px-3 py-1.5 bg-surface-dark border border-border-subtle rounded-full text-slate-400 hover:text-white hover:border-terminal-green/50 transition-colors"
                            >
                                {pt}
                            </button>
                        ))}
                    </div>
                )}

                <div aria-live="polite" role="status">
                {/* Disambiguation (belirsiz tek-kelime sorgular) */}
                {options && (
                    <div className="mt-6 animate-fade-in">
                        <p className="text-sm text-slate-400 mb-3">
                            Birden fazla olasılık var — ne yapmak istiyorsun?
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {options.map((opt) => (
                                <Link
                                    key={opt.slug + opt.label}
                                    href={`/komut/${opt.slug}`}
                                    className="flex flex-col gap-1 p-4 bg-surface-dark border border-border-subtle rounded-xl hover:border-terminal-green/50 transition-colors"
                                >
                                    <span className="text-sm font-medium text-slate-200">{opt.label}</span>
                                    <code className="text-xs text-terminal-green font-mono">$ {opt.hint}</code>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Task Match Result */}
                {!options && matchedTask && (
                    <div className="mt-6 animate-fade-in">
                        <TaskCard task={matchedTask} />
                    </div>
                )}

                {/* Fallback Legacy Keyword Suggestion */}
                {!options && !matchedTask && suggestion && (
                    <div className="mt-6 p-4 bg-surface-dark border border-terminal-green/30 rounded-xl animate-fade-in relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 blur-[1px] group-hover:opacity-20 transition-opacity">
                            <span className="text-6xl">🐧</span>
                        </div>
                        <div className="relative z-10">
                            <div className="text-xs text-slate-500 mb-2">Hızlı Komut Eşleşmesi</div>
                            <div className="terminal-block !mb-3">
                                <code>
                                    <span className="prompt">$ </span>
                                    {suggestion.examples[0]?.code || suggestion.command}
                                </code>
                            </div>
                            <p className="text-sm text-slate-400 mb-3 pr-12">
                                {suggestion.description_tr}
                            </p>
                            <Link
                                href={`/komut/${suggestion.slug}`}
                                className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors font-medium border-b border-accent/30 hover:border-accent pb-0.5"
                            >
                                Daha fazla detay ve parametreler →
                            </Link>
                        </div>
                    </div>
                )}

                {/* No Results Fallback */}
                {query && !options && !matchedTask && !suggestion && (
                    <div className="mt-6 p-4 bg-surface-dark/50 border border-border-subtle rounded-xl border-dashed">
                        <p className="text-sm text-slate-500">
                            Buna uygun bir görev veya komut bulamadım. Daha genel bir ifade yazmayı dener misiniz?
                        </p>
                    </div>
                )}
                </div>
            </div>
        </section>
    );
}
