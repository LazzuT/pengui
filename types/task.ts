export interface Task {
    slug: string;
    task: string;
    category: string;
    description: string;
    primary_command: string;
    primary_example: string;
    alternatives: string[];
    difficulty: "kolay" | "orta" | "zor";
}
