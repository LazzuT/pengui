/**
 * Pengui — Görev 5 & 6: Options Zenginleştirme + Güvenilirlik Notları
 * 
 * Görev 5: Boş options dizisine sahip ancak bilinen parametreleri olan komutlara 1-2 temel parametre ekler.
 * Görev 6: Varsayılan gelmeyen veya deprecated komutlara detail_tr'ye güvenilirlik notu ekler.
 */

const fs = require('fs');
const path = require('path');

const commandsPath = path.join(__dirname, '../data/commands.json');
const commands = JSON.parse(fs.readFileSync(commandsPath, 'utf8'));

// ============================================================
// GÖREV 5: Options Zenginleştirme (sadece kesin doğru bilgiler)
// ============================================================
const optionsToAdd = {
    'cd': [
        { flag: '-', desc_tr: 'Bir önceki dizine geri döner' },
        { flag: '~', desc_tr: 'Ev dizinine gider' }
    ],
    'bg': [
        { flag: '%n', desc_tr: 'Belirtilen iş numarasına sahip süreci arka plana alır' }
    ],
    'fg': [
        { flag: '%n', desc_tr: 'Belirtilen iş numarasına sahip süreci ön plana getirir' }
    ],
    'nohup': [
        { flag: '&', desc_tr: 'Komutu arka planda başlatarak terminal kapatılsa bile çalışmaya devam etmesini sağlar' }
    ],
    'basename': [
        { flag: '-a', desc_tr: 'Birden fazla yol için sadece dosya adlarını gösterir' },
        { flag: '-s', desc_tr: 'Belirtilen uzantıyı dosya adından kaldırır' }
    ],
    'dirname': [
        { flag: '-z', desc_tr: 'Satır sonlandırıcı olarak boş karakter (null) kullanır' }
    ],
    'whoami': [
        { flag: '--help', desc_tr: 'Kullanım bilgisini gösterir' }
    ],
    'alias': [
        { flag: '-p', desc_tr: 'Tanımlı tüm alias\'ları listeler' }
    ],
    'printf': [
        { flag: '%s', desc_tr: 'Metin (string) formatında değişken basar' },
        { flag: '%d', desc_tr: 'Tam sayı (integer) formatında değişken basar' }
    ],
    'source': [
        { flag: 'dosya', desc_tr: 'Belirtilen dosyayı mevcut shell oturumunda çalıştırır' }
    ],
    'exec': [
        { flag: '-a ad', desc_tr: 'Çalıştırılacak komuta farklı bir isim (argv[0]) atar' }
    ],
    'reset': [
        { flag: '-e', desc_tr: 'Silme karakterini ayarlar' }
    ],
    'chroot': [
        { flag: '--userspec=KULLANICI:GRUP', desc_tr: 'Belirtilen kullanıcı ve grup ile chroot ortamına girer' }
    ],
    'wait': [
        { flag: 'PID', desc_tr: 'Belirtilen PID numaralı sürecin bitmesini bekler' },
        { flag: '-n', desc_tr: 'Herhangi bir alt sürecin tamamlanmasını bekler' }
    ],
    'groups': [
        { flag: 'kullanıcı', desc_tr: 'Belirtilen kullanıcının üye olduğu grupları listeler' }
    ],
    'newgrp': [
        { flag: 'grup', desc_tr: 'Belirtilen gruba geçiş yapar' }
    ],
    'users': [
        { flag: 'dosya', desc_tr: 'Belirtilen utmp dosyasından oturum bilgilerini okur' }
    ],
    'printenv': [
        { flag: '-0', desc_tr: 'Satır sonu yerine null karakter kullanarak ayırır' }
    ],
    'factor': [
        { flag: 'sayı', desc_tr: 'Verilen sayının asal çarpanlarını gösterir' }
    ],
    'hostid': [
        { flag: '--help', desc_tr: 'Kullanım bilgisini gösterir' }
    ]
};

let optionsAdded = 0;
Object.entries(optionsToAdd).forEach(([cmdName, opts]) => {
    const cmd = commands.find(c => c.command === cmdName);
    if (cmd && cmd.options.length === 0) {
        cmd.options = opts;
        optionsAdded++;
    }
});

// ============================================================
// GÖREV 6: Güvenilirlik Notları
// ============================================================
const trustNotes = {
    // Varsayılan gelmeyen komutlar
    'htop': 'Not: Bu komut çoğu dağıtımda varsayılan olarak kurulu gelmez. Kurulum: apt install htop / yum install htop / pacman -S htop.',
    'nmap': 'Not: Bu komut varsayılan olarak kurulu gelmez, ayrıca kurulması gerekir (apt install nmap).',
    'tcpdump': 'Not: Bu komut bazı sunucu dağıtımlarında varsayılan gelir, ancak masaüstü sistemlerinde kurulum gerekebilir.',
    'iotop': 'Not: Bu araç varsayılan olarak kurulu gelmez. Kurulum: apt install iotop.',
    'atop': 'Not: Bu araç varsayılan olarak kurulu gelmez. Kurulum: apt install atop.',
    'glances': 'Not: Bu Python tabanlı araç ayrıca kurulum gerektirir (apt install glances veya pip install glances).',
    'whois': 'Not: Bu komut bazı dağıtımlarda varsayılan olarak kurulu gelmeyebilir. Kurulum: apt install whois.',
    'finger': 'Not: Bu komut modern Linux dağıtımlarında genellikle varsayılan olarak bulunmaz ve güvenlik gerekçesiyle kullanımı azalmıştır.',
    '7z': 'Not: Bu komut varsayılan olarak kurulu gelmez. Kurulum: apt install p7zip-full.',
    '7za': 'Not: Bu komut p7zip paketinin bir parçasıdır ve ayrıca kurulması gerekir.',
    '7zr': 'Not: Bu komut p7zip paketinin hafif sürümüdür ve ayrıca kurulması gerekir.',
    'sponge': 'Not: Bu komut moreutils paketinin bir parçasıdır ve varsayılan olarak kurulu gelmez. Kurulum: apt install moreutils.',
    // Deprecated / eski komutlar
    'telnet': 'Not: Telnet güvenli bir protokol değildir ve modern sistemlerde genellikle SSH tercih edilir. Birçok dağıtımda varsayılan olarak kurulu gelmez.',
    'ftp': 'Not: FTP güvenli bir protokol değildir. Modern sistemlerde sftp veya scp gibi şifreli alternatifler tercih edilmelidir.',
    'dstat': 'Not: dstat bazı modern dağıtımlarda kaldırılmıştır. Alternatif olarak dool veya glances kullanılabilir.',
};

let notesAdded = 0;
Object.entries(trustNotes).forEach(([cmdName, note]) => {
    const cmd = commands.find(c => c.command === cmdName);
    if (cmd) {
        // Eğer zaten not varsa ekleme
        if (!cmd.detail_tr.includes('Not:')) {
            cmd.detail_tr = cmd.detail_tr.trim() + ' ' + note;
            notesAdded++;
        }
    }
});

// Save
fs.writeFileSync(commandsPath, JSON.stringify(commands, null, 2));

console.log('=== GÖREV 5 & 6 SONUÇ ===');
console.log(`Options eklenen komut sayısı: ${optionsAdded}`);
console.log(`Güvenilirlik notu eklenen komut sayısı: ${notesAdded}`);
console.log(`Toplam komut: ${commands.length}`);
