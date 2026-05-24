import fs from 'fs';
import path from 'path';

/**
 * polishBatch.ts
 * Applies quality fixes to new-commands-batch-001.json before merge.
 */

const BATCH_PATH = path.join(process.cwd(), 'data/review/new-commands-batch-001.json');
const batch = JSON.parse(fs.readFileSync(BATCH_PATH, 'utf8'));

// ─── 1. Fix broken casing in detail_tr ───
function fixCasing(text: string): string {
  return text
    .replace(/i̇şlemci/g, 'işlemci')
    .replace(/\bbIOS\b/g, 'BIOS')
    .replace(/\bsSD\b/g, 'SSD')
    .replace(/\blUKS\b/g, 'LUKS')
    .replace(/\bnetworkManager\b/g, 'NetworkManager')
    .replace(/\bdNS\b/g, 'DNS')
    .replace(/\buEFI\b/g, 'UEFI')
    .replace(/\bbLAKE2\b/g, 'BLAKE2')
    .replace(/\blinux\b/g, 'Linux')
    // Also fix generateDetail pattern that lowercases first char
    .replace(/komutu, i̇/g, 'komutu, İ')
    .replace(/komutu, b(?=ağlı)/g, 'komutu, B')
    .replace(/komutu, y(?=üklü)/g, 'komutu, Y')
    .replace(/komutu, ç(?=ekirdek)/g, 'komutu, Ç')
    .replace(/komutu, d(?=onanım)/g, 'komutu, D')
    .replace(/komutu, p(?=aylaşılan)/g, 'komutu, P')
    .replace(/komutu, s(?=istem)/g, 'komutu, S')
    .replace(/komutu, t(?=akas)/g, 'komutu, T')
    .replace(/komutu, d(?=öngü)/g, 'komutu, D')
    .replace(/komutu, b(?=lok)/g, 'komutu, B')
    .replace(/komutu, b(?=asit)/g, 'komutu, B')
    .replace(/komutu, n(?=ftables)/g, 'komutu, N')
    .replace(/komutu, a(?=ğ)/g, 'komutu, A')
    .replace(/komutu, k(?=ablosuz)/g, 'komutu, K')
    .replace(/komutu, e(?=thernet)/g, 'komutu, E');
  // Note: The generateDetail pattern does `desc.charAt(0).toLowerCase() + desc.slice(1)`
  // which breaks proper nouns. We fix the most common ones above.
}

// ─── 2. Dangerous warning sentences ───
const DANGER_WARNING = ' Yanlış kullanıldığında sistem yapılandırmasını bozabileceği için dikkatli kullanılmalıdır.';
const DISK_WARNING = ' DİKKAT: Yanlış disk veya bölüm seçimi veri kaybına yol açabilir.';
const NET_WARNING = ' Uzaktan erişilen sunucularda yanlış kural bağlantınızı kesebilir.';

const dangerWarnings: Record<string, string> = {
  modprobe: DANGER_WARNING,
  depmod: DANGER_WARNING,
  rmmod: ' Kullanılan bir modülü kaldırmak donanım arızalarına neden olabilir.',
  insmod: DANGER_WARNING,
  sysctl: ' Yanlış parametre değişikliği sistemin dengesizleşmesine yol açabilir.',
  ldconfig: ' Hatalı yapılandırma uygulamaların çalışmamasına neden olabilir.',
  mkswap: DISK_WARNING,
  swapon: DISK_WARNING,
  swapoff: ' Yeterli RAM yokken swap kapatmak sistemin kilitlenmesine neden olabilir.',
  losetup: DANGER_WARNING,
  blockdev: DISK_WARNING,
  cryptsetup: ' DİKKAT: luksFormat işlemi seçilen bölümdeki tüm verileri geri dönüşümsüz olarak siler.',
  iptables: NET_WARNING,
  ufw: NET_WARNING,
  nft: NET_WARNING,
  tc: ' Yanlış trafik kuralları ağ bağlantısını tamamen kesebilir.',
  adduser: ' Yönetici grubuna eklenen kullanıcılar sisteme tam erişim kazanır.',
  deluser: ' Kullanıcı silme işlemi geri alınamaz, ev dizini silinirse veriler kaybolur.',
  addgroup: DANGER_WARNING,
  delgroup: ' Kullanıcıların bağlı olduğu bir grubu silmek erişim sorunlarına yol açabilir.',
  chpasswd: ' Toplu şifre değişikliği dikkatli yapılmalıdır, hatalı giriş hesapları kilitleyebilir.',
  vipw: ' passwd/group dosyasını bozarsanız kimse sisteme giriş yapamayabilir.',
  newusers: DANGER_WARNING,
  efibootmgr: ' Yanlış önyükleme sırası sistemi açılmaz hale getirebilir.',
};

