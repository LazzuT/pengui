export default function Loading() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10" role="status" aria-live="polite">
            <div className="animate-pulse space-y-6">
                <div className="h-4 w-48 bg-surface-card rounded" />
                <div className="h-10 w-40 bg-surface-card rounded" />
                <div className="h-24 w-full bg-surface-card rounded-xl" />
                <div className="h-12 w-full bg-surface-card rounded-xl" />
                <div className="h-40 w-full bg-surface-card rounded-xl" />
            </div>
            <span className="sr-only">Komut yükleniyor</span>
        </div>
    );
}
