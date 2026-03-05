import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
    getCommandsByCategory,
    getCategoryBySlug,
    getAllCategorySlugs,
    getAllCategories,
} from "@/lib/commands";
import CommandCard from "@/components/CommandCard";
import CategoryBadge from "@/components/CategoryBadge";

// SSG: tüm kategori slug'larını önceden oluştur
export function generateStaticParams() {
    return getAllCategorySlugs().map((slug) => ({ slug }));
}

// Dinamik metadata
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const category = getCategoryBySlug(slug);
    if (!category) return { title: "Kategori Bulunamadı" };

    return {
        title: `${category.name} Komutları`,
        description: `${category.name} — ${category.description}. Linux ${category.name.toLowerCase()} komutlarını Türkçe öğrenin.`,
    };
}

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const category = getCategoryBySlug(slug);

    if (!category) {
        notFound();
    }

    const commands = getCommandsByCategory(slug);
    const allCategories = getAllCategories().filter((c) => c.slug !== slug);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
                <Link href="/" className="hover:text-terminal-green transition-colors">
                    Ana Sayfa
                </Link>
                <span>/</span>
                <span className="text-slate-300">{category.name}</span>
            </nav>

            {/* Category Header */}
            <div className="mb-10 animate-fade-in">
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{category.icon}</span>
                    <h1 className="text-3xl font-bold text-slate-100">{category.name}</h1>
                </div>
                <p className="text-slate-400 text-lg">{category.description}</p>
                <p className="text-sm text-slate-500 mt-2">
                    Bu kategoride <strong className="text-slate-300">{commands.length}</strong> komut bulunuyor.
                </p>
            </div>

            {/* Commands Grid */}
            {commands.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
                    {commands.map((cmd) => (
                        <CommandCard key={cmd.command} command={cmd} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-slate-500">
                    <p className="text-lg">Bu kategoride henüz komut bulunmuyor.</p>
                    <p className="text-sm mt-2">Yakında eklenecek!</p>
                </div>
            )}

            {/* Other Categories */}
            <section>
                <h2 className="text-lg font-semibold text-slate-200 mb-4">
                    📂 Diğer Kategoriler
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {allCategories.slice(0, 6).map((cat) => (
                        <CategoryBadge key={cat.slug} category={cat} />
                    ))}
                </div>
            </section>
        </div>
    );
}