// ─── 3. Fix risky examples ───
const exampleOverrides: Record<string, { code: string; desc_tr: string }[]> = {
  rmmod: [
    { code: 'sudo rmmod usbhid', desc_tr: 'usbhid modülünü çekirdekten kaldırır' },
    { code: 'lsmod | grep usbhid', desc_tr: 'Kaldırmadan önce modülün yüklü olduğunu ve bağımlılıklarını kontrol eder' },
  ],
  mkswap: [
    { code: 'sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile', desc_tr: 'Swap dosyası oluşturur ve swap alanı olarak hazırlar (güvenli yöntem)' },
    { code: 'sudo mkswap /swapfile', desc_tr: 'Mevcut bir dosyayı swap alanı olarak biçimlendirir' },
  ],
  cryptsetup: [
    { code: 'sudo cryptsetup luksFormat /dev/sdX', desc_tr: 'Bölümü LUKS ile şifreler (DİKKAT: seçilen bölümdeki tüm verileri geri dönüşümsüz siler! Doğru diski seçtiğinizden emin olun)' },
    { code: 'sudo cryptsetup luksOpen /dev/sdX mydata', desc_tr: 'Şifreli bölümü açar ve /dev/mapper/mydata olarak erişilebilir yapar' },
  ],
  efibootmgr: [
    { code: 'efibootmgr', desc_tr: 'UEFI önyükleme sırasını ve girdilerini listeler' },
    { code: 'sudo efibootmgr -o 0001,0002', desc_tr: 'Önyükleme sırasını değiştirir (DİKKAT: yanlış sıra sistemi açılmaz hale getirebilir)' },
  ],
  sysctl: [
    { code: 'sysctl -a | head -20', desc_tr: 'Tüm çekirdek parametrelerinin ilk 20 satırını gösterir' },
    { code: 'sudo sysctl -w net.ipv4.ip_forward=1', desc_tr: 'IP yönlendirmeyi geçici olarak aktif eder (yeniden başlatmada sıfırlanır, kalıcı yapmak için /etc/sysctl.conf düzenleyin)' },
  ],
  iptables: [
    { code: 'sudo iptables -L -n -v', desc_tr: 'Mevcut güvenlik duvarı kurallarını detaylı listeler' },
    { code: 'sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT', desc_tr: 'HTTP (port 80) trafiğine izin verir (DİKKAT: uzaktan erişilen sunucularda SSH kuralı eklemeden flush yapmayın)' },
  ],
  ufw: [
    { code: 'sudo ufw status verbose', desc_tr: 'Güvenlik duvarı durumunu ve kuralları gösterir' },
    { code: 'sudo ufw allow 22/tcp', desc_tr: 'SSH bağlantısına izin verir (DİKKAT: uzak sunucuda önce SSH izni vermeden UFW aktif etmeyin)' },
  ],
  nft: [
    { code: 'sudo nft list ruleset', desc_tr: 'Tüm nftables kurallarını listeler' },
    { code: 'sudo nft add table inet filter', desc_tr: 'Yeni bir filtre tablosu oluşturur (DİKKAT: uzak sunucularda dikkatli kullanın)' },
  ],
  tc: [
    { code: 'tc qdisc show', desc_tr: 'Mevcut trafik kontrol kurallarını gösterir' },
    { code: 'sudo tc qdisc add dev eth0 root netem delay 100ms', desc_tr: 'Ağ arayüzüne 100ms gecikme ekler (DİKKAT: test sonrası kuralı silmeyi unutmayın, aksi halde ağ yavaş kalır)' },
  ],
};

