import fs from 'fs';
import path from 'path';

/**
 * validateNewCommandsBatch.ts
 * Validates the new commands batch before merge.
 */

const ROOT = process.cwd();
const BATCH_PATH = path.join(ROOT, 'data/review/new-commands-batch-001.json');
const COMMANDS_PATH = path.join(ROOT, 'data/commands.json');

const VALID_CATEGORIES = [
  'dosya-yonetimi', 'metin-isleme', 'izinler', 'ag', 'sistem-izleme',
  'paket-yonetimi', 'kullanici-yonetimi', 'arsivleme', 'surec-yonetimi',
  'disk-yonetimi', 'sistem-yonetimi', 'yetki-yonetimi',
];
const VALID_DIFFICULTIES = ['kolay', 'orta', 'zor'];
const REQUIRED_FIELDS = ['command', 'slug', 'description_tr', 'detail_tr', 'syntax', 'category', 'examples', 'difficulty', 'dangerous'];

function validate() {
  let errors = 0;
  let warnings = 0;

  if (!fs.existsSync(BATCH_PATH)) {
    console.error('❌ Batch file not found:', BATCH_PATH);
    process.exit(1);
  }

  const batch = JSON.parse(fs.readFileSync(BATCH_PATH, 'utf8'));
  const existing = JSON.parse(fs.readFileSync(COMMANDS_PATH, 'utf8'));
  const existingSlugs = new Set(existing.map((c: any) => c.slug));
  const batchSlugs = new Set<string>();
  const batchCommands = new Set<string>();

  console.log(`\n🔍 Validating ${batch.length} commands in batch...\n`);

  for (let i = 0; i < batch.length; i++) {
    const cmd = batch[i];
    const label = `#${i + 1} [${cmd.command || 'UNKNOWN'}]`;

    // Required fields
    for (const field of REQUIRED_FIELDS) {
      if (cmd[field] === undefined || cmd[field] === null) {
        console.error(`❌ ${label}: missing required field '${field}'`);
        errors++;
      }
    }

    // Duplicate command in batch
    if (batchCommands.has(cmd.command)) {
      console.error(`❌ ${label}: duplicate command in batch`);
      errors++;
    }
    batchCommands.add(cmd.command);

    // Duplicate slug in batch
    if (batchSlugs.has(cmd.slug)) {
      console.error(`❌ ${label}: duplicate slug in batch`);
      errors++;
    }
    batchSlugs.add(cmd.slug);

    // Collision with existing commands.json
    if (existingSlugs.has(cmd.slug)) {
      console.error(`❌ ${label}: slug '${cmd.slug}' already exists in commands.json`);
      errors++;
    }

    // Category validation
    if (!VALID_CATEGORIES.includes(cmd.category)) {
      console.error(`❌ ${label}: invalid category '${cmd.category}'`);
      errors++;
    }

    // Difficulty validation
    if (!VALID_DIFFICULTIES.includes(cmd.difficulty)) {
      console.error(`❌ ${label}: invalid difficulty '${cmd.difficulty}'`);
      errors++;
    }

    // Dangerous must be boolean
    if (typeof cmd.dangerous !== 'boolean') {
      console.error(`❌ ${label}: 'dangerous' must be boolean, got ${typeof cmd.dangerous}`);
      errors++;
    }

    // Examples validation
    if (!Array.isArray(cmd.examples) || cmd.examples.length < 2) {
      console.error(`❌ ${label}: must have at least 2 examples`);
      errors++;
    } else {
      for (const ex of cmd.examples) {
        if (!ex.code || !ex.desc_tr) {
          console.error(`❌ ${label}: example missing code or desc_tr`);
          errors++;
        }
      }
    }

    // Related validation: all slugs must exist in commands.json or batch
    if (Array.isArray(cmd.related)) {
      for (const rel of cmd.related) {
        if (!existingSlugs.has(rel) && !batchSlugs.has(rel) && !batch.some((b: any) => b.slug === rel)) {
          console.warn(`⚠️  ${label}: related slug '${rel}' not found in commands.json or batch`);
          warnings++;
        }
      }
    }

    // Description length checks
    if (cmd.description_tr && cmd.description_tr.length < 10) {
      console.warn(`⚠️  ${label}: description_tr is very short`);
      warnings++;
    }
    if (cmd.detail_tr && cmd.detail_tr.length < 20) {
      console.warn(`⚠️  ${label}: detail_tr is very short`);
      warnings++;
    }
  }

  // Summary
  console.log('\n--- Validation Results ---');
  console.log(`Total commands: ${batch.length}`);
  console.log(`Errors: ${errors}`);
  console.log(`Warnings: ${warnings}`);

  if (errors > 0) {
    console.error(`\n❌ Validation FAILED with ${errors} error(s). Fix before merging.\n`);
    process.exit(1);
  } else if (warnings > 0) {
    console.log(`\n⚠️  Validation PASSED with ${warnings} warning(s).\n`);
  } else {
    console.log(`\n✅ Validation PASSED. Ready to merge.\n`);
  }
}

validate();
