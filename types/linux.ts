export interface LinuxTopic {
    id: string;
    slug: string;
    title: string;
    description: string;
    content: string;
    icon: string;
    order: number;
    readingTime: string; // e.g., "5 dk"
    category: string; // e.g., "temel-kavramlar"
}
