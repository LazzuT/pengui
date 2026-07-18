"use client";

import Link from "next/link";
import { Task } from "@/types/task";

interface TaskCardProps {
    task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
    const difficultyColors = {
        kolay: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
        orta: "text-amber-400 bg-amber-400/10 border-amber-400/20",
        zor: "text-red-400 bg-red-400/10 border-red-400/20",
    };

    return (
        <div className="group relative flex flex-col h-full bg-surface-card border border-border-subtle rounded-2xl p-6 transition-all duration-300 hover:border-accent hover:shadow-[0_0_30px_rgba(56,189,248,0.1)]">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-200 line-clamp-2 pr-4 leading-tight group-hover:text-accent transition-colors">
                    {task.task}
                </h3>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full border whitespace-nowrap ${difficultyColors[task.difficulty]}`}>
                    {task.difficulty.charAt(0).toUpperCase() + task.difficulty.slice(1)}
                </span>
            </div>

            <p className="text-sm text-slate-400 mb-6 flex-grow leading-relaxed">
                {task.description}
            </p>

            <div className="space-y-4 mt-auto">
                <div className="terminal-block">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-terminal-green uppercase tracking-wider">
                            Önerilen Komut
                        </span>
                        <Link 
                            href={`/komut/${task.primary_command}`}
                            className="text-xs text-accent hover:text-accent-hover transition-colors flex items-center gap-1"
                        >
                            Detay <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                    <code className="block mt-2">
                        <span className="prompt">$ </span>
                        {task.primary_example}
                    </code>
                </div>

                {task.alternatives && task.alternatives.length > 0 && (
                    <div className="flex items-center gap-2 pt-2 border-t border-border-subtle">
                        <span className="text-xs text-slate-500 font-medium">Alternatifler:</span>
                        <div className="flex gap-2 flex-wrap">
                            {task.alternatives.map((alt) => (
                                <Link
                                    key={alt}
                                    href={`/komut/${alt}`}
                                    className="text-xs px-2 py-1 bg-surface-dark border border-border-subtle rounded-md text-slate-300 hover:border-accent hover:text-accent transition-colors"
                                >
                                    {alt}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
