import Link from "next/link";
import { Command, CATEGORIES } from "@/types/command";

interface CommandCardProps {
    command: Command;
}

export default function CommandCard({ command }: CommandCardProps) {
    const category = CATEGORIES.find((c) => c.slug === command.category);

    return (
        <Link
            href={`/komut/${command.slug}`}
            className="group block p-5 bg-surface-card border border-border-subtle rounded-xl hover:border-accent/50 hover:bg-surface-hover transition-all duration-200 hover:shadow-lg hover:shadow-accent/5"
        >
            <div className="flex items-start justify-between mb-2">
                <code className="text-lg font-mono font-bold text-terminal-green group-hover:text-accent transition-colors">
                    {command.command}
                </code>
                <span className={`text-xs px-2 py-0.5 rounded-full badge-${command.difficulty}`}>
                    {command.difficulty}
                </span>
            </div>
            {category && (
                <div className="mb-2">
                    <span className="text-xs text-slate-500 bg-surface-dark px-2 py-0.5 rounded-full">
                        {category.icon} {category.name}
                    </span>
                </div>
            )}
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
                {command.description_tr}
            </p>
            <div className="flex items-center gap-2">
                <div className="terminal-block !rounded-md">
                    <code className="!p-2 !text-xs">
                        <span className="prompt">$ </span>
                        {command.examples[0]?.code || command.command}
                    </code>
                </div>
            </div>
        </Link>
    );
}
