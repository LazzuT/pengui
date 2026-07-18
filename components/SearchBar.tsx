"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "@/types/command";
import { Task } from "@/types/task";
import keywordsData from "@/data/commandKeywords.json";
import tasksData from "@/data/tasks.json";
import { search as runSearch } from "@/lib/search";

interface SearchBarProps {
    commands: Command[];
    placeholder?: string;
}

const keywords = keywordsData as Record<string, string>;
const tasks = tasksData as Task[];

export default function SearchBar({
    commands,
    placeholder = "Komut ara... (ör: ls, grep, chmod)",
}: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Command[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Arama, lib/search.ts ortak motorunu kullanır. Böylece arama çubuğu da
    // keyword ve görev farkındalığı kazanır ("metin ara" -> grep gibi).
    const search = useCallback(
        (q: string) => {
            const trimmed = q.trim();
            if (!trimmed) {
                setResults([]);
                setIsOpen(false);
                return;
            }

            const { results } = runSearch(trimmed, { commands, keywords, tasks });

            setResults(results.slice(0, 8));
            setIsOpen(true);
            setSelectedIndex(-1);
        },
        [commands]
    );

    useEffect(() => {
        const timer = setTimeout(() => search(query), 300);
        return () => clearTimeout(timer);
    }, [query, search]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Keyboard navigation
    function handleKeyDown(e: React.KeyboardEvent) {
        if (!isOpen) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < results.length - 1 ? prev + 1 : 0
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev > 0 ? prev - 1 : results.length - 1
                );
                break;
            case "Enter":
                e.preventDefault();
                if (selectedIndex >= 0 && results[selectedIndex]) {
                    navigateToCommand(results[selectedIndex].command);
                } else if (results.length > 0) {
                    // Eğer seçim yapılmadıysa ve Enter'a basıldıysa ilk sonucu aç
                    navigateToCommand(results[0].command);
                }
                break;
            case "Escape":
                setIsOpen(false);
                inputRef.current?.blur();
                break;
        }
    }

    function navigateToCommand(slug: string) {
        setIsOpen(false);
        setQuery("");
        inputRef.current?.blur();
        router.push(`/komut/${slug}`);
    }

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            {/* Search Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                        className="w-5 h-5 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query && search(query)}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-4 py-4 bg-surface-card border border-border-subtle rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all text-sm sm:text-base"
                    aria-label="Komut ara"
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-controls="searchbar-listbox"
                    aria-autocomplete="list"
                    aria-activedescendant={selectedIndex >= 0 ? `searchbar-option-${selectedIndex}` : undefined}
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery("");
                            setResults([]);
                            setIsOpen(false);
                            inputRef.current?.focus();
                        }}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
                        aria-label="Aramayı temizle"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Search Results Dropdown */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    id="searchbar-listbox"
                    role="listbox"
                    aria-label="Arama sonuçları"
                    className="absolute top-full left-0 right-0 mt-2 bg-[#1e293b] border border-[#334155] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-y-auto max-h-[50vh] z-[100] animate-fade-in"
                >
                    {results.length === 0 && query.trim() !== "" ? (
                        <div className="w-full text-center px-4 py-8 text-slate-400">
                            <span className="text-2xl mb-2 block">🔍</span>
                            <p className="text-sm font-medium text-slate-300 mb-1">Komut bulunamadı</p>
                            <p className="text-xs">Daha genel terimlerle (örn. <span className="text-terminal-green">&quot;dosya sil&quot;</span> veya <span className="text-terminal-green">&quot;port tara&quot;</span>) aramayı deneyin.</p>
                        </div>
                    ) : (
                        results.map((cmd, index) => (
                            <button
                                key={cmd.command}
                                id={`searchbar-option-${index}`}
                                role="option"
                                aria-selected={index === selectedIndex}
                                onClick={() => navigateToCommand(cmd.command)}
                                className={`w-full text-left px-4 py-3 flex items-center gap-2 sm:gap-3 transition-colors ${index === selectedIndex
                                    ? "bg-surface-hover border-l-2 border-terminal-green"
                                    : "hover:bg-surface-hover border-l-2 border-transparent"
                                    }`}
                            >
                                <code className="text-terminal-green font-mono text-sm font-semibold min-w-[60px] sm:min-w-[80px] shrink-0">
                                    {cmd.command}
                                </code>
                                <span className="text-slate-400 text-sm truncate flex-1">
                                    {cmd.description_tr}
                                </span>
                                <span
                                    className={`ml-auto shrink-0 text-xs px-2 py-0.5 rounded-full badge-${cmd.difficulty}`}
                                >
                                    {cmd.difficulty}
                                </span>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
