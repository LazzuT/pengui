# Pengui'ye Katkıda Bulunma Rehberi

Pengui'ye ilgi gösterdiğiniz ve açık kaynak topluluğumuza katılmak istediğiniz için teşekkür ederiz! Pengui, Linux komutlarını Türkçe olarak, modern ve anlaşılır bir şekilde sunmayı amaçlar.

Bu belge, repoya nasıl katkıda bulunacağınızı, komutları nasıl ekleyip güncelleyeceğinizi ve yayınlama (deployment) süreçlerini açıklar.

## Bizim Modelimiz: Kontrollü Açık Kaynak
Pengui genel kullanıma ve açık kaynak katkılarına **açıktır**. Herkes projeyi çatallayabilir (fork), kendi lokalinde geliştirebilir ve komut/hata düzeltmesi için **Pull Request (PR)** açabilir.

Ancak kaliteyi, veri güvenliğini ve UI bütünlüğünü korumak adına;
* **Merge Yetkisi:** Gelen Pull Request'leri yalnızca maintainer (proje sahipleri) değerlendirip onaylayabilir.
* **Yayın (Deploy) Yetkisi:** `pengui.org` production ortamına deploy yetkisi sadece core maintainers'a aittir. Onaylanıp `main` dalına birleştirilen (merge) kodlar, Vercel üzerinden güvenli bir şekilde production (üretim) ortamına aktarılır.
* **Kalite Önemlidir:** İçerik bütünlüğünü korumak için komut açıklamalarında tarafsız, profesyonel ve anlaşılır bir editoryal dil benimsenmektedir.

---

## 🚀 Nasıl Katkıda Bulunabilirsiniz?

### 1. Hata (Bug) Bildirme veya Fikir Sunma
Bir hata bulduğunuzda veya yeni bir fikir önermek istediğinizde, lütfen GitHub'daki **Issues** sekmesini kullanın. Sizin için hazırladığımız hazır şablonlar (Bug Report, Feature Request, New Command Request) bulunmaktadır.

### 2. Kod veya İçerik Değişikliği (Pull Request Akışı)

1. **Fork:** Repoyu kendi GitHub hesabınıza çatallayın (fork).
2. **Klonlayın:** Kendi repanızı bilgisayarınıza indirin.
   ```bash
   git clone https://github.com/LazzuT/pengui.git
   cd pengui
   npm install
   ```
3. **Branch Açın:** Değişikliğinizi ana dalda (main) değil, yeni bir dalda yapın.
   ```bash
   git checkout -b feature/eklenecek-komut-adi
   ```
4. **Değişikliğinizi Yapın:** Özellikle `data/commands.json` dosyasına komut eklerken aşağıdaki kurallara mutlaka uyun (bkz: *İçerik Geliştirme Kuralları*).
5. **Kuralları (Validation) Test Edin:** Pengui veri seti katı bir yapıya sahiptir. İşiniz bitince mutlaka şu komutları çalıştırıp hata almadığınızdan emin olun:
   ```bash
   # JSON Validasyonunu test eder
   npx tsx scripts/validateCommands.ts
   
   # Tüm statik sayfaların başarıyla oluşturulup oluşturulmadığını test eder
   npm run build
   ```
6. **Commit ve Push:** Yaptığınız değişiklikleri commit'leyip branch'inize gönderin.
7. **Pull Request (PR) Açın:** GitHub üzerinden, oluşturduğunuz dalı ana repodaki `main` dalına birleştirme (PR) isteği gönderin. PR şablonundaki onay kutucuğundaki maddeleri işaretlemeyi unutmayın.

---

## 📝 İçerik Geliştirme (Komut Ekleme) Kuralları

Yeni bir komut eklerken veya var olanı düzenlerken **`data/commands.json`** dosyası kullanılır. Format örneği tam olarak aşağıdaki gibidir:

```json
{
  "command": "htop",
  "slug": "htop",
  "description_tr": "Sistem kaynaklarını ve çalışan süreçleri renkli ve interaktif gösterir",
  "detail_tr": "top komutunun çok daha gelişmiş, fare destekli ve görsel olarak zenginleştirilmiş modern bir alternatifidir.",
  "syntax": "htop [seçenekler]",
  "category": "sistem-yonetimi",
  "warning": "Bilgi: Çoğu dağıtımda varsayılan gelmez. Kullanmak, 'apt install htop' gibi bir komutla kurmanızı gerektirir.",
  "distros": ["Ubuntu", "Debian", "Arch"],
  "examples": [
    {
      "code": "htop -d 10",
      "desc_tr": "Ekran yenileme hızını 10 saniyeye ayarlayarak htop'u başlatır"
    }
  ],
  "options": [
    {
      "flag": "-u",
      "desc_tr": "Sadece belirli bir kullanıcının çalışan süreçlerini filtreler (örn: -u root)"
    }
  ],
  "dangerous": false,
  "difficulty": "kolay"
}
```

### Önemli Kurallar:
- **`slug`**: Yalnızca küçük harfler, sayılar ve tire içerebilir (Boşluk, ş, ç, ü gibi Türkçe veya özel karakterler yasaktır). Genellikle komut isimleri URL formatında (kebab-case) yazılır.
- **`warning`**: Güvenlik uyarısı veya sistem bağımlılığı bilgisi gerekiyorsa kullanın. Kişisel yorumlardan ("Bence bu komut riskli") kaçının, durumu net yazın. `Not:` ifadesiyle başlamayın, arka planda UI onu yerleştirecektir (Örn: `Tehlike: Sınırsız silme yapar...` veya `Bilgi: Ek kurulum ister...` kullanın).
- **Saygıdeğer Ton**: Terminal kültürüne yakışan, okuyan kişiye "öğretici" ama üstten bakmayan sade ve nazik bir ton kullanın. Aşırı karmaşık Linux felsefelerine girmeden pratikliği hedefleyin.
- **`examples`**: Mutlaka komutun gerçek hayatta ne işe yaradığını anlatan anlamlı pratik senaryolar verin.
- **`dangerous`**: Kullanıcının sistemini bozabilecek (`rm -rf` veya `dd` gibi) kritik komutlarda bu değeri `true` yapın. Aksi takdirde `false` olarak bırakın.

## 🔎 İnceleme (Review) Süreci
Siz PR açtıktan sonra:
1. Otomatik GitHub Actions (CI), kodunuzun doğruluğunu (`validateCommands.ts` testleri, JSON şema kontrolleri ve build süreci) test edecektir.
2. Bu testleri başarıyla geçen PR'lar maintainer ekibi tarafından incelenir.
3. Tasarım, metin kalitesi ve teknik yapı projeye uygun ise PR onaylanır (Review).
4. **Onaylanıp Merge edilen her PR, maintainer güvencesi ve kontrolüyle canlı projeye (pengui.org) güvenli bir şekilde taşınır.**

Zaman ayırdığınız, Linux ekosistemini Türkçe olarak büyütmeye sağladığınız değerli katkılarınız için şimdiden teşekkür ederiz. 🐧
