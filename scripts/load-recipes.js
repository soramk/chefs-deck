#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// dataディレクトリからすべてのレシピJSONファイルを読み込む
function loadAllRecipes() {
    const DATA_DIR = path.join(__dirname, '..', 'data');
    const recipes = [];
    
    if (!fs.existsSync(DATA_DIR)) {
        return recipes;
    }
    
    const files = fs.readdirSync(DATA_DIR);
    files.forEach(file => {
        if (file.endsWith('.json')) {
            try {
                const filepath = path.join(DATA_DIR, file);
                const content = fs.readFileSync(filepath, 'utf-8');
                const recipe = JSON.parse(content);
                recipes.push(recipe);
            } catch (error) {
                console.error(`Error loading ${file}:`, error);
            }
        }
    });
    
    // 日付順にソート（新しいものから）
    recipes.sort((a, b) => {
        const dateA = new Date(a.scrapedAt || a.id);
        const dateB = new Date(b.scrapedAt || b.id);
        return dateB - dateA;
    });
    
    return recipes;
}

// 単一のレシピを読み込む
function loadRecipe(id) {
    const DATA_DIR = path.join(__dirname, '..', 'data');
    const filepath = path.join(DATA_DIR, `recipe-${id}.json`);
    
    if (fs.existsSync(filepath)) {
        const content = fs.readFileSync(filepath, 'utf-8');
        return JSON.parse(content);
    }
    
    return null;
}

module.exports = { loadAllRecipes, loadRecipe };

// CLI実行時
if (require.main === module) {
    const recipes = loadAllRecipes();
    console.log(JSON.stringify(recipes, null, 2));
}