// ─── 4. Options for common commands ───
const optionsMap: Record<string, { flag: string; desc_tr: string }[]> = {
  lscpu: [
    { flag: '-e', desc_tr: 'Tüm CPU bilgilerini tablo formatında gösterir' },
    { flag: '-p', desc_tr: 'Ayrıştırılabilir (parseable) formatta çıktı verir' },
    { flag: '-J', desc_tr: 'JSON formatında çıktı verir' },
  ],
  lspci: [
    { flag: '-v', desc_tr: 'Detaylı bilgi gösterir' },
    { flag: '-k', desc_tr: 'Her aygıtın kullandığı çekirdek modülünü gösterir' },
    { flag: '-nn', desc_tr: 'Hem adı hem de sayısal kimliği gösterir' },
  ],
  lsusb: [
    { flag: '-v', desc_tr: 'Detaylı bilgi gösterir' },
    { flag: '-t', desc_tr: 'Ağaç yapısında gösterir' },
  ],
  lsmod: [],
  modprobe: [
    { flag: '-r', desc_tr: 'Modülü kaldırır (rmmod yerine önerilir)' },
    { flag: '-v', desc_tr: 'Yapılan işlemleri detaylı gösterir' },
    { flag: '-n', desc_tr: 'Kuru çalıştırma — gerçekte yüklemez' },
  ],
  modinfo: [
    { flag: '-p', desc_tr: 'Modülün kabul ettiği parametreleri listeler' },
    { flag: '-F', desc_tr: 'Sadece belirtilen alanı gösterir (ör: -F version)' },
  ],
  sensors: [
    { flag: '-f', desc_tr: 'Sıcaklıkları Fahrenheit cinsinden gösterir' },
    { flag: '-j', desc_tr: 'JSON formatında çıktı verir' },
  ],
  dmidecode: [
    { flag: '-t memory', desc_tr: 'Sadece RAM bilgilerini gösterir' },
    { flag: '-t bios', desc_tr: 'Sadece BIOS bilgilerini gösterir' },
    { flag: '-t system', desc_tr: 'Sistem üretici bilgilerini gösterir' },
  ],
  nmcli: [
    { flag: 'device status', desc_tr: 'Ağ arayüzlerinin durumunu gösterir' },
    { flag: 'device wifi list', desc_tr: 'Çevredeki WiFi ağlarını listeler' },
    { flag: 'connection show', desc_tr: 'Kayıtlı bağlantıları listeler' },
  ],
  ethtool: [
    { flag: '-i', desc_tr: 'Arayüzün sürücü bilgisini gösterir' },
    { flag: '-S', desc_tr: 'Arayüz istatistiklerini gösterir' },
  ],
  iptables: [
    { flag: '-L', desc_tr: 'Tüm kuralları listeler' },
    { flag: '-n', desc_tr: 'IP adreslerini sayısal gösterir (DNS çözümlemez)' },
    { flag: '-F', desc_tr: 'Tüm kuralları temizler (DİKKAT!)' },
    { flag: '-A', desc_tr: 'Zincire yeni kural ekler' },
  ],
  ufw: [
    { flag: 'status', desc_tr: 'Güvenlik duvarı durumunu gösterir' },
    { flag: 'enable', desc_tr: 'Güvenlik duvarını aktif eder' },
    { flag: 'allow', desc_tr: 'Belirtilen port/servise izin verir' },
    { flag: 'deny', desc_tr: 'Belirtilen port/servisi engeller' },
  ],
  mktemp: [
    { flag: '-d', desc_tr: 'Dosya yerine geçici dizin oluşturur' },
    { flag: '-t', desc_tr: 'Şablon ile isim belirler' },
    { flag: '-p DIR', desc_tr: 'Belirtilen dizinde oluşturur' },
  ],
  fallocate: [
    { flag: '-l', desc_tr: 'Ayrılacak boyutu belirler (ör: 1G, 512M)' },
  ],
  rename: [
    { flag: '-v', desc_tr: 'Yeniden adlandırılan dosyaları gösterir' },
    { flag: '-n', desc_tr: 'Kuru çalıştırma — değişiklikleri yapmadan gösterir' },
  ],
  tput: [
    { flag: 'cols', desc_tr: 'Terminal sütun sayısını gösterir' },
    { flag: 'lines', desc_tr: 'Terminal satır sayısını gösterir' },
    { flag: 'setaf N', desc_tr: 'Ön plan rengini ayarlar' },
    { flag: 'sgr0', desc_tr: 'Tüm renk/biçim ayarlarını sıfırlar' },
  ],
  stty: [
    { flag: '-a', desc_tr: 'Tüm terminal ayarlarını gösterir' },
    { flag: 'size', desc_tr: 'Terminal boyutunu (satır sütun) gösterir' },
  ],
  lsb_release: [
    { flag: '-a', desc_tr: 'Tüm dağıtım bilgilerini gösterir' },
    { flag: '-d', desc_tr: 'Sadece dağıtım açıklamasını gösterir' },
    { flag: '-r', desc_tr: 'Sadece sürüm numarasını gösterir' },
  ],
  b2sum: [
    { flag: '-c', desc_tr: 'Sağlama toplamlarını dosyadan doğrular' },
  ],
  base32: [
    { flag: '-d', desc_tr: 'Kodlanmış veriyi çözer (decode)' },
    { flag: '-w N', desc_tr: 'Çıktıyı N sütunda kaydırır' },
  ],
  fwupdmgr: [
    { flag: 'get-devices', desc_tr: 'Güncellenebilir aygıtları listeler' },
    { flag: 'get-updates', desc_tr: 'Mevcut güncellemeleri kontrol eder' },
    { flag: 'refresh', desc_tr: 'Firmware veritabanını günceller' },
  ],
  lshw: [
    { flag: '-short', desc_tr: 'Kısa tablo formatında gösterir' },
    { flag: '-class', desc_tr: 'Sadece belirli donanım sınıfını gösterir' },
    { flag: '-html', desc_tr: 'HTML formatında çıktı verir' },
  ],
  logrotate: [
    { flag: '-d', desc_tr: 'Debug modu — ne yapılacağını gösterir ama uygulamaz' },
    { flag: '-f', desc_tr: 'Döndürmeyi zorlar' },
    { flag: '-v', desc_tr: 'Ayrıntılı çıktı verir' },
  ],
  hwclock: [
    { flag: '--show', desc_tr: 'Donanım saatini gösterir' },
    { flag: '--systohc', desc_tr: 'Sistem saatini donanım saatine yazar' },
    { flag: '--hctosys', desc_tr: 'Donanım saatini sistem saatine yazar' },
  ],
  cryptsetup: [
    { flag: 'luksFormat', desc_tr: 'Bölümü LUKS ile şifreler (DİKKAT: veri siler!)' },
    { flag: 'luksOpen', desc_tr: 'Şifreli bölümü açar' },
    { flag: 'luksClose', desc_tr: 'Açık şifreli bölümü kapatır' },
  ],
  swapon: [
    { flag: '--show', desc_tr: 'Aktif swap alanlarını gösterir' },
    { flag: '-a', desc_tr: '/etc/fstab içindeki tüm swap alanlarını etkinleştirir' },
  ],
  swapoff: [
    { flag: '-a', desc_tr: 'Tüm swap alanlarını devre dışı bırakır' },
  ],
  fstrim: [
    { flag: '-v', desc_tr: 'Serbest bırakılan alan miktarını gösterir' },
    { flag: '-a', desc_tr: 'Tüm bağlı dosya sistemlerinde çalıştırır' },
  ],
  losetup: [
    { flag: '-a', desc_tr: 'Aktif tüm loop aygıtlarını listeler' },
    { flag: '-d', desc_tr: 'Loop aygıtını ayırır' },
    { flag: '-f', desc_tr: 'İlk boş loop aygıtını gösterir' },
  ],
  iw: [
    { flag: 'dev', desc_tr: 'Kablosuz arayüzleri listeler' },
    { flag: 'dev wlan0 scan', desc_tr: 'Çevredeki WiFi ağlarını tarar' },
    { flag: 'dev wlan0 info', desc_tr: 'Arayüz bilgilerini gösterir' },
  ],
  resolvectl: [
    { flag: 'status', desc_tr: 'DNS yapılandırma durumunu gösterir' },
    { flag: 'query', desc_tr: 'Alan adı sorgusu yapar' },
  ],
  networkctl: [
    { flag: 'status', desc_tr: 'Ağ durumunu gösterir' },
    { flag: 'list', desc_tr: 'Ağ arayüzlerini listeler' },
  ],
  adduser: [
    { flag: '--home', desc_tr: 'Ev dizini yolunu belirler' },
    { flag: '--shell', desc_tr: 'Kullanıcının kabuğunu belirler' },
    { flag: '--disabled-password', desc_tr: 'Şifresiz kullanıcı oluşturur' },
  ],
  deluser: [
    { flag: '--remove-home', desc_tr: 'Ev dizinini de siler' },
    { flag: '--backup', desc_tr: 'Silmeden önce yedek alır' },
  ],
  xdg_open: [],
  efibootmgr: [
    { flag: '-o', desc_tr: 'Önyükleme sırasını ayarlar' },
    { flag: '-b', desc_tr: 'Belirli bir önyükleme girdisini seçer' },
    { flag: '-B', desc_tr: 'Belirli bir önyükleme girdisini siler' },
  ],
};

