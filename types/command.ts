// Pengui — Komut veri tipleri

export interface CommandOption {
  flag: string;
  desc_tr: string;
}

export interface CommandExample {
  code: string;
  desc_tr: string;
}

export interface Command {
  command: string;
  slug: string;
  description_tr: string;
  detail_tr: string;
  syntax: string;
  category: string;
  examples: CommandExample[];
  options: CommandOption[];
  related: string[];
  difficulty: "kolay" | "orta" | "zor";
  dangerous: boolean;
  scope: "core" | "distro" | "tool";
  distros: string[];
}

// Kategori tanımları
export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
}

// Distro tanımları
export interface Distro {
  slug: string;
  name: string;
  description: string;
  icon: string;
  packageManager: string;
  color: string;
}

export const DISTROS: Distro[] = [
  {
    slug: "arch",
    name: "Arch Linux",
    description: "Minimalist, rolling-release bir dağıtım. Kullanıcıya tam kontrol sunar ve AUR ile geniş paket deposuna sahiptir.",
    icon: "🏔️",
    packageManager: "pacman / yay",
    color: "#1793D1",
  },
  {
    slug: "ubuntu",
    name: "Ubuntu",
    description: "Debian tabanlı, kullanıcı dostu dağıtım. Masaüstü ve sunucu kullanımı için en popüler Linux dağıtımlarından biridir.",
    icon: "🟠",
    packageManager: "apt",
    color: "#E95420",
  },
  {
    slug: "debian",
    name: "Debian",
    description: "Kararlılık ve güvenilirlik odaklı köklü bir dağıtım. Birçok dağıtımın temelidir.",
    icon: "🔴",
    packageManager: "apt / dpkg",
    color: "#A80030",
  },
  {
    slug: "fedora",
    name: "Fedora",
    description: "Red Hat sponsorluğunda, güncel teknolojileri benimseyen topluluk odaklı bir dağıtım.",
    icon: "🔵",
    packageManager: "dnf / rpm",
    color: "#51A2DA",
  },
];

export const CATEGORIES: Category[] = [
  {
    slug: "dosya-yonetimi",
    name: "Dosya Yönetimi",
    description: "Dosya ve dizin oluşturma, kopyalama, taşıma, silme işlemleri",
    icon: "📁",
  },
  {
    slug: "metin-isleme",
    name: "Metin İşleme",
    description: "Dosya içeriği görüntüleme, arama ve metin düzenleme",
    icon: "📝",
  },
  {
    slug: "izinler",
    name: "İzinler ve Sahiplik",
    description: "Dosya izinleri, sahiplik ve erişim kontrolü",
    icon: "🔐",
  },
  {
    slug: "ag",
    name: "Ağ",
    description: "Ağ bağlantıları, dosya transferi ve uzak erişim",
    icon: "🌐",
  },
  {
    slug: "sistem-izleme",
    name: "Sistem İzleme",
    description: "Sistem kaynakları, süreçler ve performans izleme",
    icon: "📊",
  },
  {
    slug: "paket-yonetimi",
    name: "Paket Yönetimi",
    description: "Yazılım paketlerini kurma, güncelleme ve kaldırma",
    icon: "📦",
  },
  {
    slug: "kullanici-yonetimi",
    name: "Kullanıcı Yönetimi",
    description: "Kullanıcı hesapları, gruplar ve yetkilendirme",
    icon: "👤",
  },
  {
    slug: "arsivleme",
    name: "Arşivleme ve Sıkıştırma",
    description: "Dosya arşivleme, sıkıştırma ve açma işlemleri",
    icon: "🗜️",
  },
  {
    slug: "surec-yonetimi",
    name: "Süreç Yönetimi",
    description: "Süreç başlatma, durdurma ve arka plan işlemleri",
    icon: "⚙️",
  },
  {
    slug: "disk-yonetimi",
    name: "Disk Yönetimi",
    description: "Disk bölümleme, bağlama ve depolama yönetimi",
    icon: "💾",
  },
  {
    slug: "sistem-yonetimi",
    name: "Sistem Yönetimi",
    description: "Sistem yapılandırması, servisler ve genel yönetim araçları",
    icon: "🖥️",
  },
  {
    slug: "yetki-yonetimi",
    name: "Yetki Yönetimi",
    description: "Dosya erişim kontrol listeleri ve genişletilmiş yetkilendirme",
    icon: "🛡️",
  },
];
