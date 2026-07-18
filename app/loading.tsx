export default function Loading() {
    return (
        <div
            className="flex flex-col items-center justify-center py-32 gap-4"
            role="status"
            aria-live="polite"
        >
            <div className="w-10 h-10 border-4 border-terminal-green/30 border-t-terminal-green rounded-full animate-spin" />
            <p className="text-sm text-slate-500">Yükleniyor…</p>
            <span className="sr-only">İçerik yükleniyor</span>
        </div>
    );
}
