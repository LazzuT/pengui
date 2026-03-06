import { Metadata } from "next";
import Link from "next/link";
import { getAllCommands } from "@/lib/commands";

export const metadata: Metadata = {
    title: "Hakkında",
    description:
        "Pengui hakkında bilgi. AI destekli geliştirme süreci ve proje hikâyesi.",
};

export default function AboutPage() {
    const commands = getAllCommands();

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
                <Link href="/" className="hover:text-terminal-green transition-colors">
                    Ana Sayfa
                </Link>
                <span>/</span>
                <span className="text-slate-300">Hakkında</span>
            </nav>

            {/* Header */}
            <div className="mb-12 animate-fade-in">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
                    Hakkında
                </h1>
                <p className="text-lg text-slate-400 leading-relaxed">
                    Pengui, Türkiye&apos;de Linux öğrenmek isteyen herkes için
                    oluşturulmuş bir açık kaynak komut referans platformudur.
                </p>
            </div>

            {/* Story Section */}
            <section className="mb-12 animate-fade-in" style={{ animationDelay: "0.05s" }}>
                <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <span>🎯</span> Neden Pengui?
                </h2>
                <div className="bg-surface-card border border-border-subtle rounded-xl p-6 space-y-4">
                    <p className="text-slate-400 leading-relaxed">
                        Linux öğrenmeye başladığınızda karşılaştığınız en büyük engellerden biri,
                        komutların çoğunun İngilizce açıklanmış olmasıdır. Türkçe kaynaklar ise
                        genellikle dağınık blog yazıları şeklinde olup güncelliğini yitirmiştir.
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                        <strong className="text-slate-300">Pengui</strong>, bu boşluğu doldurmak
                        için oluşturuldu. Amacımız, en önemli {commands.length} Linux komutunu basit Türkçe
                        açıklamalar, gerçek kullanım örnekleri ve detaylı parametrelerle sunmaktır.
                    </p>
                </div>
            </section>

            {/* Build in Public Section */}
            <section className="mb-12 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <span>🤖</span> AI ile Build in Public
                </h2>
                <div className="bg-surface-card border border-border-subtle rounded-xl p-6 space-y-4">
                    <p className="text-slate-400 leading-relaxed">
                        Bu proje, <strong className="text-accent">AI destekli geliştirme</strong>{" "}
                        metodolojisi ile &quot;build in public&quot; (herkese açık geliştirme) yaklaşımı
                        benimsenerek oluşturulmuştur.
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                        Kodun büyük bölümü AI araçları kullanılarak yazılmış, tasarım kararları
                        ve mimari yapı insan-AI iş birliğiyle şekillendirilmiştir. Bu süreç,
                        modern yazılım geliştirmenin geleceğine dair önemli bir deney niteliğindedir.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <span className="px-3 py-1.5 bg-surface-dark border border-border-subtle rounded-lg text-xs text-slate-400">
                            Next.js 15
                        </span>
                        <span className="px-3 py-1.5 bg-surface-dark border border-border-subtle rounded-lg text-xs text-slate-400">
                            TypeScript
                        </span>
                        <span className="px-3 py-1.5 bg-surface-dark border border-border-subtle rounded-lg text-xs text-slate-400">
                            TailwindCSS v4
                        </span>
                        <span className="px-3 py-1.5 bg-surface-dark border border-border-subtle rounded-lg text-xs text-slate-400">
                            Vercel
                        </span>
                    </div>
                </div>
            </section>

            {/* Target Audience */}
            <section className="mb-12 animate-fade-in" style={{ animationDelay: "0.15s" }}>
                <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <span>👥</span> Kimler İçin?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        {
                            icon: "🎓",
                            title: "Üniversite Öğrencileri",
                            desc: "Bilgisayar mühendisliği ve yazılım bölümü öğrencileri",
                        },
                        {
                            icon: "🚀",
                            title: "Yeni Başlayanlar",
                            desc: "Linux dünyasına ilk adımını atanlar",
                        },
                        {
                            icon: "💻",
                            title: "Geliştiriciler",
                            desc: "Terminal becerilerini geliştirmek isteyenler",
                        },
                        {
                            icon: "📚",
                            title: "Sertifika Adayları",
                            desc: "LPIC ve CompTIA Linux+ sınavlarına hazırlananlar",
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="p-5 bg-surface-card border border-border-subtle rounded-xl"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-xl">{item.icon}</span>
                                <h3 className="text-sm font-semibold text-slate-200">
                                    {item.title}
                                </h3>
                            </div>
                            <p className="text-sm text-slate-400">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact / Contribute */}
            <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="bg-gradient-to-r from-surface-card to-surface-dark border border-border-subtle rounded-xl p-6 text-center">
                    <h2 className="text-lg font-semibold text-slate-200 mb-2">
                        Katkıda Bulunun
                    </h2>
                    <p className="text-sm text-slate-400 mb-4">
                        Bu projeye katkıda bulunmak, hata bildirmek veya öneride bulunmak
                        isterseniz bize ulaşabilirsiniz.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-card border border-accent/30 rounded-lg text-accent text-sm hover:bg-surface-hover transition-colors cursor-pointer">
                        <span>📧</span>
                        <span>iletisim@pengui.org</span>
                    </div>
                </div>
            </section>
        </div>
    );
}
