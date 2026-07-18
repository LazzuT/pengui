const fs = require('fs');
const path = require('path');

const rawDataFile = process.argv[2];
if (!rawDataFile) {
    console.error("Lütfen bir .txt dosyası belirtin.");
    process.exit(1);
}

const rawData = fs.readFileSync(rawDataFile, 'utf8');

const output = rawData.trim().split('\n').filter(line => line.trim() !== '' && !line.startsWith('//')).map(line => {
    const parts = line.split('|');
    const [
        command, slug, description_tr, detail_tr, syntax, category,
        ex1_code, ex1_desc, ex2_code, ex2_desc,
        opt1_flag, opt1_desc, opt2_flag, opt2_desc,
        related, difficulty, dangerous, scope
    ] = parts.map(p => p ? p.trim() : "");

    return {
        command,
        slug: slug || command,
        description_tr,
        detail_tr,
        syntax,
        category,
        examples: [
            { code: ex1_code, desc_tr: ex1_desc },
            { code: ex2_code, desc_tr: ex2_desc }
        ].filter(e => e.code !== ""),
        options: [
            { flag: opt1_flag, desc_tr: opt1_desc },
            { flag: opt2_flag, desc_tr: opt2_desc }
        ].filter(o => o.flag !== ""),
        related: related ? related.split(',') : [],
        difficulty: difficulty || "orta",
        dangerous: dangerous === "true",
        scope: scope || "core",
        distros: []
    };
});

const outPath = rawDataFile.replace('.txt', '.json');
fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(`Generated ${output.length} commands into ${outPath}`);
