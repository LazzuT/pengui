import fs from 'fs';
import path from 'path';

/**
 * mergeNewCommandsBatch.ts
 * Merges validated batch into commands.json.
 * ONLY run after validate passes.
 */

const ROOT = process.cwd();
const BATCH_PATH = path.join(ROOT, 'data/review/new-commands-batch-001.json');
const COMMANDS_PATH = path.join(ROOT, 'data/commands.json');

function merge() {
  if (!fs.existsSync(BATCH_PATH)) {
    console.error('❌ Batch file not found:', BATCH_PATH);
    process.exit(1);
  }

  const batch = JSON.parse(fs.readFileSync(BATCH_PATH, 'utf8'));
  const existing = JSON.parse(fs.readFileSync(COMMANDS_PATH, 'utf8'));
  const existingSlugs = new Set(existing.map((c: any) => c.slug));

  // Safety check: skip any that already exist
  const toAdd = batch.filter((cmd: any) => !existingSlugs.has(cmd.slug));
  const skipped = batch.length - toAdd.length;

  if (toAdd.length === 0) {
    console.log('ℹ️  Nothing to merge. All commands already exist.');
    return;
  }

  // Merge
  const merged = [...existing, ...toAdd];

  // Backup original
  const backupPath = COMMANDS_PATH + '.backup';
  fs.copyFileSync(COMMANDS_PATH, backupPath);
  console.log(`📦 Backup created: ${backupPath}`);

  // Write merged
  fs.writeFileSync(COMMANDS_PATH, JSON.stringify(merged, null, 2), 'utf8');

  console.log(`\n✅ Merge complete!`);
  console.log(`   Previous count: ${existing.length}`);
  console.log(`   Added: ${toAdd.length}`);
  console.log(`   Skipped (already existed): ${skipped}`);
  console.log(`   New total: ${merged.length}`);
  console.log(`\n   Added commands: ${toAdd.map((c: any) => c.command).join(', ')}`);
  console.log(`\n⚠️  Run 'npm run build' and validators to confirm everything is clean.`);
}

merge();
