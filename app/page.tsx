import { getAllCommands, getAllCategories, getCommandCountByCategory, getPopularCommands, getBeginnerCommands } from "@/lib/commands";
import SearchBar from "@/components/SearchBar";
import CommandCard from "@/components/CommandCard";
import CategoryBadge from "@/components/CategoryBadge";
import CommandAssistant from "@/components/CommandAssistant";

export default function HomePage() {
  const commands = getAllCommands();
  const categories = getAllCategories();
  const categoryCounts = getCommandCountByCategory();
  const popularCommands = getPopularCommands(6);
  const beginnerCommands = getBeginnerCommands(6);

  const learningPathSlugs = ["ls", "cd", "pwd", "cp", "mv", "rm", "mkdir", "cat", "grep", "chmod"];
  const learningPathCommands = learningPathSlugs
    .map(slug => commands.find(c => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* Hero Section */}
      <section className="text-center py-16 sm:py-24">
        <div className="animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-card border border-border-subtle mb-6">
            <span className="text-sm">🐧</span>
            <span className="text-xs text-slate-400">
              Yeni başlayanlar için Linux komut kütüphanesi
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Linux komutlarını{" "}
            <span className="gradient-text">Türkçe</span>{" "}
            öğrenin
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            En önemli {commands.length} Linux komutunu basit açıklamalar,
            gerçek örnekler ve detaylı parametrelerle keşfedin.
          </p>
        </div>

        {/* Search */}
        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <SearchBar commands={commands} />
        </div>

        {/* Stats */}
        <div
          className="flex items-center justify-center gap-8 mt-10 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-terminal-green">{commands.length}</div>
            <div className="text-xs text-slate-500">Komut</div>
          </div>
          <div className="w-px h-8 bg-border-subtle" />
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{categories.length}</div>
            <div className="text-xs text-slate-500">Kategori</div>
          </div>
          <div className="w-px h-8 bg-border-subtle" />
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">100%</div>
            <div className="text-xs text-slate-500">Türkçe</div>
          </div>
        </div>
      </section>

      {/* Command Assistant */}
      <CommandAssistant commands={commands} />

      {/* Terminal Learning Path */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-200">🚀 Terminal Öğrenmeye Nereden Başlamalı?</h2>
          <span className="text-sm text-slate-500">İlk 10 Komut</span>
        </div>
        <p className="text-slate-400 mb-6 max-w-3xl">
          Linux terminaline yeniyseniz, aşağıdaki 10 temel komut ile başlamanız önerilir. Bu komutlar dosya ve dizin yönetimi gibi en sık ihtiyaç duyacağınız işlemleri yapmanızı sağlar.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {learningPathCommands.map((cmd, index) => (
            <div key={cmd.slug} className="relative">
              <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-surface-dark border-2 border-terminal-green text-terminal-green flex items-center justify-center font-bold text-sm z-10 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                {index + 1}
              </span>
              <CommandCard command={cmd} />
            </div>
          ))}
        </div>
      </section>

      {/* Popular Commands */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-200">🔥 En Popüler Komutlar</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularCommands.map((cmd) => (
            <CommandCard key={cmd.slug} command={cmd} />
          ))}
        </div>
      </section>

      {/* Beginner Commands */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-200">🌱 Yeni Başlayanlar İçin</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {beginnerCommands.map((cmd) => (
            <CommandCard key={cmd.slug} command={cmd} />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-200">📂 Kategoriler</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <CategoryBadge key={cat.slug} category={cat} count={categoryCounts[cat.slug]} />
          ))}
        </div>
      </section>

      {/* All Commands Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-200">🖥️ Tüm Komutlar</h2>
          <span className="text-sm text-slate-500">{commands.length} komut</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {commands.map((cmd) => (
            <CommandCard key={cmd.slug} command={cmd} />
          ))}
        </div>
      </section>
    </div>
  );
}
