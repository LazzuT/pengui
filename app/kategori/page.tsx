import { Metadata } from "next";
import Link from "next/link";
import { getAllCategories, getCommandCountByCategory } from "@/lib/commands";
import CategoryBadge from "@/components/CategoryBadge";

export const metadata: Metadata = {
    title: "Kategoriler",
    description:
        "Linux komutlarını kategorilere göre keşfedin. Dosya yönetimi, ağ, sistem izleme ve daha fazlası.",
};

export default function KategoriPage() {
    const categories = getAllCategories();
    const categoryCounts = getCommandCountByCategory();

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
                <Link href="/" className="hover:text-terminal-green transition-colors">
                    Ana Sayfa
                </Link>
                <span>/</span>
                <span className="text-slate-300">Kategoriler</span>
            </nav>

            {/* Header */}
            <div className="mb-10 animate-fade-in">
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">📂</span>
                    <h1 className="text-3xl font-bold text-slate-100">
                        Komut Kategorileri
                    </h1>
                </div>
                <p className="text-slate-400 text-lg">
                    Linux komutlarını kategorilere göre keşfedin. Her kategori,
                    belirli bir kullanım alanına yönelik komutları içerir.
                </p>
                <p className="text-sm text-slate-500 mt-2">
                    Toplam <strong className="text-slate-300">{categories.length}</strong> kategori
                </p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                    <CategoryBadge
                        key={cat.slug}
                        category={cat}
                        count={categoryCounts[cat.slug]}
                    />
                ))}
            </div>
        </div>
    );
}
