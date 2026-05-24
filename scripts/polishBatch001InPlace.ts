import fs from 'fs';
import path from 'path';

/**
 * polishBatch001InPlace.ts
 * Polishes detail_tr and options for the 50 batch-001 commands directly in commands.json.
 * Does NOT add/remove commands or change slugs.
 */

const ROOT = process.cwd();
const COMMANDS_PATH = path.join(ROOT, 'data/commands.json');
const DETAIL_DATA_PATH = path.join(ROOT, 'scripts/polishDetailData.json');

const commands = JSON.parse(fs.readFileSync(COMMANDS_PATH, 'utf8'));
const detailMap: Record<string, string> = JSON.parse(fs.readFileSync(DETAIL_DATA_PATH, 'utf8'));

const BATCH_SLUGS = new Set([
  'lscpu','lspci','lsusb','lsmod','modprobe','modinfo','depmod','rmmod','insmod',
  'sensors','dmidecode','hwclock','sysctl','ldconfig','logrotate','mkswap','swapon',
  'swapoff','fstrim','losetup','blockdev','cryptsetup','nmcli','ethtool','iptables',
  'ufw','nft','tc','iw','resolvectl','networkctl','adduser','deluser','addgroup',
  'delgroup','chpasswd','vipw','newusers','mktemp','fallocate','rename','xdg-open',
  'tput','stty','lsb_release','efibootmgr','b2sum','base32','fwupdmgr','lshw'
]);

