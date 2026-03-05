export interface LearningModule {
    slug: string;
    title: string;
    description: string;
    content: string;
    icon: string;
    commands?: string[]; // Array of command slugs related to this module
}

export const learningModules: LearningModule[] = [
    {
        slug: "terminal-nedir",
        title: "Terminal Nedir?",
        description: "Linux terminali (CLI) hakkında temel bilgiler ve neden grafik arayüzden (GUI) farklı olduğu.",
        icon: "🖥️",
        content: `Terminal (veya komut satırı arayüzü - CLI), bilgisayarınızla metin tabanlı olarak iletişim kurmanızı sağlayan bir araçtır. 

Fare ile klasörlere tıklamak yerine, bilgisayara ne yapması gerektiğini doğrudan metin komutları yazarak söylersiniz. 

### Neden Terminal Kullanmalıyım?
1. **Hız ve Verimlilik:** Otomasyon ve tekrarlayan görevlerde fare kullanmaktan çok daha hızlıdır.
2. **Güç:** Grafiksel arayüzlerin (GUI) sunmadığı detaylı ayarlara ve sistem dosyalarına erişim sağlar.
3. **Uzak Yönetim:** Sunucuları (server) yönetirken genellikle grafiksel bir arayüz bulunmaz; her şey terminal üzerinden SSH ile yapılır.

> İlk başta siyah bir ekran korkutucu gelebilir, ancak mantığını kavradığınızda bilgisayarınız üzerinde "süper güçler" kazanmış gibi hissedeceksiniz.`
    },
    {
        slug: "linux-dosya-sistemi",
        title: "Linux Dosya Sistemi",
        description: "Kök dizin (/), kullanıcı dizini (~) ve ana klasör yapısı (bin, etc, var) nasıl çalışır?",
        icon: "🗂️",
        content: `Linux dosya sistemi bir ağaç yapısına benzer. Windows'taki "C:" veya "D:" sürücüleri yerine, Linux'ta her şey tek bir kökten (\`/\`) başlar.

### Temel Dizinler
- \`/\` (Root/Kök): Sistemin en üst noktasıdır. Her şey bu dizinin altındadır.
- \`~/\` (Home): Sizin kişisel dizininizdir (Örn: \`/home/kullanici_adiniz\`). Belgeleriniz, indirdikleriniz buradadır.
- \`/bin\`: Sistem komutlarının (ls, cp vb.) bulunduğu yerdir.
- \`/etc\`: Sistem ve program yapılandırma (ayar) dosyalarının bulunduğu dizindir.
- \`/var\`: Log dosyaları gibi değişken verilerin tutulduğu dizindir.

### Yollar (Paths)
Terminalde bir klasöre gitmek için yol belirtirsiniz:
- **Tam yol (Absolute Path):** Her zaman \`/\` ile başlar. Örn: \`/var/log/syslog\`
- **Göreli yol (Relative Path):** Bulunduğunuz dizine göre konum. Örn: sadece \`Belgeler\` yazmak sizi bulunduğunuz yerdeki Belgeler klasörüne götürür.`
    },
    {
        slug: "ilk-komutlar",
        title: "İlk Komutlar & Navigasyon",
        description: "Dizinlerde gezinme, dosya oluşturma, silme ve taşıma işlemleri için en sık kullanılan 10 temel komut.",
        icon: "🚀",
        commands: ["ls", "cd", "pwd", "mkdir", "cp", "mv", "rm", "cat", "grep", "chmod"],
        content: `Etrafta gezinmek ve dosyalarla oynamak terminalde yapacağınız ilk şeydir. Bu modüldeki komutlar, Linux terminalinde hayatta kalmanız için gereken "İsviçre Çakısı" gibidir.

Aşağıdaki komutların her birini detaylıca inceleyebilir, nasıl kullanıldıklarını gerçek örneklerle görebilirsiniz. Başlamak için listedeki bir komuta tıklayın.`
    },
    {
        slug: "metin-isleme",
        title: "Metin ve Çıktı İşleme",
        description: "Dosya içeriklerini okuma, filtreleme ve değiştirme (cat, grep, less vb.).",
        icon: "📝",
        content: `Linux felsefesinin temelinde "her şey bir dosyadır" mantığı yatar. Bu yüzden metin okuma ve işleme komutları çok güçlüdür.

### Borulama (Piping - | )
Terminalin en güçlü özelliklerinden biridir. Bir komutun çıktısını, diğerinin girdisi yapar.
Örneğin: \`cat liste.txt | grep "elma"\` 
*(liste.txt içini oku, ÇIKTIYI grep'e gönder ve içinde "elma" geçen satırları filtrele)*

### Yönlendirme ( > ve >> )
Ekrandaki yazıları bir dosyaya kaydetmek için kullanılır.
- \`>\` : Dosyayı sıfırdan oluşturur/üzerine yazar.
- \`>>\` : Dosyanın sonuna ekleme yapar (silmeden).`
    },
    {
        slug: "izinler",
        title: "Linux İzin Sistemi",
        description: "Kullanıcılar, gruplar, okuma (r), yazma (w) ve çalıştırma (x) izinleri (chmod, chown).",
        icon: "🔐",
        content: `Linux çok kullanıcılı bir sistemdir. Bu yüzden hangi kullanıcının hangi dosyayı okuyabileceği veya silebileceği sıkı kurallara bağlıdır.

### 3 Çeşit İzin Tipi Vardır:
1. **r (Read/Okuma - 4):** Dosyayı okuma izni.
2. **w (Write/Yazma - 2):** Dosyayı düzenleme/silme izni.
3. **x (eXecute/Çalıştırma - 1):** Bir programı veya scripti çalıştırma izni.

### 3 Çeşit Sahiplik Vardır:
1. **User (Kullanıcı - u):** Dosyanın sahibi.
2. **Group (Grup - g):** Dosyanın ait olduğu kullanıcı grubu.
3. **Others (Diğerleri - o):** Geri kalan herkes.

Örneğin, \`chmod 755 dosya.sh\` dediğinizde: (7: u, 5: g, 5: o) anlamına gelir. 
7 (4+2+1) = Sahibine tüm izinleri verir.
5 (4+1) = Okuma ve çalıştırma izni verir, yazma izni vermez.`
    },
    {
        slug: "surec-yonetimi",
        title: "Süreç (Process) Yönetimi",
        description: "Arka planda çalışan programları görme, sonlandırma ve yönetme (ps, top, kill).",
        icon: "⚙️",
        content: `Bilgisayarınızda o an çalışan her programa veya komuta "Süreç (Process)" denir. Tarayıcınız, dinlediğiniz müzik veya arka planda inen bir dosya... Hepsi birer süreçtir ve kendilerine ait benzersiz bir kimlik numaraları (PID - Process ID) vardır.

- Sisteminiz yavaşladığında hangi uygulamanın çok RAM/CPU tükettiğini görmek için süreçleri izlersiniz.
- Donan veya yanıt vermeyen bir uygulamayı kapatmak için sürecin "PID"sini bulup, o süreci sonlandıran (kill) komutlar gönderirsiniz.`
    }
];

export function getAllLearningModules(): LearningModule[] {
    return learningModules;
}

export function getLearningModuleBySlug(slug: string): LearningModule | undefined {
    return learningModules.find(m => m.slug === slug);
}
