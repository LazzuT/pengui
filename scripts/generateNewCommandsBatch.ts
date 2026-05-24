import fs from 'fs';
import path from 'path';

/**
 * generateNewCommandsBatch.ts
 * Reads curated config + raw whatis file, generates batch JSON for review.
 */

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, 'scripts/newCommandsConfig.json');
const RAW_PATH = path.join(ROOT, 'data/raw/komutlar_ve_aciklamalari.txt');
const COMMANDS_PATH = path.join(ROOT, 'data/commands.json');
const OUTPUT_PATH = path.join(ROOT, 'data/review/new-commands-batch-001.json');

interface CuratedEntry {
  cmd: string;
  cat: string;
  diff: 'kolay' | 'orta' | 'zor';
  dng: boolean;
  desc: string;
}

// Read existing commands to avoid duplicates
const existingCommands = JSON.parse(fs.readFileSync(COMMANDS_PATH, 'utf8'));
const existingSlugs = new Set(existingCommands.map((c: any) => c.slug));

// Read curated config
const curated: CuratedEntry[] = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

// Read raw whatis file and build lookup
const rawLines = fs.readFileSync(RAW_PATH, 'utf8').split('\n');
const rawLookup = new Map<string, string>();
for (const line of rawLines) {
  const match = line.match(/^(\S+)\s+\(([18])\)\s+-\s+(.+)$/);
  if (match) {
    const [, cmd, , desc] = match;
    if (!rawLookup.has(cmd)) rawLookup.set(cmd, desc.trim());
  }
}