// Options to add for commands that have empty options
const optionsToAdd: Record<string, {flag:string;desc_tr:string}[]> = {
  depmod: [
    {flag:'-a', desc_tr:'Tüm modüller için bağımlılık dosyalarını oluşturur'},
    {flag:'-n', desc_tr:'Sonuçları dosyaya yazmadan ekrana basar'},
    {flag:'-v', desc_tr:'İşlenen modülleri detaylı gösterir'},
  ],
  rmmod: [
    {flag:'-v', desc_tr:'Yapılan işlemi detaylı gösterir'},
    {flag:'-w', desc_tr:'Modül kullanımdaysa serbest kalmasını bekler'},
  ],
  insmod: [
    {flag:'-v', desc_tr:'Yapılan işlemi detaylı gösterir'},
  ],
  sysctl: [
    {flag:'-a', desc_tr:'Tüm çekirdek parametrelerini listeler'},
    {flag:'-w', desc_tr:'Belirtilen parametreyi değiştirir'},
    {flag:'-p', desc_tr:'Yapılandırma dosyasından parametreleri yükler'},
  ],
  ldconfig: [
    {flag:'-p', desc_tr:'Önbellekteki kütüphaneleri listeler'},
    {flag:'-v', desc_tr:'İşlem detaylarını gösterir'},
  ],
  mkswap: [
    {flag:'-L', desc_tr:'Swap alanına etiket atar'},
    {flag:'-f', desc_tr:'Uyarıları atlayarak zorla oluşturur'},
  ],
  blockdev: [
    {flag:'--getsize64', desc_tr:'Aygıtın toplam boyutunu bayt olarak gösterir'},
    {flag:'--getro', desc_tr:'Salt okunur durumunu sorgular'},
    {flag:'--setrw', desc_tr:'Aygıtı okuma-yazma moduna geçirir'},
  ],
  tc: [
    {flag:'qdisc show', desc_tr:'Kuyruk disiplinlerini gösterir'},
    {flag:'qdisc add', desc_tr:'Yeni trafik kuralı ekler'},
    {flag:'qdisc del', desc_tr:'Trafik kuralını siler'},
  ],
  nft: [
    {flag:'list ruleset', desc_tr:'Tüm kuralları listeler'},
    {flag:'add table', desc_tr:'Yeni filtre tablosu oluşturur'},
    {flag:'flush ruleset', desc_tr:'Tüm kuralları temizler'},
  ],
  chpasswd: [
    {flag:'-e', desc_tr:'Şifrelerin zaten şifrelenmiş olduğunu belirtir'},
    {flag:'-c', desc_tr:'Kullanılacak şifreleme algoritmasını belirler'},
  ],
  vipw: [
    {flag:'-g', desc_tr:'/etc/group dosyasını düzenler'},
    {flag:'-s', desc_tr:'Shadow dosyasını düzenler'},
  ],
  newusers: [
    {flag:'-r', desc_tr:'Sistem kullanıcısı oluşturur'},
  ],
  xdg_open: [],
  lshw: [
    {flag:'-short', desc_tr:'Kısa tablo formatında gösterir'},
    {flag:'-class', desc_tr:'Sadece belirli donanım sınıfını gösterir (ör: network, disk)'},
    {flag:'-html', desc_tr:'HTML formatında rapor üretir'},
    {flag:'-json', desc_tr:'JSON formatında çıktı verir'},
  ],
  dmidecode: [
    {flag:'-t memory', desc_tr:'Sadece RAM bilgilerini gösterir'},
    {flag:'-t bios', desc_tr:'Sadece BIOS/UEFI bilgilerini gösterir'},
    {flag:'-t system', desc_tr:'Sistem üretici ve model bilgilerini gösterir'},
    {flag:'-t baseboard', desc_tr:'Anakart bilgilerini gösterir'},
  ],
  hwclock: [
    {flag:'--show', desc_tr:'Donanım saatini gösterir'},
    {flag:'--systohc', desc_tr:'Sistem saatini donanım saatine yazar'},
    {flag:'--hctosys', desc_tr:'Donanım saatini sistem saatine yazar'},
    {flag:'--utc', desc_tr:'Donanım saatini UTC olarak yorumlar'},
  ],
  adduser: [
    {flag:'--home', desc_tr:'Ev dizini yolunu belirler'},
    {flag:'--shell', desc_tr:'Varsayılan kabuğu belirler'},
    {flag:'--disabled-password', desc_tr:'Şifresiz kullanıcı oluşturur'},
    {flag:'--ingroup', desc_tr:'Kullanıcıyı belirtilen gruba ekler'},
  ],
  deluser: [
    {flag:'--remove-home', desc_tr:'Ev dizinini de siler'},
    {flag:'--backup', desc_tr:'Silmeden önce dosyaları yedekler'},
  ],
  addgroup: [
    {flag:'--gid', desc_tr:'Grup numarasını (GID) belirler'},
    {flag:'--system', desc_tr:'Sistem grubu oluşturur'},
  ],
  delgroup: [
    {flag:'--only-if-empty', desc_tr:'Grupta kullanıcı varsa silmez'},
  ],
  efibootmgr: [
    {flag:'-v', desc_tr:'Detaylı önyükleme bilgilerini gösterir'},
    {flag:'-o', desc_tr:'Önyükleme sırasını ayarlar'},
    {flag:'-b', desc_tr:'İşlem yapılacak önyükleme girdisini seçer'},
    {flag:'-B', desc_tr:'Seçili önyükleme girdisini siler'},
  ],
};

let detailFixed = 0;
let optionsFixed = 0;

for (const cmd of commands) {
  if (!BATCH_SLUGS.has(cmd.slug)) continue;

  // 1. Rewrite detail_tr
  if (detailMap[cmd.slug]) {
    cmd.detail_tr = detailMap[cmd.slug];
    detailFixed++;
  }

  // 2. Add options if currently empty and we have data
  const optsKey = cmd.slug === 'xdg-open' ? 'xdg_open' : cmd.slug;
  if (cmd.options.length === 0 && optionsToAdd[optsKey] && optionsToAdd[optsKey].length > 0) {
    cmd.options = optionsToAdd[optsKey];
    optionsFixed++;
  }
  // Also fill options for commands that already have options from polishBatch but we have better ones
  if (optionsToAdd[cmd.slug] && optionsToAdd[cmd.slug].length > 0 && cmd.options.length === 0) {
    cmd.options = optionsToAdd[cmd.slug];
    optionsFixed++;
  }
}

fs.writeFileSync(COMMANDS_PATH, JSON.stringify(commands, null, 2), 'utf8');

console.log(`\n✅ Polish complete.`);
console.log(`   detail_tr rewritten: ${detailFixed}/50`);
console.log(`   options filled: ${optionsFixed}`);
console.log(`   commands.json updated in place.\n`);
