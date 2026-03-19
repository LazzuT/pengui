import { useState, useEffect } from "react";

const STORAGE_KEY = "pengui_favorites";

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial load from localStorage
    useEffect(() => {
        const loadFavorites = () => {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    setFavorites(JSON.parse(stored));
                }
            } catch (error) {
                console.error("Failed to load favorites", error);
            } finally {
                setIsLoaded(true);
            }
        };

        loadFavorites();

        // Sync state across different components
        window.addEventListener("favoritesChanged", loadFavorites);
        return () => window.removeEventListener("favoritesChanged", loadFavorites);
    }, []);

    // Toggle favorite status
    const toggleFavorite = (slug: string) => {
        setFavorites((prev) => {
            let newFavorites: string[];
            if (prev.includes(slug)) {
                newFavorites = prev.filter((s) => s !== slug);
            } else {
                newFavorites = Array.from(new Set([...prev, slug]));
            }

            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
            } catch (error) {
                console.warn("Failed to save favorites to localStorage. Storage quota exceeded or disabled.", error);
            }
            
            // Dispatch a custom event so other components (like Header) can sync
            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("favoritesChanged"));
            }

            return newFavorites;
        });
    };

    const isFavorite = (slug: string) => favorites.includes(slug);

    return { favorites, toggleFavorite, isFavorite, isLoaded };
}
