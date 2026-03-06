import { Metadata } from 'next';
import Link from 'next/link';
import { getAllLinuxTopics } from '@/lib/linux';

export const metadata: Metadata = {
    title: 'Linux Rehberi',
    description: 'Linux temel kavramları, işletim sistemi mimarisi ve terimler hakkında kapsamlı Türkçe rehber.',
};

export default async function LinuxIndexPage() {
    const topics = await getAllLinuxTopics();

    // Grupları categorilere göre ayır
    const categoriesObj = topics.reduce((acc, topic) => {
        if (!acc[topic.category]) {
            acc[topic.category] = [];
        }
        acc[topic.category].push(topic);
        return acc;
    }, {} as Record<string, typeof topics>);

    const categoryNames = Object.keys(categoriesObj);

    return (
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
            <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-4xl md:text-5xl font-bold font-sans tracking-tight text-white mb-6 drop-shadow-sm">
                    Linux Rehberi
                </h1>
                <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-sans">
                    Linux'un ne olduğundan en derin çekirdek mimarisine kadar uzanan temel eğitim materyalleri.
                </p>
            </div>

            <div className="space-y-12">
                {categoryNames.map((category, catIndex) => (
                    <div key={category} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${catIndex * 150}ms`, animationFillMode: 'both' }}>
                        <h2 className="text-2xl font-bold text-zinc-100 mb-6 font-sans border-b border-zinc-800/50 pb-2 inline-block">
                            {category}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categoriesObj[category].map((topic) => (
                                <Link
                                    key={topic.slug}
                                    href={`/linux/${topic.slug}`}
                                    className="group block p-6 bg-zinc-900/40 hover:bg-zinc-800/60 border border-zinc-800 hover:border-indigo-500/50 rounded-2xl transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow-indigo-500/10"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 flex items-center justify-center bg-zinc-800/50 group-hover:bg-indigo-500/20 rounded-xl text-2xl transition-colors duration-300 drop-shadow-sm">
                                            {topic.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors font-sans">
                                                {topic.title}
                                            </h3>
                                            <span className="text-xs font-semibold text-zinc-500 font-mono tracking-wider">
                                                {topic.readingTime}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-zinc-400 leading-relaxed font-sans line-clamp-2">
                                        {topic.description}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