// ─── 5. Related slugs (only safe ones within batch or existing) ───
const relatedMap: Record<string, string[]> = {
  lscpu: ['lspci', 'lsusb', 'lshw', 'dmidecode', 'uname'],
  lspci: ['lscpu', 'lsusb', 'lshw', 'dmidecode'],
  lsusb: ['lscpu', 'lspci', 'lshw'],
  lsmod: ['modprobe', 'modinfo', 'rmmod', 'insmod', 'depmod'],
  modprobe: ['lsmod', 'modinfo', 'rmmod', 'insmod', 'depmod'],
  modinfo: ['lsmod', 'modprobe'],
  depmod: ['lsmod', 'modprobe', 'modinfo'],
  rmmod: ['lsmod', 'modprobe', 'insmod'],
  insmod: ['lsmod', 'modprobe', 'rmmod'],
  sensors: ['lscpu', 'lshw', 'dmidecode'],
  dmidecode: ['lscpu', 'lspci', 'lshw', 'sensors'],
  lshw: ['lscpu', 'lspci', 'lsusb', 'dmidecode'],
  hwclock: ['date', 'timedatectl'],
  sysctl: ['uname'],
  logrotate: ['journalctl', 'cron'],
  mkswap: ['swapon', 'swapoff', 'fallocate', 'free'],
  swapon: ['mkswap', 'swapoff', 'free'],
  swapoff: ['mkswap', 'swapon', 'free'],
  fstrim: ['df', 'mount'],
  losetup: ['mount', 'dd'],
  blockdev: ['fdisk', 'lsblk'],
  cryptsetup: ['lsblk', 'mount', 'umount'],
  nmcli: ['ip', 'ifconfig', 'networkctl', 'resolvectl'],
  ethtool: ['ip', 'ifconfig', 'nmcli'],
  iptables: ['ufw', 'nft', 'ss', 'netstat'],
  ufw: ['iptables', 'nft', 'ss'],
  nft: ['iptables', 'ufw', 'ss'],
  tc: ['ip', 'iptables'],
  iw: ['nmcli', 'ip', 'ifconfig'],
  resolvectl: ['dig', 'nslookup', 'host', 'networkctl'],
  networkctl: ['nmcli', 'ip', 'resolvectl'],
  adduser: ['deluser', 'useradd', 'usermod', 'passwd'],
  deluser: ['adduser', 'userdel'],
  addgroup: ['delgroup', 'groupadd', 'groupmod'],
  delgroup: ['addgroup', 'groupdel'],
  chpasswd: ['passwd', 'adduser'],
  vipw: ['passwd', 'adduser', 'usermod'],
  newusers: ['adduser', 'useradd', 'chpasswd'],
  mktemp: ['touch', 'mkdir'],
  fallocate: ['truncate', 'dd', 'mkswap'],
  rename: ['mv', 'find'],
  'xdg-open': ['file'],
  tput: ['stty', 'echo'],
  stty: ['tput'],
  lsb_release: ['uname', 'hostnamectl'],
  efibootmgr: ['grub-install'],
  b2sum: ['md5sum', 'sha256sum', 'sha512sum'],
  base32: ['base64'],
  fwupdmgr: ['uname', 'dmidecode'],
};

