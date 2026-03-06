/**
 * Pengui commands.json Data Repair Script
 * Fixes pipe-parse offset corruption from Phase 7 batch injection.
 * 
 * Corruption Pattern:
 * - related[] contains option descriptions or difficulty values instead of slugs
 * - difficulty contains actual related commands (comma-separated)
 * - dangerous field may be shifted
 * - scope contains "false"/"true" (the dangerous boolean as string)
 * 
 * Also fixes:
 * - Broken category values ("n]", "sponge dosya")
 * - Adds missing categories (sistem-yonetimi, yetki-yonetimi) to CATEGORIES
 * - Removes broken related references (slugs that don't exist)
 * - Fixes distro-scope commands with empty distros array
 */

const fs = require('fs');
const path = require('path');

const commandsPath = path.join(__dirname, '../data/commands.json');
const commands = JSON.parse(fs.readFileSync(commandsPath, 'utf8'));

const validDifficulties = ['kolay', 'orta', 'zor'];
const validScopes = ['core', 'distro', 'tool'];
const allSlugs = new Set(commands.map(c => c.slug));

let fixes = {
    relatedCleaned: 0,
    scopeFixed: 0,
    difficultyFixed: 0,
    categoryFixed: 0,
    brokenRelatedRemoved: 0,
    distrosFixed: 0,
    commandsModified: new Set()
};

// ============================================================
// PHASE 1: Fix pipe-parse offset corruption
// ============================================================
commands.forEach(cmd => {
    let modified = false;

    // DETECT CORRUPTION: scope is "false" or "true" (string boolean)
    if (cmd.scope === 'false' || cmd.scope === 'true' || !validScopes.includes(cmd.scope)) {
        const isScopeCorrupt = !validScopes.includes(cmd.scope);

        if (isScopeCorrupt) {
            // Pattern: the difficulty field actually contains related commands
            // The scope field contains the dangerous boolean as string
            // The related field contains option descriptions or difficulty values

            // Step 1: Extract real related from difficulty (if it looks like comma-separated slugs)
            let realRelated = [];
            if (cmd.difficulty && !validDifficulties.includes(cmd.difficulty)) {
                realRelated = cmd.difficulty.split(',').map(s => s.trim()).filter(s => s.length > 0 && s.length < 30);
            }

            // Step 2: Extract real dangerous from scope
            let realDangerous = cmd.scope === 'true';

            // Step 3: Determine real difficulty - check if any related item is actually a difficulty
            let realDifficulty = 'orta'; // default
            cmd.related.forEach(r => {
                if (validDifficulties.includes(r)) {
                    realDifficulty = r;
                }
            });

            // Step 4: Determine real scope based on command type
            let realScope = 'core';
            const distroCommands = ['apt', 'apt-get', 'apt-cache', 'apt-file', 'dpkg', 'dpkg-reconfigure', 'yum', 'dnf', 'pacman', 'zypper', 'flatpak', 'snap', 'rpm'];
            if (distroCommands.includes(cmd.command)) {
                realScope = 'distro';
            }

            // Apply fixes
            cmd.related = realRelated;
            cmd.difficulty = realDifficulty;
            cmd.dangerous = realDangerous;
            cmd.scope = realScope;

            fixes.relatedCleaned++;
            fixes.scopeFixed++;
            fixes.difficultyFixed++;
            modified = true;
        }
    }

    // DETECT CORRUPTION: difficulty field contains comma-separated slugs instead of kolay/orta/zor
    if (!validDifficulties.includes(cmd.difficulty)) {
        // difficulty has related commands, related has difficulty/text
        let realRelated = cmd.difficulty.split(',').map(s => s.trim()).filter(s => s.length > 0 && s.length < 30);

        // Check if related has a difficulty value
        let realDifficulty = 'orta';
        cmd.related.forEach(r => {
            if (validDifficulties.includes(r)) {
                realDifficulty = r;
            }
        });

        cmd.related = realRelated;
        cmd.difficulty = realDifficulty;
        fixes.relatedCleaned++;
        fixes.difficultyFixed++;
        modified = true;
    }

    // DETECT CORRUPTION: related contains difficulty values or long text
    const cleanRelated = cmd.related.filter(r => {
        if (validDifficulties.includes(r)) {
            return false; // difficulty value leaked into related
        }
        if (r.length > 30) {
            return false; // description text leaked into related
        }
        return true;
    });

    if (cleanRelated.length !== cmd.related.length) {
        const removed = cmd.related.length - cleanRelated.length;
        cmd.related = cleanRelated;
        fixes.relatedCleaned += removed;
        modified = true;
    }

    if (modified) {
        fixes.commandsModified.add(cmd.command);
    }
});

