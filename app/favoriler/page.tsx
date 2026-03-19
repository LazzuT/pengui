import { Metadata } from "next";
import FavoritesClient from "./FavoritesClient";

export const metadata: Metadata = {
    title: "Favorilerim | Pengui",
    description: "Kaydettiğiniz favori Linux komutları. Sadece tarayıcınızda lokal olarak saklanır.",
};

export default function FavoritesPage() {
    return <FavoritesClient />;
}
