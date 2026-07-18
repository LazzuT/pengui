import type { ReactNode } from 'react';
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
        title: `${topic.title} — Linux Rehberi`,
        description: topic.description,
        openGraph: {
            title: `${topic.title} | Pengui Linux Rehberi`,
            description: topic.description,
            url: `https://pengui.org/linux/${topic.slug}`,
            siteName: 'Pengui',
            locale: 'tr_TR',
            type: 'article',
            images: [{ url: '/og-image.png', width: 1200, height: 630, alt: topic.title }],
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

    // Basit markdown ayrıştırıcı: başlık, liste, satır içi kod, kalın metin ve
    // çok satırlı (``` ile çevrili) kod bloklarını destekler.
    const lines = topic.content.split('\n');
    const formattedContent: ReactNode[] = [];
    let codeBuffer: string[] | null = null;

    lines.forEach((paragraph, index) => {
        // Kod bloğu sınırı (```): aç/kapat
        if (paragraph.trim().startsWith('```')) {
            if (codeBuffer === null) {
                codeBuffer = [];
            } else {
                formattedContent.push(
                    <pre key={`code-${index}`} className="bg-surface-dark border border-border-subtle rounded-xl p-4 my-4 overflow-x-auto">
                        <code className="text-terminal-green font-mono text-sm leading-relaxed whitespace-pre">
                            {codeBuffer.join('\n')}
                        </code>
                    </pre>
                );
                codeBuffer = null;
            }
            return;
        }

        // Kod bloğu içindeysek satırı tampona ekle
        if (codeBuffer !== null) {
            codeBuffer.push(paragraph);
            return;
        }

        if (paragraph.startsWith('### ')) {
            formattedContent.push(
                <h3 key={index} className="text-2xl font-bold text-zinc-100 mt-8 mb-4 font-sans border-b border-zinc-800/50 pb-2">
                    {paragraph.replace('### ', '')}
                </h3>
            );
            return;
        }

        if (paragraph.startsWith('- ')) {
            const boldParsed = paragraph.replace('**', '<strong class="text-zinc-200">').replace('**', '</strong>');
            formattedContent.push(
                <li key={index} className="text-zinc-300 leading-relaxed font-sans list-disc list-inside mb-2" dangerouslySetInnerHTML={{ __html: boldParsed.replace('- ', '') }} />
            );
            return;
        }

        if (paragraph.trim() !== '') {
            const boldParsed = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-zinc-200">$1</strong>');
            const codeParsed = boldParsed.replace(/`(.*?)`/g, '<code class="bg-surface-dark text-terminal-green px-1.5 py-0.5 rounded-md font-mono text-sm">$1</code>');
            formattedContent.push(
                <p key={index} className="text-zinc-400 text-lg leading-relaxed font-sans mb-4" dangerouslySetInnerHTML={{ __html: codeParsed }} />
            );
        }
    });

    // Kapanmamış kod bloğu kaldıysa yine de render et
    if (codeBuffer !== null) {
        formattedContent.push(
            <pre key="code-tail" className="bg-surface-dark border border-border-subtle rounded-xl p-4 my-4 overflow-x-auto">
                <code className="text-terminal-green font-mono text-sm leading-relaxed whitespace-pre">
                    {(codeBuffer as string[]).join('\n')}
                </code>
            </pre>
        );
    }

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
        datePublished: '2026-03-06', // İçeriğin ilk yayın tarihi (sabit)
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
                    className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-terminal-green transition-colors bg-zinc-900/50 hover:bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-zinc-800/50"
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
                                <span className="text-xs font-bold uppercase tracking-wider text-terminal-green bg-terminal-green/10 px-2.5 py-1 rounded-md">
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