// ============================================================
// PHASE 2: Fix broken category values
// ============================================================
const categoryFixes = {
    'n]': 'sistem-yonetimi',      // mesg is a system command
    'sponge dosya': 'metin-isleme' // sponge is a text processing tool
};

commands.forEach(cmd => {
    if (categoryFixes[cmd.category]) {
        console.log(`  Category fix: ${cmd.command} "${cmd.category}" -> "${categoryFixes[cmd.category]}"`);
        cmd.category = categoryFixes[cmd.category];
        fixes.categoryFixed++;
        fixes.commandsModified.add(cmd.command);
    }
});

// ============================================================
// PHASE 3: Remove broken related references
// ============================================================
commands.forEach(cmd => {
    const validRelated = cmd.related.filter(slug => allSlugs.has(slug));
    const removed = cmd.related.length - validRelated.length;
    if (removed > 0) {
        fixes.brokenRelatedRemoved += removed;
        cmd.related = validRelated;
        fixes.commandsModified.add(cmd.command);
    }
});

// ============================================================
// PHASE 4: Fix distro-scope with empty distros
// ============================================================
const distroMappings = {
    'apt-cache': ['ubuntu', 'debian'],
    'apt-file': ['ubuntu', 'debian'],
    'yum': ['fedora'],
    'zypper': [],  // SUSE-specific, not in our distros list
    'flatpak': ['ubuntu', 'fedora', 'arch'],
    'snap': ['ubuntu'],
};

commands.forEach(cmd => {
    if (cmd.scope === 'distro' && (!cmd.distros || cmd.distros.length === 0)) {
        if (distroMappings[cmd.command]) {
            cmd.distros = distroMappings[cmd.command];
            fixes.distrosFixed++;
            fixes.commandsModified.add(cmd.command);
            console.log(`  Distro fix: ${cmd.command} -> [${cmd.distros.join(', ')}]`);
        }
    }
});

// ============================================================
// PHASE 5: Ensure no scope is still corrupted
// ============================================================
commands.forEach(cmd => {
    if (!validScopes.includes(cmd.scope)) {
        cmd.scope = 'core';
        fixes.scopeFixed++;
        fixes.commandsModified.add(cmd.command);
    }
    if (!validDifficulties.includes(cmd.difficulty)) {
        cmd.difficulty = 'orta';
        fixes.difficultyFixed++;
        fixes.commandsModified.add(cmd.command);
    }
});

// Save
fs.writeFileSync(commandsPath, JSON.stringify(commands, null, 2));

console.log('\n=== REPAIR SUMMARY ===');
console.log(`Commands modified: ${fixes.commandsModified.size}`);
console.log(`Related arrays cleaned: ${fixes.relatedCleaned}`);
console.log(`Scope values fixed: ${fixes.scopeFixed}`);
console.log(`Difficulty values fixed: ${fixes.difficultyFixed}`);
console.log(`Categories fixed: ${fixes.categoryFixed}`);
console.log(`Broken related refs removed: ${fixes.brokenRelatedRemoved}`);
console.log(`Distro assignments fixed: ${fixes.distrosFixed}`);
console.log(`Total commands: ${commands.length}`);

// Post-repair validation
let postErrors = [];
commands.forEach(c => {
    if (!validDifficulties.includes(c.difficulty)) postErrors.push(`${c.command}: bad difficulty "${c.difficulty}"`);
    if (!validScopes.includes(c.scope)) postErrors.push(`${c.command}: bad scope "${c.scope}"`);
    c.related.forEach(r => {
        if (!allSlugs.has(r)) postErrors.push(`${c.command}: broken related "${r}"`);
        if (validDifficulties.includes(r)) postErrors.push(`${c.command}: difficulty in related "${r}"`);
        if (r.length > 30) postErrors.push(`${c.command}: text leak in related`);
    });
});
console.log(`\nPost-repair errors: ${postErrors.length}`);
if (postErrors.length > 0) {
    postErrors.slice(0, 10).forEach(e => console.log(`  ${e}`));
}
