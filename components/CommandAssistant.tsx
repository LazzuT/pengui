"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import keywordsData from "@/data/commandKeywords.json";
import tasksData from "@/data/tasks.json";
import { Command } from "@/types/command";
import { Task } from "@/types/task";
import TaskCard from "@/components/TaskCard";

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

    const keywords = keywordsData as Record<string, string>;
    const tasks = tasksData as Task[];

    const findCommand = useCallback(
        (input: string) => {
            const q = input.toLowerCase().trim();
            if (!q) {
                setMatchedTask(null);
                setSuggestion(null);
                return;
            }

            let bestTask: Task | null = null;
            let highestScore = 0;

            tasks.forEach((t) => {
                let score = 0;
                
                // 1. Exact primary command match (Highest Priority)
                if (t.primary_command.toLowerCase() === q) score += 50;
                
                // 2. Exact alternative command match
                if (t.alternatives.some((alt) => alt.toLowerCase() === q)) score += 40;
                
                // 3. Task title match
                if (t.task.toLowerCase().includes(q)) score += 30;
                
                // 4. Description match (only for words > 3 chars)
                if (q.length > 3 && t.description.toLowerCase().includes(q)) score += 10;
                
                if (score > highestScore) {
                    highestScore = score;
                    bestTask = t;
                }
            });

            if (bestTask) {
                setMatchedTask(bestTask);
                setSuggestion(null);
                return;
            }

            // Task eşleşmediyse temizle ve fallback ara
            setMatchedTask(null);

            // 2) Mevcut Keywords Logic (Fallback)
            // Exact keyword match first
            if (keywords[q]) {
                const cmd = commands.find((c) => c.slug === keywords[q]);
                if (cmd) { setSuggestion(cmd); return; }
            }

            // Partial keyword match
            for (const [keyword, slug] of Object.entries(keywords)) {
                if (keyword.includes(q) || q.includes(keyword)) {
                    const cmd = commands.find((c) => c.slug === slug);
                    if (cmd) { setSuggestion(cmd); return; }
                }
            }

            // Fallback: search in command descriptions
            const found = commands.find(
                (c) =>
                    c.description_tr.toLowerCase().includes(q) ||
                    c.command.toLowerCase().includes(q)
            );
            setSuggestion(found || null);
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
                                className="text-xs px-3 py-1.5 bg-surface-dark border border-border-default rounded-full text-slate-400 hover:text-white hover:border-terminal-green/50 transition-colors"
                            >
                                {pt}
                            </button>
                        ))}
                    </div>
                )}

                {/* Task Match Result */}
                {matchedTask && (
                    <div className="mt-6 animate-fade-in">
                        <TaskCard task={matchedTask} />
                    </div>
                )}

                {/* Fallback Legacy Keyword Suggestion */}
                {!matchedTask && suggestion && (
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
                {query && !matchedTask && !suggestion && (
                    <div className="mt-6 p-4 bg-surface-dark/50 border border-border-default rounded-xl border-dashed">
                        <p className="text-sm text-slate-500">
                            Buna uygun bir görev veya komut bulamadım. Daha genel bir ifade yazmayı dener misiniz?
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
