"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import keywordsData from "@/data/commandKeywords.json";
import { Command } from "@/types/command";

interface CommandAssistantProps {
    commands: Command[];
}

export default function CommandAssistant({ commands }: CommandAssistantProps) {
    const [query, setQuery] = useState("");
    const [suggestion, setSuggestion] = useState<Command | null>(null);

    const keywords = keywordsData as Record<string, string>;

    const findCommand = useCallback(
        (input: string) => {
            const q = input.toLowerCase().trim();
            if (!q) {
                setSuggestion(null);
                return;
            }

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
        [commands, keywords]
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

                {/* Suggestion */}
                {suggestion && (
                    <div className="mt-4 p-4 bg-surface-dark border border-terminal-green/30 rounded-xl animate-fade-in">
                        <div className="text-xs text-slate-500 mb-2">Önerilen komut</div>
                        <div className="terminal-block !mb-3">
                            <code>
                                <span className="prompt">$ </span>
                                {suggestion.examples[0]?.code || suggestion.command}
                            </code>
                        </div>
                        <p className="text-sm text-slate-400 mb-3">
                            {suggestion.description_tr}
                        </p>
                        <Link
                            href={`/komut/${suggestion.slug}`}
                            className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors"
                        >
                            Detayları gör →
                        </Link>
                    </div>
                )}

                {query && !suggestion && (
                    <div className="mt-4 p-4 bg-surface-dark border border-border-subtle rounded-xl">
                        <p className="text-sm text-slate-500">
                            Eşleşen komut bulunamadı. Farklı bir ifade deneyin.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
