import fs from 'fs';
import path from 'path';

// command referans tipi
interface Command {
    command: string;
    slug: string;
    description_tr: string;
    detail_tr: string;
    syntax: string;
    difficulty: "kolay" | "orta" | "zor";
    category: string;
    dangerous?: boolean;
    scope?: "core" | "distro" | "tool";
    distros?: string[];
    options: {
        flag: string;
        desc_tr: string;
    }[];
    examples: {
        code: string;
        desc_tr: string;
    }[];
    related: string[];
}

function validateCommands() {
    console.log('Validating commands.json dataset...\n');
    let hasErrors = false;
    let warningCount = 0;

    const dataPath = path.join(process.cwd(), 'data', 'commands.json');
    if (!fs.existsSync(dataPath)) {
        console.error('❌ Error: data/commands.json not found!');
        process.exit(1);
    }

    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    let commands: Command[];

    try {
        commands = JSON.parse(fileContent);
    } catch (e) {
        console.error('❌ Error: Invalid JSON in commands.json');
        process.exit(1);
    }

    if (!Array.isArray(commands)) {
        console.error('❌ Error: commands.json must contain an array');
        process.exit(1);
    }

    console.log(`Loaded ${commands.length} commands. Checking properties...\n`);

    const slugs = new Set<string>();

    commands.forEach((cmd, index) => {
        const title = cmd.command || `Item at index ${index}`;

        // 1. Required fields
        const requiredFields = ['command', 'slug', 'description_tr', 'detail_tr', 'syntax', 'difficulty', 'category'];
        requiredFields.forEach(field => {
            if (!(field in cmd) || !cmd[field as keyof Command]) {
                console.warn(`⚠️ Warning: [${title}] missing or empty required field: ${field}`);
                warningCount++;
            }
        });

        // 2. Slug uniqueness
        if (cmd.slug) {
            if (slugs.has(cmd.slug)) {
                console.error(`❌ Error: Duplicate slug found - ${cmd.slug}`);
                hasErrors = true;
            }
            slugs.add(cmd.slug);
        }

        // 3. Examples check
        if (!cmd.examples || !Array.isArray(cmd.examples) || cmd.examples.length === 0) {
            console.warn(`⚠️ Warning: [${title}] has no examples defined.`);
            warningCount++;
        } else {
            cmd.examples.forEach((ex, i) => {
                if (!ex.code || !ex.desc_tr) {
                    console.warn(`⚠️ Warning: [${title}] example at index ${i} is missing code or description.`);
                    warningCount++;
                }
            });
        }
    });

    console.log('\n--- Validation Results ---');
    if (hasErrors) {
        console.error(`❌ Validation FAILED with errors and ${warningCount} warnings.`);
        process.exit(1);
    } else if (warningCount > 0) {
        console.log(`✅ Validation passed, but found ${warningCount} warnings. You might want to fix them.`);
    } else {
        console.log('✅ Validation PASSED perfectly! The dataset is clean.');
    }
}

validateCommands();
