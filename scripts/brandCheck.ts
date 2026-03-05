import fs from 'fs';
import path from 'path';

// Bu betik, proje genelinde eski marka adı "komut.dev"in kalıp kalmadığını kontrol eder.
// Terminalden çalıştırmak için: npx tsx scripts/brandCheck.ts

const FOLDERS_TO_CHECK = ['app', 'components', 'lib', 'data', 'types'];
const EXTENSIONS = ['.ts', '.tsx', '.json', '.md'];
const FORBIDDEN_WORDS = ['komut.dev', 'komut\\.dev'];
let foundAny = false;

function checkFile(filePath: string) {
    const ext = path.extname(filePath);
    if (!EXTENSIONS.includes(ext)) return;

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        FORBIDDEN_WORDS.forEach(word => {
            const regex = new RegExp(word, 'i');
            if (regex.test(content)) {
                // Ignore specific comments
                if (content.includes(`// komut.dev`) || content.includes(`"komut.dev"`)) {
                    // Check if the only matches are in these expected places
                    // In a more robust script, we'd parse this out, but let's just log it
                }

                // Let's actually find all line numbers
                const lines = content.split('\n');
                lines.forEach((line, index) => {
                    if (regex.test(line)) {
                        console.log(`⚠️  Bulundu: ${filePath}:${index + 1} -> ${line.trim()}`);
                        foundAny = true;
                    }
                });
            }
        });
    } catch (e) {
        console.error(`Okuma hatası: ${filePath}`, e);
    }
}

function walkDir(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.next' || file === 'memory-bank') continue;

        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else {
            checkFile(fullPath);
        }
    }
}

console.log('🐧 Pengui Marka Kontrolü Başlıyor...\n-------------------------------------');

FOLDERS_TO_CHECK.forEach(folder => {
    const fullPath = path.join(process.cwd(), folder);
    if (fs.existsSync(fullPath)) {
        walkDir(fullPath);
    }
});

if (!foundAny) {
    console.log('\n✅ Tebrikler! Eski markaya ait hiçbir kalıntı bulunamadı.');
} else {
    console.log('\n❌ Lütfen yukarıdaki dosyaları kontrol edin.');
}
