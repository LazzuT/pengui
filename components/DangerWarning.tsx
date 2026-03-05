export default function DangerWarning() {
    return (
        <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl animate-fade-in">
            <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">⚠️</span>
                <div>
                    <h3 className="text-sm font-semibold text-amber-400 mb-1">
                        Güvenlik Uyarısı
                    </h3>
                    <p className="text-sm text-amber-300/80 leading-relaxed">
                        Bu komut sistem dosyalarını değiştirebilir veya silebilir.
                        Özellikle <code className="px-1.5 py-0.5 bg-amber-500/20 rounded text-amber-300 font-mono text-xs">sudo</code> ile
                        kullanıldığında dikkatli olun.
                    </p>
                </div>
            </div>
        </div>
    );
}