// Generate examples based on command characteristics
function generateExamples(cmd: string, cat: string, dng: boolean): { code: string; desc_tr: string }[] {
  const examples: { code: string; desc_tr: string }[] = [];
  const sudo = dng ? 'sudo ' : '';

  // Category-specific smart examples
  const exampleMap: Record<string, { code: string; desc_tr: string }[]> = {
    lscpu: [
      { code: 'lscpu', desc_tr: 'İşlemci mimarisi, çekirdek sayısı ve hız bilgilerini gösterir' },
      { code: 'lscpu -e', desc_tr: 'Her mantıksal CPU hakkında tablo formatında bilgi verir' },
    ],
    lspci: [
      { code: 'lspci', desc_tr: 'Tüm PCI aygıtlarını kısa formatta listeler' },
      { code: 'lspci -v', desc_tr: 'PCI aygıtlarını detaylı bilgileriyle gösterir' },
    ],
    lsusb: [
      { code: 'lsusb', desc_tr: 'Bağlı tüm USB aygıtlarını listeler' },
      { code: 'lsusb -t', desc_tr: 'USB aygıtlarını ağaç yapısında gösterir' },
    ],
    lsmod: [
      { code: 'lsmod', desc_tr: 'Çekirdeğe yüklü tüm modülleri listeler' },
      { code: 'lsmod | grep snd', desc_tr: 'Ses ile ilgili yüklü modülleri filtreler' },
    ],
    modprobe: [
      { code: 'sudo modprobe vboxdrv', desc_tr: 'VirtualBox çekirdek modülünü yükler' },
      { code: 'sudo modprobe -r vboxdrv', desc_tr: 'VirtualBox çekirdek modülünü kaldırır' },
    ],
    modinfo: [
      { code: 'modinfo ext4', desc_tr: 'ext4 dosya sistemi modülünün bilgilerini gösterir' },
      { code: 'modinfo -p iwlwifi', desc_tr: 'WiFi modülünün kabul ettiği parametreleri listeler' },
    ],
    depmod: [
      { code: 'sudo depmod -a', desc_tr: 'Tüm modüller için bağımlılık dosyalarını yeniden oluşturur' },
      { code: 'sudo depmod -n', desc_tr: 'Bağımlılıkları yazmadan sadece ekrana basar (dry-run)' },
    ],
    rmmod: [
      { code: 'sudo rmmod usbhid', desc_tr: 'usbhid modülünü çekirdekten kaldırır' },
      { code: 'sudo rmmod -f stuck_module', desc_tr: 'Takılı kalmış bir modülü zorla kaldırır (dikkatli kullanın)' },
    ],
    insmod: [
      { code: 'sudo insmod /lib/modules/mymodule.ko', desc_tr: 'Belirtilen modül dosyasını çekirdeğe yükler' },
      { code: 'insmod --help', desc_tr: 'Kullanım bilgilerini gösterir' },
    ],
    sensors: [
      { code: 'sensors', desc_tr: 'CPU sıcaklığı, fan hızı ve voltaj bilgilerini gösterir' },
      { code: 'watch -n 2 sensors', desc_tr: 'Sensör değerlerini 2 saniyede bir canlı izler' },
    ],
    dmidecode: [
      { code: 'sudo dmidecode -t memory', desc_tr: 'Takılı RAM modüllerinin bilgilerini gösterir' },
      { code: 'sudo dmidecode -t bios', desc_tr: 'BIOS/UEFI sürüm bilgilerini gösterir' },
    ],
    hwclock: [
      { code: 'sudo hwclock --show', desc_tr: 'Donanım saatinin mevcut zamanını gösterir' },
      { code: 'sudo hwclock --systohc', desc_tr: 'Sistem saatini donanım saatine yazar' },
    ],
    sysctl: [
      { code: 'sysctl -a | head -20', desc_tr: 'Tüm çekirdek parametrelerinin ilk 20 satırını gösterir' },
      { code: 'sudo sysctl -w net.ipv4.ip_forward=1', desc_tr: 'IP yönlendirmeyi aktif eder' },
    ],
    ldconfig: [
      { code: 'sudo ldconfig', desc_tr: 'Paylaşılan kütüphane önbelleğini günceller' },
      { code: 'ldconfig -p | grep libssl', desc_tr: 'Önbellekte libssl kütüphanesini arar' },
    ],
    logrotate: [
      { code: 'sudo logrotate /etc/logrotate.conf', desc_tr: 'Log döndürme yapılandırmasını çalıştırır' },
      { code: 'sudo logrotate -d /etc/logrotate.conf', desc_tr: 'Ne yapılacağını gösterir ama uygulamaz (debug modu)' },
    ],
    mkswap: [
      { code: 'sudo mkswap /dev/sda2', desc_tr: 'Belirtilen bölümü swap alanı olarak biçimlendirir' },
      { code: 'sudo mkswap /swapfile', desc_tr: 'Bir dosyayı swap alanı olarak hazırlar' },
    ],
    swapon: [
      { code: 'sudo swapon /dev/sda2', desc_tr: 'Belirtilen swap bölümünü etkinleştirir' },
      { code: 'swapon --show', desc_tr: 'Aktif swap alanlarının özetini gösterir' },
    ],
    swapoff: [
      { code: 'sudo swapoff /dev/sda2', desc_tr: 'Belirtilen swap bölümünü devre dışı bırakır' },
      { code: 'sudo swapoff -a', desc_tr: 'Tüm swap alanlarını devre dışı bırakır' },
    ],
    fstrim: [
      { code: 'sudo fstrim -v /', desc_tr: 'Kök dosya sisteminde SSD TRIM çalıştırır ve sonucu gösterir' },
      { code: 'sudo fstrim -a', desc_tr: 'Tüm bağlı dosya sistemlerinde TRIM çalıştırır' },
    ],
    losetup: [
      { code: 'sudo losetup /dev/loop0 disk.img', desc_tr: 'Disk imajını loop aygıtına bağlar' },
      { code: 'losetup -a', desc_tr: 'Aktif tüm loop aygıtlarını listeler' },
    ],
    blockdev: [
      { code: 'sudo blockdev --getsize64 /dev/sda', desc_tr: 'Diskin toplam boyutunu bayt cinsinden gösterir' },
      { code: 'sudo blockdev --getro /dev/sda', desc_tr: 'Diskin salt okunur durumunu sorgular' },
    ],
    cryptsetup: [
      { code: 'sudo cryptsetup luksFormat /dev/sda2', desc_tr: 'Bölümü LUKS ile şifreler (DİKKAT: veri silinir)' },
      { code: 'sudo cryptsetup luksOpen /dev/sda2 mydata', desc_tr: 'Şifreli bölümü açar ve erişilebilir yapar' },
    ],
    nmcli: [
      { code: 'nmcli device status', desc_tr: 'Tüm ağ arayüzlerinin durumunu gösterir' },
      { code: 'nmcli device wifi list', desc_tr: 'Çevredeki WiFi ağlarını listeler' },
    ],
    ethtool: [
      { code: 'ethtool eth0', desc_tr: 'Ethernet arayüzünün hız ve bağlantı bilgilerini gösterir' },
      { code: 'sudo ethtool -s eth0 speed 100', desc_tr: 'Ethernet hızını 100 Mbit olarak ayarlar' },
    ],
    iptables: [
      { code: 'sudo iptables -L -n', desc_tr: 'Mevcut güvenlik duvarı kurallarını listeler' },
      { code: 'sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT', desc_tr: 'HTTP (port 80) trafiğine izin verir' },
    ],
    ufw: [
      { code: 'sudo ufw status verbose', desc_tr: 'Güvenlik duvarı durumunu ve kuralları gösterir' },
      { code: 'sudo ufw allow 22/tcp', desc_tr: 'SSH bağlantısına (port 22) izin verir' },
    ],
    nft: [
      { code: 'sudo nft list ruleset', desc_tr: 'Tüm nftables kurallarını listeler' },
      { code: 'sudo nft add table inet filter', desc_tr: 'Yeni bir filtre tablosu oluşturur' },
    ],
    tc: [
      { code: 'tc qdisc show', desc_tr: 'Mevcut trafik kontrol kurallarını gösterir' },
      { code: 'sudo tc qdisc add dev eth0 root netem delay 100ms', desc_tr: 'Ağ arayüzüne 100ms gecikme ekler (test amaçlı)' },
    ],
    iw: [
      { code: 'iw dev', desc_tr: 'Kablosuz ağ arayüzlerini listeler' },
      { code: 'sudo iw dev wlan0 scan | grep SSID', desc_tr: 'Çevredeki WiFi ağ isimlerini tarar' },
    ],
    resolvectl: [
      { code: 'resolvectl status', desc_tr: 'DNS çözümleme durumunu ve yapılandırmasını gösterir' },
      { code: 'resolvectl query pengui.org', desc_tr: 'Belirtilen alan adının DNS kaydını sorgular' },
    ],
    networkctl: [
      { code: 'networkctl status', desc_tr: 'Tüm ağ bağlantılarının genel durumunu gösterir' },
      { code: 'networkctl list', desc_tr: 'Ağ arayüzlerini tablo halinde listeler' },
    ],
    adduser: [
      { code: 'sudo adduser ali', desc_tr: 'ali adında yeni bir kullanıcı oluşturur ve ev dizinini hazırlar' },
      { code: 'sudo adduser ali sudo', desc_tr: 'ali kullanıcısını sudo grubuna ekler' },
    ],
    deluser: [
      { code: 'sudo deluser ali', desc_tr: 'ali kullanıcısını sistemden siler (ev dizini kalır)' },
      { code: 'sudo deluser --remove-home ali', desc_tr: 'ali kullanıcısını ev diziniyle birlikte siler' },
    ],
    addgroup: [
      { code: 'sudo addgroup gelisitriciler', desc_tr: 'gelistiriciler adında yeni bir grup oluşturur' },
      { code: 'sudo addgroup --gid 1500 ozelgrup', desc_tr: 'Belirtilen GID ile yeni grup oluşturur' },
    ],
    delgroup: [
      { code: 'sudo delgroup eskigrup', desc_tr: 'Belirtilen grubu sistemden siler' },
      { code: 'delgroup --help', desc_tr: 'Kullanım seçeneklerini gösterir' },
    ],
    chpasswd: [
      { code: "echo 'ali:yenisifre123' | sudo chpasswd", desc_tr: 'ali kullanıcısının şifresini toplu olarak günceller' },
      { code: 'sudo chpasswd < sifre_listesi.txt', desc_tr: 'Dosyadaki kullanıcı:şifre çiftlerini toplu uygular' },
    ],
    vipw: [
      { code: 'sudo vipw', desc_tr: '/etc/passwd dosyasını güvenli şekilde düzenler' },
      { code: 'sudo vipw -g', desc_tr: '/etc/group dosyasını güvenli şekilde düzenler' },
    ],
    newusers: [
      { code: 'sudo newusers kullanici_listesi.txt', desc_tr: 'Dosyadan toplu olarak yeni kullanıcılar oluşturur' },
      { code: 'newusers --help', desc_tr: 'Dosya formatı ve kullanım bilgilerini gösterir' },
    ],
    mktemp: [
      { code: 'mktemp', desc_tr: 'Benzersiz adla geçici dosya oluşturur ve yolunu yazdırır' },
      { code: 'mktemp -d', desc_tr: 'Benzersiz adla geçici dizin oluşturur' },
    ],
    fallocate: [
      { code: 'fallocate -l 1G testfile', desc_tr: '1 GB boyutunda bir dosya oluşturur (anında)' },
      { code: 'fallocate -l 2G /swapfile', desc_tr: 'Swap dosyası için 2 GB alan ayırır' },
    ],
    rename: [
      { code: "rename 's/.txt/.md/' *.txt", desc_tr: 'Tüm .txt dosyalarının uzantısını .md olarak değiştirir' },
      { code: "rename 's/foto/resim/' *.jpg", desc_tr: 'Dosya adlarındaki foto kelimesini resim ile değiştirir' },
    ],
    'xdg-open': [
      { code: 'xdg-open belge.pdf', desc_tr: 'PDF dosyasını varsayılan PDF okuyucuda açar' },
      { code: 'xdg-open https://pengui.org', desc_tr: 'URL\'yi varsayılan tarayıcıda açar' },
    ],
    tput: [
      { code: 'tput cols', desc_tr: 'Terminal penceresinin sütun sayısını gösterir' },
      { code: 'tput setaf 2; echo "Yeşil metin"; tput sgr0', desc_tr: 'Terminalde yeşil renkli metin yazdırır' },
    ],
    stty: [
      { code: 'stty -a', desc_tr: 'Tüm terminal ayarlarını gösterir' },
      { code: 'stty size', desc_tr: 'Terminal penceresinin satır ve sütun sayısını gösterir' },
    ],
    lsb_release: [
      { code: 'lsb_release -a', desc_tr: 'Dağıtım adı, sürümü ve kod adı bilgilerini gösterir' },
      { code: 'lsb_release -d', desc_tr: 'Sadece dağıtım açıklamasını gösterir' },
    ],
    efibootmgr: [
      { code: 'efibootmgr', desc_tr: 'UEFI önyükleme sırasını ve girdilerini listeler' },
      { code: 'sudo efibootmgr -o 0001,0002', desc_tr: 'Önyükleme sırasını değiştirir' },
    ],
    b2sum: [
      { code: 'b2sum dosya.iso', desc_tr: 'Dosyanın BLAKE2 sağlama toplamını hesaplar' },
      { code: 'b2sum -c checksum.txt', desc_tr: 'Sağlama toplamlarını dosyadan doğrular' },
    ],
    base32: [
      { code: "echo 'Merhaba' | base32", desc_tr: 'Metni Base32 formatında kodlar' },
      { code: "echo 'JVXGC3TL' | base32 -d", desc_tr: 'Base32 kodlanmış veriyi çözer' },
    ],
    fwupdmgr: [
      { code: 'fwupdmgr get-devices', desc_tr: 'Firmware güncellenebilir aygıtları listeler' },
      { code: 'fwupdmgr refresh && fwupdmgr get-updates', desc_tr: 'Mevcut firmware güncellemelerini kontrol eder' },
    ],
    lshw: [
      { code: 'sudo lshw -short', desc_tr: 'Tüm donanım bileşenlerini kısa tablo halinde gösterir' },
      { code: 'sudo lshw -class network', desc_tr: 'Sadece ağ donanımı bilgilerini gösterir' },
    ],
  };

  if (exampleMap[cmd]) return exampleMap[cmd];

  // Fallback generic examples
  examples.push({ code: `${sudo}${cmd} --help`, desc_tr: `${cmd} komutunun kullanım bilgilerini gösterir` });
  examples.push({ code: `${sudo}${cmd} --version`, desc_tr: `${cmd} komutunun sürüm bilgisini gösterir` });
  return examples;
}

