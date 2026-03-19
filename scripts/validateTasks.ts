import fs from 'fs';
import path from 'path';

// Define expected Task structure
interface Task {
    slug: string;
    task: string;
    description: string;
    primary_command: string;
    alternatives: string[];
}

const tasksPath = path.join(process.cwd(), 'data/tasks.json');
const commandsPath = path.join(process.cwd(), 'data/commands.json');

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
