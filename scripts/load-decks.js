#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// data/decks ディレクトリからすべてのデッキJSONファイルを読み込む
function loadAllDecks() {
    const DECKS_DIR = path.join(__dirname, '..', 'data', 'decks');
    const decks = [];

    if (!fs.existsSync(DECKS_DIR)) {
        return decks;
    }

    const files = fs.readdirSync(DECKS_DIR);
    files.forEach(file => {
        if (file.endsWith('.json')) {
            try {
                const filepath = path.join(DECKS_DIR, file);
                const content = fs.readFileSync(filepath, 'utf-8');
                const deck = JSON.parse(content);
                decks.push(deck);
            } catch (error) {
                console.error(`Error loading deck ${file}:`, error);
            }
        }
    });

    return decks;
}

module.exports = { loadAllDecks };
