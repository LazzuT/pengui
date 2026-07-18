import { Metadata } from "next";
import FavoritesClient from "./FavoritesClient";

export const metadata: Metadata = {
    title: "Favorilerim",
    description: "Kaydettiğiniz favori Linux komutları. Sadece tarayıcınızda lokal olarak saklanır.",
    alternates: { canonical: "https://pengui.org/favoriler" },
};

export default function FavoritesPage() {
    return <FavoritesClient />;
}
