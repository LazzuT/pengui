import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Pengui — Türkçe Linux Komut Kütüphanesi",
        short_name: "Pengui",
        description:
            "Linux terminaline yeni mi başlıyorsun? Pengui ile komutları basit açıklamalar ve gerçek kullanım örnekleriyle keşfet.",
        start_url: "/",
        display: "standalone",
        background_color: "#0f172a",
        theme_color: "#0f172a",
        lang: "tr",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon",
            },
            {
                src: "/og-image.png",
                sizes: "1200x630",
                type: "image/png",
            },
        ],
    };
}
