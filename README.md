# Chef's Deck - Recipe Collection

Web上のレシピをスクレイピングして、カード形式で管理するレシピコレクションアプリです。

## 機能

- **Webスクレイピング**: URLを指定してレシピを自動取得（JSON-LD、Cookpad、汎用ブログ形式対応）
- **Gemini API統合**: 複雑なレイアウトのサイトからもAIがレシピ情報を高精度に抽出
- **AI履歴管理**: AIによる抽出履歴やトークン使用量を設定画面から確認可能
- **デッキ機能**: レシピをグループ化（デッキ）して管理。人数に合わせた一括分量計算に対応
- **お気に入り**: 頻繁に使うレシピをマーク
- **永続的保存**:
  - **レシピ**: 個別JSONファイルとしてGitHubリポジトリで永続管理
  - **デッキ・お気に入り**: ブラウザの `localStorage` で手軽に管理
- **GitHub Actions**: サーバーサイドでスクレイピングを実行し、CORS制約を回避

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

Gemini APIを使用する場合は、フロントページの設定にAPIキーを入力するか、GitHub SecretsにAPIキーを設定する必要があります。

#### 手順

1. **Gemini APIキーの取得**
   - [Google AI Studio](https://aistudio.google.com/app/apikey)にアクセス
   - APIキーを生成してコピー

2. **GitHub Secretsへの設定**
   - GitHubリポジトリの Settings > Secrets and variables > Actions
   - 「New repository secret」をクリック
   - Name: `GEMINI_API_KEY` / Secret: コピーしたキーを貼り付け

### 4. GitHub Personal Access Tokenの設定

フロントエンドからレシピの追加・保存・削除を行うために必要です。

1. **トークンの生成**
   - GitHubの Settings > Developer settings > Personal access tokens (classic)
   - `workflow` スコープにチェックを入れて生成
2. **アプリへの入力**
   - アプリ右上の「設定（歯車アイコン）」からトークンを入力して保存

### 5. GitHub Pagesの設定

1. Settings > Pages
2. Sourceを `main` ブランチの `/root` に設定して保存

## プロジェクト構造

```
chefs-deck/
├── .github/
│   └── workflows/        # 自動処理（レシピ抽出・保存・削除など）
├── api/
│   ├── recipes.json      # 全レシピの集計データ（自動生成）
│   ├── ai-usage.json     # AI使用履歴（自動生成）
│   └── decks.json        # デッキ集計（互換用）
├── data/
│   ├── recipe-*.json     # 個別のレシピJSON
│   └── ai-logs/          # AI使用時の生ログ
├── scripts/
│   ├── scrape-recipe.js  # スクレイピング核
│   └── load-recipes.js   # データ読み込み用
├── index.html            # メインアプリケーション
└── package.json          # 依存関係
```

## 技術的な詳細

### データの同期

アプリ上での操作は、以下のワークフローを通じて自動的に反映されます：

- **レシピ登録/編集**: `.github/workflows/save-recipe.yml` が実行され、個別のファイル保存と `api/recipes.json` の更新、AI履歴の同期が行われます。
- **レシピ削除**: `.github/workflows/delete-recipe.yml` が実行され、ファイルを `old/` フォルダへ移動し、集計データを更新します。

### AI履歴の確認

設定モーダルの「AI History」タブから、これまでのAI使用状況（モデル名、使用トークン数、プロンプトの内容）を確認できます。データは `api/ai-usage.json` から取得されます。

## ライセンス

MIT
