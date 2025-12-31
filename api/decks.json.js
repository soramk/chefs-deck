const fs = require('fs');
const path = require('path');
const { loadAllDecks } = require('../scripts/load-decks');

const decks = loadAllDecks();
const outputPath = path.join(__dirname, '..', 'api', 'decks.json');

const apiDir = path.dirname(outputPath);
if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(decks, null, 2), 'utf-8');
console.log(`Generated decks.json with ${decks.length} decks`);
