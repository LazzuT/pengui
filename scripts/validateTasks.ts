import fs from 'fs';
import path from 'path';

// Define expected Task structure
interface Task {
    slug: string;
    task: string;
    category: string;
    description: string;
    primary_command: string;
    alternatives: string[];
}

const tasksPath = path.join(process.cwd(), 'data/tasks.json');
const commandsPath = path.join(process.cwd(), 'data/commands.json');

// types/command.ts içindeki CATEGORIES ile aynı 12 kategori namespace'i.
// tasks.json kategorileri bu küme dışına çıkmamalı (namespace tutarlılığı).
const VALID_CATEGORIES = new Set([
    'dosya-yonetimi', 'metin-isleme', 'izinler', 'ag', 'sistem-izleme',
    'paket-yonetimi', 'kullanici-yonetimi', 'arsivleme', 'surec-yonetimi',
    'disk-yonetimi', 'sistem-yonetimi', 'yetki-yonetimi',
]);

function validateTasks() {
    let hasErrors = false;

    if (!fs.existsSync(tasksPath)) {
        console.error('❌ data/tasks.json not found!');
        process.exit(1);
    }
    
    if (!fs.existsSync(commandsPath)) {
        console.error('❌ data/commands.json not found!');
        process.exit(1);
    }

    const tasks: Task[] = JSON.parse(fs.readFileSync(tasksPath, 'utf8'));
    const commandsData = JSON.parse(fs.readFileSync(commandsPath, 'utf8'));
    const validSlugs = new Set(commandsData.map((c: any) => c.slug));

    console.log(`\n🔍 Validating ${tasks.length} tasks in tasks.json...\n`);

    tasks.forEach((task, index) => {
        const itemNumber = index + 1;

        // 1. Mandatory Fields
        if (!task.slug || !task.task || !task.description || !task.primary_command || !Array.isArray(task.alternatives)) {
            console.error(`❌ Task #${itemNumber} is missing required fields.`);
            hasErrors = true;
        }

        // 2. Slug & Primary command relation verification
        if (!validSlugs.has(task.slug)) {
            console.error(`❌ Task #${itemNumber} ('${task.task}') points to an invalid slug: '${task.slug}'`);
            hasErrors = true;
        }

        // 2b. primary_command must reference an existing command
        if (task.primary_command && !validSlugs.has(task.primary_command)) {
            console.error(`❌ Task #${itemNumber} ('${task.task}') primary_command points to a non-existent command: '${task.primary_command}'`);
            hasErrors = true;
        }

        // 2c. Every alternative must reference an existing command
        if (Array.isArray(task.alternatives)) {
            task.alternatives.forEach((alt) => {
                if (!validSlugs.has(alt)) {
                    console.error(`❌ Task #${itemNumber} ('${task.task}') has an alternative that points to a non-existent command: '${alt}'`);
                    hasErrors = true;
                }
            });
        }

        // 2d. Category must be from the shared 12-category namespace
        if (!task.category || !VALID_CATEGORIES.has(task.category)) {
            console.error(`❌ Task #${itemNumber} ('${task.task}') has an invalid category: '${task.category}'. Must be one of the 12 command categories.`);
            hasErrors = true;
        }

        // 3. Typo/Empty string checks
        if (task.task.trim().length < 5) {
            console.warn(`⚠️  Warning: Task #${itemNumber} title is very short: '${task.task}'`);
        }
        
        if (task.description.trim().length < 10) {
            console.warn(`⚠️  Warning: Task #${itemNumber} description is very short: '${task.description}'`);
        }
    });

    if (hasErrors) {
        console.error('\n❌ Tasks Validation Failed. Fix the errors above.\n');
        process.exit(1); // Fail for CI/CD
    } else {
        console.log('\n✅ All tasks are valid and correctly linked to commands!\n');
    }
}

validateTasks();