// Generate detail_tr from desc
function generateDetail(cmd: string, desc: string, cat: string): string {
  return `${cmd} komutu, ${desc.charAt(0).toLowerCase() + desc.slice(1)}${desc.endsWith('.') ? '' : '.'} Linux sistemlerinde ${getCategoryLabel(cat)} alanında sıkça kullanılır.`;
}

function getCategoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    'sistem-izleme': 'sistem izleme ve donanım bilgisi',
    'sistem-yonetimi': 'sistem yönetimi ve yapılandırma',
    'disk-yonetimi': 'disk ve depolama yönetimi',
    'ag': 'ağ yapılandırması ve güvenlik',
    'kullanici-yonetimi': 'kullanıcı ve grup yönetimi',
    'dosya-yonetimi': 'dosya ve dizin işlemleri',
    'metin-isleme': 'metin işleme ve dönüştürme',
    'surec-yonetimi': 'süreç yönetimi',
    'izinler': 'izin ve erişim kontrolü',
    'arsivleme': 'arşivleme ve sıkıştırma',
    'paket-yonetimi': 'paket yönetimi',
    'yetki-yonetimi': 'yetki yönetimi',
  };
  return labels[cat] || 'genel sistem yönetimi';
}

function generateSyntax(cmd: string): string {
  return `${cmd} [seçenekler]`;
}

