const fs = require('fs');
const path = require('path');

const commandsPath = path.join(__dirname, '../data/commands.json');
let baseCommands = JSON.parse(fs.readFileSync(commandsPath, 'utf8'));
const initialCount = baseCommands.length;

let addedCount = 0;
for (let i = 1; i <= 6; i++) {
    const batchPath = path.join(__dirname, `batch${i}.json`);
    if (fs.existsSync(batchPath)) {
        const batchCommands = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
        batchCommands.forEach(cmd => {
            // Check for duplicate by command name or slug
            if (!baseCommands.some(c => c.command === cmd.command || c.slug === cmd.slug)) {
                baseCommands.push(cmd);
                addedCount++;
            } else {
                console.log(`Bypassed Duplicate: ${cmd.command}`);
            }
        });
    }
}

fs.writeFileSync(commandsPath, JSON.stringify(baseCommands, null, 2));
console.log(`Started with: ${initialCount}`);
console.log(`Added: ${addedCount}`);
console.log(`Final count: ${baseCommands.length}`);
