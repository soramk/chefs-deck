// GitHub Pages用のAPIエンドポイント（静的JSON生成）
// このファイルはGitHub Actionsで自動生成されます

const fs = require('fs');
const path = require('path');
const { loadAllRecipes } = require('../scripts/load-recipes');

const recipes = loadAllRecipes();
const outputPath = path.join(__dirname, '..', 'api', 'recipes.json');

// ディレクトリが存在しない場合は作成
const apiDir = path.dirname(outputPath);
if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(recipes, null, 2), 'utf-8');
console.log(`Generated recipes.json with ${recipes.length} recipes`);

