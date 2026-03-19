"use client";

import { useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";

interface FavoriteButtonProps {
    slug: string;
}

export default function FavoriteButton({ slug }: FavoriteButtonProps) {
    const { isFavorite, toggleFavorite, isLoaded } = useFavorites();
    const [showToast, setShowToast] = useState(false);

    // Render an invisible placeholder outline while loading to prevent CLS
    if (!isLoaded) {
        return <div className="w-9 h-9 opacity-0"></div>;
    }

    const isActive = isFavorite(slug);

    const handleClick = () => {
        toggleFavorite(slug);
        
        // Show success toast briefly if added
        if (!isActive) {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }
    };

    return (
        <div className="relative inline-flex items-center">
            <button
                onClick={handleClick}
                className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                    isActive 
                    ? "bg-amber-400/20 text-amber-400 border border-amber-400/30 hover:bg-amber-400/30" 
                    : "bg-surface-dark border border-border-default text-slate-400 hover:text-amber-400 hover:border-amber-400/30"
                }`}
                title="Favorilere Ekle"
                aria-label="Favorilere Ekle"
            >
                <svg
                    className={`w-5 h-5 transition-transform duration-300 ${isActive ? "fill-current scale-110" : "fill-transparent"}`}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            </button>

            {/* Subtle Toast Feedback */}
            {showToast && (
                <div className="absolute top-1/2 -right-3 sm:-right-4 transform translate-x-full -translate-y-1/2 flex items-center bg-surface-dark border border-border-default/50 rounded-md px-3 py-1.5 shadow-lg animate-fade-in z-10 whitespace-nowrap">
                    <span className="text-xs font-medium text-emerald-400">Favorilere Eklendi</span>
                </div>
            )}
        </div>
    );
}
