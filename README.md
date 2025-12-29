# Chef's Deck - Recipe Collection

Web上のレシピをスクレイピングして、カード形式で管理するレシピコレクションアプリです。

## 機能

- **Webスクレイピング**: URLを指定してレシピを自動取得
- **複数レイアウト対応**: JSON-LD、Cookpad、汎用ブログ形式などに対応
- **Gemini API統合**: 複雑なレイアウトにはGemini APIを使用して抽出
- **永続的保存**: レシピデータをJSONファイルとしてGitHubで管理
- **分量計算**: 人数に応じて材料の分量を自動計算
- **GitHub Actions**: CORS制約を回避してサーバーサイドでスクレイピング

## セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-username/chefs-deck.git
cd chefs-deck
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. GitHub Secretsの設定

GitHubリポジトリのSettings > Secrets and variables > Actionsで以下を設定：

- `GEMINI_API_KEY`: Gemini APIのキー（オプション、Gemini APIを使用する場合）

### 4. GitHub Pagesの設定

1. リポジトリのSettings > Pages
2. Sourceを`main`ブランチの`/root`に設定
3. 保存

## 使い方

### レシピの追加

1. アプリのURL入力欄にレシピのURLを入力
2. 必要に応じて「Gemini APIを使用」にチェック
3. 「カード化」ボタンをクリック
4. GitHub Actionsページが開くので、手動でワークフローを実行
   - URLを入力
   - Gemini API使用オプションを選択
5. ワークフロー完了後、自動的にレシピが表示されます

### スクレイピングプロトコル

アプリは以下の順序でスクレイピングを試みます：

1. **JSON-LD**: 構造化データから抽出
2. **Cookpad**: Cookpad専用セレクター
3. **汎用ブログ**: 一般的なレシピブログ形式

どのプロトコルも失敗した場合、またはGemini APIオプションが有効な場合、Gemini APIを使用してテキストから抽出します。

## プロジェクト構造

```
chefs-deck/
├── .github/
│   └── workflows/
│       └── scrape-recipe.yml    # GitHub Actionsワークフロー
├── api/
│   └── recipes.json.js           # レシピJSON生成スクリプト
├── data/
│   └── recipe-*.json             # 個別のレシピデータ
├── scripts/
│   ├── scrape-recipe.js          # メインスクレイピングスクリプト
│   └── load-recipes.js           # レシピ読み込みユーティリティ
├── index.html                    # メインアプリケーション
├── style.css                     # スタイルシート
└── package.json                  # 依存関係
```

## レシピデータ形式

```json
{
  "id": 1234567890,
  "title": "レシピ名",
  "url": "https://example.com/recipe",
  "image": "https://example.com/image.jpg",
  "ingredients": [
    {
      "name": "材料名",
      "amount": "200",
      "unit": "g"
    }
  ],
  "steps": ["手順1", "手順2"],
  "baseServings": 2,
  "notes": "",
  "scrapedAt": "2024-01-01T00:00:00.000Z",
  "scrapingProtocol": "jsonLd",
  "source": "example.com"
}
```

## 開発

### ローカルでスクレイピングをテスト

```bash
RECIPE_URL="https://example.com/recipe" USE_GEMINI=false node scripts/scrape-recipe.js
```

### レシピデータの読み込み

```bash
node scripts/load-recipes.js
```

## ライセンス

MIT

