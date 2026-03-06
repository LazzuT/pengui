import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllLinuxTopics, getLinuxTopicBySlug } from '@/lib/linux';

export async function generateStaticParams() {
    const topics = await getAllLinuxTopics();
    return topics.map((topic) => ({
        slug: topic.slug,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const topic = await getLinuxTopicBySlug(slug);

    if (!topic) {
        return {
            title: 'Bulunamadı | Pengui',
        };
    }

    return {
        title: `${topic.title} | Pengui Linux Rehberi`,
        description: topic.description,
        openGraph: {
            title: `${topic.title} | Pengui Linux Rehberi`,
            description: topic.description,
            url: `https://pengui.org/linux/${topic.slug}`,
            siteName: 'Pengui',
            locale: 'tr_TR',
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${topic.title} | Pengui Linux Rehberi`,
            description: topic.description,
        },
        alternates: {
            canonical: `https://pengui.org/linux/${topic.slug}`,
        },
    };
}

export default async function LinuxTopicPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const topic = await getLinuxTopicBySlug(slug);

    if (!topic) {
        notFound();
    }

    // Parse markdown-like syntax for the current JSON payload (supporting simple newlines, bold, bullets)
    // This helps to convert the raw strings into readable HTML until a robust MDX parser is placed
    const formattedContent = topic.content
        .split('\n')
        .map((paragraph, index) => {
            if (paragraph.startsWith('### ')) {
                return (
                    <h3 key={index} className="text-2xl font-bold text-zinc-100 mt-8 mb-4 font-sans border-b border-zinc-800/50 pb-2">
                        {paragraph.replace('### ', '')}
                    </h3>
                );
            }

            if (paragraph.startsWith('- ')) {
                // Parse bold texts inside lists
                const boldParsed = paragraph.replace('**', '<strong class="text-zinc-200">').replace('**', '</strong>');
                return (
                    <li key={index} className="text-zinc-300 leading-relaxed font-sans list-disc list-inside mb-2" dangerouslySetInnerHTML={{ __html: boldParsed.replace('- ', '') }} />
                );
            }

            // Detect code blocks (rudimentary regex for triple backticks)
            if (paragraph.startsWith('```')) {
                return null; // A more comprehensive markdown parser would be needed for perfect block generation. This fits our current JSON.
            }

            // Standard text with bold support
            if (paragraph.trim() !== '') {
                const boldParsed = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-zinc-200">$1</strong>');
                const codeParsed = boldParsed.replace(/`(.*?)`/g, '<code class="bg-zinc-800/50 text-indigo-300 px-1.5 py-0.5 rounded-md font-mono text-sm">$1</code>');
                return (
                    <p key={index} className="text-zinc-400 text-lg leading-relaxed font-sans mb-4" dangerouslySetInnerHTML={{ __html: codeParsed }} />
                );
            }
            return null;
        });

    // JSON-LD TechArticle Construction
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: topic.title,
        description: topic.description,
        author: {
            '@type': 'Organization',
            name: 'Pengui',
        },
        publisher: {
            '@type': 'Organization',
            name: 'Pengui',
            logo: {
                '@type': 'ImageObject',
                url: 'https://pengui.org/screenshot.png'
            }
        },
        url: `https://pengui.org/linux/${topic.slug}`,
        datePublished: new Date().toISOString().split('T')[0], // For SSG, dynamically setting the build date roughly
        dateModified: new Date().toISOString().split('T')[0],
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Link
                    href="/linux"
                    className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-indigo-400 transition-colors bg-zinc-900/50 hover:bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-zinc-800/50"
                >
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Rehbere Dön
                </Link>
            </div>

            <article className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
                <header className="mb-10 text-center md:text-left border-b border-zinc-800/50 pb-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="w-20 h-20 mx-auto md:mx-0 flex items-center justify-center bg-zinc-800/50 rounded-2xl text-4xl shadow-sm border border-zinc-700/30">
                            {topic.icon}
                        </div>
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md">
                                    {topic.category}
                                </span>
                                <span className="text-xs font-semibold text-zinc-500 font-mono tracking-wider flex items-center">
                                    <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {topic.readingTime}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold font-sans tracking-tight text-white mb-4">
                                {topic.title}
                            </h1>
                            <p className="text-lg text-zinc-400 font-sans leading-relaxed">
                                {topic.description}
                            </p>
                        </div>
                    </div>
                </header>

                <div className="prose prose-invert prose-zinc max-w-none">
                    {formattedContent}
                </div>
            </article>

            {/* İleride Sonraki Konu navigasyonu buraya eklenebilir */}
        </div>
    );
}
