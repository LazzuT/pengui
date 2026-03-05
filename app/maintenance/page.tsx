import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Pengui Hazırlanıyor',
    description: 'Linux komutlarını Türkçe öğrenmenin en kolay yolu çok yakında burada.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function MaintenancePage() {
    return (
        <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center text-white overflow-hidden selection:bg-indigo-500/30">

            {/* Arkaplan Işık Efekti */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,50,60,0.5)_0%,rgba(9,9,11,1)_70%)] pointer-events-none" />

            {/* İçerik */}
            <div className="relative z-10 text-center px-6 max-w-lg animate-in fade-in zoom-in duration-700">
                <div className="text-7xl mb-8 drop-shadow-2xl">🐧</div>

                <h1 className="text-4xl md:text-5xl font-bold font-sans tracking-tight text-zinc-100 mb-6 drop-shadow-lg">
                    Pengui hazırlanıyor
                </h1>

                <p className="text-zinc-400 text-lg md:text-xl leading-relaxed font-sans font-medium">
                    Linux komutlarını Türkçe öğrenmenin <br className="hidden md:block" />
                    en kolay yolu çok yakında burada.
                </p>
            </div>

            {/* Gizli Preview Linki */}
            <div className="absolute bottom-6 text-center w-full">
                <Link
                    href="/preview"
                    className="text-zinc-800 hover:text-zinc-600 text-xs font-sans transition-colors duration-300"
                >
                    Private preview için: /preview
                </Link>
            </div>
        </div>
    );
}
