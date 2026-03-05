import Link from "next/link";
import { Category } from "@/types/command";

interface CategoryBadgeProps {
    category: Category;
    count?: number;
}

export default function CategoryBadge({ category, count }: CategoryBadgeProps) {
    return (
        <Link
            href={`/kategori/${category.slug}`}
            className="group flex items-center gap-3 p-4 bg-surface-card border border-border-subtle rounded-xl hover:border-accent/50 hover:bg-surface-hover transition-all duration-200"
        >
            <span className="text-2xl">{category.icon}</span>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-200 group-hover:text-accent transition-colors">
                        {category.name}
                    </h3>
                    {count !== undefined && (
                        <span className="text-xs text-slate-500 bg-surface-dark px-2 py-0.5 rounded-full">
                            {count}
                        </span>
                    )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {category.description}
                </p>
            </div>
            <svg
                className="w-4 h-4 text-slate-500 group-hover:text-accent group-hover:translate-x-1 transition-all"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </Link>
    );
}
