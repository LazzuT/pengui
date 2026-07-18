const fs = require('fs');
const path = require('path');

const commandsPath = path.join(__dirname, '../data/commands.json');
const keywordsPath = path.join(__dirname, '../data/commandKeywords.json');

const commands = JSON.parse(fs.readFileSync(commandsPath, 'utf8'));
const keywords = JSON.parse(fs.readFileSync(keywordsPath, 'utf8'));

const existingValues = new Set(Object.values(keywords));

let addedAliases = 0;

commands.forEach(cmd => {
    if (!existingValues.has(cmd.command)) {
        // Yeni bir komut, keyword eklemeliyiz.
        // description_tr ilk kelimesi:
        const words = cmd.description_tr.split(' ').map(w => w.toLowerCase().replace(/[^a-zöçşığü]/g, ''));
        const firstWord = words[0];
        const firstTwo = words.slice(0, 2).join(' ');

        if (firstWord && firstWord.length > 3 && !keywords[firstWord]) {
            keywords[firstWord] = cmd.command;
            addedAliases++;
        }
        if (words.length > 1 && firstTwo.length > 5 && !keywords[firstTwo]) {
            keywords[firstTwo] = cmd.command;
            addedAliases++;
        }

        // Klasör, ag arayuzu gibi ozel kelimeleri ekleyebiliriz:
        const catMap = {
            "sistem-yonetimi": "sistem",
            "ag-yonetimi": "ağ",
            "kullanici-yonetimi": "kullanıcı",
            "paket-yonetimi": "paket"
        };

        if (catMap[cmd.category] && !keywords[catMap[cmd.category] + " " + cmd.command]) {
            keywords[catMap[cmd.category] + " " + cmd.command] = cmd.command;
            addedAliases++;
        }

    }
});

fs.writeFileSync(keywordsPath, JSON.stringify(keywords, null, 4));
console.log(`Generated ${addedAliases} new keywords into commandKeywords.json`);