// ─── Apply all fixes ───
let fixCount = 0;

for (const cmd of batch) {
  // 1. Fix casing in detail_tr and description_tr
  cmd.detail_tr = fixCasing(cmd.detail_tr);
  cmd.description_tr = fixCasing(cmd.description_tr);

  // 2. Add danger warnings
  if (cmd.dangerous && dangerWarnings[cmd.command]) {
    if (!cmd.detail_tr.includes('DİKKAT') && !cmd.detail_tr.includes('dikkatli')) {
      cmd.detail_tr = cmd.detail_tr.replace(/\.$/, '') + '.' + dangerWarnings[cmd.command];
      fixCount++;
    }
  }

  // 3. Override risky examples
  if (exampleOverrides[cmd.command]) {
    cmd.examples = exampleOverrides[cmd.command];
    fixCount++;
  }

  // 4. Add options
  if (optionsMap[cmd.command] && optionsMap[cmd.command].length > 0) {
    cmd.options = optionsMap[cmd.command];
    fixCount++;
  }

  // 5. Add related
  if (relatedMap[cmd.command]) {
    cmd.related = relatedMap[cmd.command];
    fixCount++;
  }

  // 6. Fix typo: gelisitriciler -> gelistiriciler
  for (const ex of cmd.examples) {
    ex.code = ex.code.replace('gelisitriciler', 'gelistiriciler');
    ex.desc_tr = ex.desc_tr.replace('gelisitriciler', 'gelistiriciler');
  }
}

// Write back
fs.writeFileSync(BATCH_PATH, JSON.stringify(batch, null, 2), 'utf8');

console.log(`\n✅ Polish complete. Applied fixes to ${batch.length} commands.`);
console.log(`   Individual fix operations: ${fixCount}`);
console.log(`   Output: ${BATCH_PATH}\n`);
