import path from 'path';
import { promises as fs } from 'fs';
import type { LinuxTopic } from '@/types/linux';

export async function getAllLinuxTopics(): Promise<LinuxTopic[]> {
    const dataPath = path.join(process.cwd(), 'data', 'linuxContent.json');
    const fileContent = await fs.readFile(dataPath, 'utf8');
    const topics: LinuxTopic[] = JSON.parse(fileContent);

    // Return sorted by order index
    return topics.sort((a, b) => a.order - b.order);
}

export async function getLinuxTopicBySlug(slug: string): Promise<LinuxTopic | undefined> {
    const topics = await getAllLinuxTopics();
    return topics.find((topic) => topic.slug === slug);
}
