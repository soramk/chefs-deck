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

### 3. GitHub Secretsの設定（Gemini APIを使用する場合）

Gemini APIを使用する場合は、GitHub SecretsにAPIキーを設定する必要があります。

#### 手順：

1. **Gemini APIキーの取得**
   - [Google AI Studio](https://makersuite.google.com/app/apikey)にアクセス
   - Googleアカウントでログイン
   - 「Create API Key」をクリックしてAPIキーを生成
   - 生成されたAPIキーをコピー

2. **GitHub Secretsへの設定**
   - GitHubリポジトリのページに移動
   - 「Settings」タブをクリック
   - 左メニューから「Secrets and variables」>「Actions」を選択
   - 「New repository secret」をクリック
   - Name: `GEMINI_API_KEY`
   - Secret: コピーしたAPIキーを貼り付け
   - 「Add secret」をクリック

**注意**: Gemini APIキーはオプションです。通常のスクレイピングプロトコル（JSON-LD、Cookpad形式など）で抽出できる場合は、Gemini APIは不要です。複雑なレイアウトや、通常のプロトコルで抽出できない場合のみ使用してください。

### 4. GitHub Personal Access Tokenの設定（自動実行機能を使用する場合）

フロントエンドから直接GitHub Actionsを実行するには、GitHub Personal Access Tokenが必要です。

#### 手順：

1. **Personal Access Tokenの生成**
   - GitHubにログイン
   - 右上のプロフィール画像をクリック > 「Settings」
   - 左メニューから「Developer settings」を選択
   - 「Personal access tokens」>「Tokens (classic)」を選択
   - 「Generate new token」>「Generate new token (classic)」をクリック
   - Note: `Chef's Deck Workflow` など適当な名前を入力
   - Expiration: 有効期限を設定（推奨: 90日またはNo expiration）
   - Scopes: `workflow` にチェックを入れる
   - 「Generate token」をクリック
   - **重要**: 表示されたトークンをコピー（後で表示できません）

2. **トークンの入力**
   - アプリで初めてレシピを追加する際、トークンの入力を求められます
   - コピーしたトークンを貼り付け
   - トークンはブラウザのlocalStorageに保存されます（セキュリティに注意）

**注意**: 
- トークンはブラウザのlocalStorageに保存されます
- トークンを削除したい場合は、ブラウザの開発者ツールから `localStorage.removeItem('GITHUB_TOKEN')` を実行
- トークンが不要な場合は、手動でGitHub Actionsページから実行することも可能です

### 5. GitHub Pagesの設定

1. リポジトリのSettings > Pages
2. Sourceを`main`ブランチの`/root`に設定
3. 保存

## 使い方

### レシピの追加

#### 自動実行（推奨）

1. アプリのURL入力欄にレシピのURLを入力
2. 必要に応じて「Gemini APIを使用」にチェック
3. 「カード化」ボタンをクリック
4. 初回のみ、GitHub Personal Access Tokenの入力を求められます
5. ワークフローが自動的に実行されます
6. 約60秒後に自動的にレシピが表示されます

#### 手動実行

1. アプリのURL入力欄にレシピのURLを入力
2. 「カード化」ボタンをクリック
3. トークン入力画面で「キャンセル」を選択
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