function generateKeywords(cmd: string, desc: string, cat: string): string[] {
  const keywords = [cmd];
  const catKeywords: Record<string, string[]> = {
    'sistem-izleme': ['sistem bilgisi', 'donanım'],
    'sistem-yonetimi': ['sistem yönetimi', 'yapılandırma'],
    'disk-yonetimi': ['disk', 'bölüm'],
    'ag': ['ağ', 'network'],
    'kullanici-yonetimi': ['kullanıcı', 'grup'],
    'dosya-yonetimi': ['dosya'],
    'metin-isleme': ['metin', 'kodlama'],
  };
  if (catKeywords[cat]) keywords.push(...catKeywords[cat]);
  // Extract Turkish words from description
  const words = desc.split(/\s+/).filter(w => w.length > 3 && !['için', 'veya', 'olan', 'gibi'].includes(w.toLowerCase()));
  keywords.push(...words.slice(0, 3).map(w => w.toLowerCase().replace(/[(),.]/g, '')));
  return [...new Set(keywords)];
}

// Build batch
const batch: any[] = [];
let skipped = 0;

for (const entry of curated) {
  if (existingSlugs.has(entry.cmd)) {
    console.log(`⏭️  Skipped (already exists): ${entry.cmd}`);
    skipped++;
    continue;
  }

  const rawDesc = rawLookup.get(entry.cmd) || '';
  const descEn = rawDesc && !rawDesc.match(/[çşğüöıÇŞĞÜÖİ]/) ? rawDesc : '';

  batch.push({
    command: entry.cmd,
    slug: entry.cmd,
    description_tr: entry.desc,
    detail_tr: generateDetail(entry.cmd, entry.desc, entry.cat),
    syntax: generateSyntax(entry.cmd),
    category: entry.cat,
    examples: generateExamples(entry.cmd, entry.cat, entry.dng),
    options: [],
    related: [],
    difficulty: entry.diff,
    dangerous: entry.dng,
    scope: 'core' as const,
    distros: [],
  });
}

// Ensure output directory exists
const outputDir = path.dirname(OUTPUT_PATH);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(batch, null, 2), 'utf8');

console.log(`\n✅ Batch generated: ${OUTPUT_PATH}`);
console.log(`   Commands in batch: ${batch.length}`);
console.log(`   Skipped (existing): ${skipped}`);
console.log(`   Commands: ${batch.map(c => c.command).join(', ')}`);
