# 🍳 Chef's Deck - Recipe Collection

<div align="center">

![Chef's Deck Logo](logo.png)

**Web上のレシピをスクレイピングして、カード形式で管理するレシピコレクションアプリです。**

[![GitHub Pages](https://img.shields.io/badge/demo-live-success)](https://soramk.github.io/chefs-deck/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[デモを見る](https://soramk.github.io/chefs-deck/) | [機能](#機能) | [セットアップ](#セットアップ) | [使い方](#使い方) | [FAQ](#faq)

</div>

---

## ✨ 主な機能

### 🔍 スマートなレシピ取得
- **Webスクレイピング**: URLを指定してレシピを自動取得
  - JSON-LD形式（schema.org準拠）
  - Cookpad専用パーサー
  - 汎用ブログ形式対応
- **Gemini AI統合**: 複雑なレイアウトのサイトからもAIが高精度に抽出
- **GitHub Actions連携**: サーバーサイド実行でCORS制約を回避

### 📚 デッキ管理システム
- **レシピのグループ化**: 用途やシーンに合わせてデッキを作成
- **一括分量調整**: デッキ全体の人数を一度に変更可能
- **スケールファクター**: 0.5倍〜4倍まで柔軟に調整
- **デッキのインポート/エクスポート**: JSONファイルで簡単に共有

### ⭐ お気に入り機能
- よく作るレシピをワンクリックでマーク
- お気に入りのみを素早く表示

### 🤖 AI使用履歴の追跡
- AIによる抽出履歴を詳細に記録
- トークン使用量の可視化
- 使用モデルとプロンプトの確認が可能

### 💾 データの永続化
- **レシピデータ**: GitHubリポジトリで個別JSON管理
- **デッキ・お気に入り**: ブラウザのlocalStorageで管理
- **バージョン管理**: Gitによる履歴管理と復元

### 🎨 リッチなUI/UX
- カード形式の直感的なインターフェース
- リアルタイム分量計算
- レスポンシブデザイン（モバイル対応）
- ダークモード対応の設定画面

## 🚀 セットアップ

### 前提条件

- GitHubアカウント
- （オプション）Gemini APIキー（AI機能を使用する場合）

### 1. リポジトリのフォーク

このリポジトリを自分のアカウントにフォークします。

```bash
# または、クローンして新規リポジトリとして作成
git clone https://github.com/soramk/chefs-deck.git
cd chefs-deck
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. GitHub Pagesの有効化

1. リポジトリの **Settings** > **Pages** へ移動
2. **Source** を `main` ブランチの `/root` に設定
3. 保存後、数分でサイトが公開されます

**アクセスURL**: `https://[あなたのユーザー名].github.io/chefs-deck/`
### 4. Gemini APIの設定（オプション）

Gemini APIを使用すると、複雑なレイアウトのサイトからもレシピを高精度で抽出できます。

#### 4-1. APIキーの取得

1. [Google AI Studio](https://aistudio.google.com/app/apikey)にアクセス
2. APIキーを生成してコピー

#### 4-2. 設定方法（2つの方法）

**方法A: フロントエンドで設定（推奨）**
1. アプリ右上の⚙️（設定アイコン）をクリック
2. 「AI設定」タブでAPIキーを入力
3. 保存

**方法B: GitHub Secretsで設定**
1. リポジトリの **Settings** > **Secrets and variables** > **Actions**
2. **New repository secret** をクリック
3. Name: `GEMINI_API_KEY`
4. Secret: コピーしたAPIキーを貼り付け

### 5. GitHub Personal Access Token (PAT) の設定

レシピの追加・編集・削除にはGitHub PATが必要です。

#### 5-1. トークンの生成

1. GitHub **Settings** > **Developer settings** > **Personal access tokens** > **Tokens (classic)**
2. **Generate new token (classic)** をクリック
3. **Note**: `Chef's Deck` など、用途を記入
4. **Scopes**: `workflow` にチェック ✅
5. **Generate token** をクリックしてトークンをコピー

#### 5-2. アプリへの入力

1. アプリ右上の⚙️（設定アイコン）をクリック
2. 「接続設定」タブでトークンを入力
3. オーナー名（GitHubユーザー名）とリポジトリ名を確認
4. 保存

> **⚠️ 注意**: PATは安全に保管し、公開しないでください。

---

## 📖 使い方

### レシピの追加

1. **URLからインポート**
   - トップページの検索バーにレシピのURLを貼り付け
   - 「カード化」ボタンをクリック
   - GitHub Actionsがバックグラウンドで処理を実行
   - 30〜60秒後に自動的にレシピが追加されます

2. **手動で作成**
   - 画面右上の「➕」ボタンをクリック
   - 必要な情報を入力してデッキに保存

### デッキの作成と管理

1. サイドバーの「➕」アイコンをクリック
2. デッキ名を入力
3. 含めたいレシピを選択
4. 「作成する」をクリック

### 分量の調整

**個別調整**
- レシピカードをクリック
- 「人数調整」で希望の人数を入力
- 全ての材料が自動で再計算されます

**デッキ全体の調整**
- デッキを選択
- スケールファクター（×0.5〜×4）を選択
- デッキ内のすべてのレシピの分量が一括で調整されます

### レシピの検索とフィルタリング

- **検索**: 画面右上の検索バーでレシピ名や材料で検索
- **お気に入り**: ❤️ボタンでお気に入りのみ表示
- **デッキフィルター**: サイドバーでデッキを選択

### データのバックアップ

1. 画面右上の「⬇️」アイコンをクリック
2. 「全データバックアップ」を選択
3. JSONファイルがダウンロードされます

### データの復元

1. 画面右上の「⬇️」アイコンをクリック
2. サイドバーの「⬆️」アイコンでJSONファイルを選択
3. インポート

---

## 📁 プロジェクト構造

```
chefs-deck/
├── .github/
│   └── workflows/        # GitHub Actions（自動処理）
│       ├── scrape-recipe.yml    # レシピのスクレイピング
│       ├── save-recipe.yml      # レシピの保存
│       ├── delete-recipe.yml    # レシピの削除
│       ├── restore-recipe.yml   # レシピの復元
│       └── save-deck.yml        # デッキの保存
├── api/
│   ├── recipes.json      # 全レシピの集計データ（自動生成）
│   ├── ai-usage.json     # AI使用履歴（自動生成）
│   └── decks.json        # デッキ集計（互換用）
├── data/
│   ├── recipe-*.json     # 個別のレシピJSONファイル
│   └── ai-logs/          # AI使用時の詳細ログ
├── scripts/
│   ├── scrape-recipe.js  # スクレイピングコア
│   ├── load-recipes.js   # レシピデータ読み込み
│   └── load-decks.js     # デッキデータ読み込み
├── index.html            # メインアプリケーション（SPA）
├── style.css             # スタイルシート
├── logo.png              # アプリロゴ
└── package.json          # 依存関係とスクリプト
```

---

## 🔧 技術的な詳細

### 使用技術

- **フロントエンド**: React 18 (UMD), Tailwind CSS
- **バックエンド**: GitHub Actions (Node.js)
- **スクレイピング**: Cheerio, Axios
- **AI**: Google Generative AI (Gemini)
- **データストレージ**: 
  - GitHub Repository (レシピ本体)
  - LocalStorage (デッキ・お気に入り)
- **ホスティング**: GitHub Pages

### データの同期フロー

アプリ上での操作は、以下のワークフローを通じて自動的に反映されます：

| 操作 | ワークフロー | 処理内容 |
|------|-------------|---------|
| レシピ登録/編集 | `save-recipe.yml` | 個別JSONファイル保存、`recipes.json`更新、AI履歴同期 |
| レシピ削除 | `delete-recipe.yml` | ファイルを`old/`フォルダへ移動、集計データ更新 |
| レシピ復元 | `restore-recipe.yml` | `old/`フォルダから復元、集計データ更新 |
| Webスクレイピング | `scrape-recipe.yml` | URL解析、レシピ抽出、データ保存 |

### サポートしているレシピサイト

- **JSON-LD対応サイト**: schema.org準拠のサイト全般
- **Cookpad**: 専用パーサーで最適化
- **汎用ブログ**: 一般的なレシピブログ
- **その他**: Gemini AIによる柔軟な対応

### AI履歴の確認

設定モーダルの「AI History」タブから、以下の情報を確認できます：
- 使用モデル名（例: gemini-1.5-flash）
- 使用トークン数
- プロンプトの内容
- 実行日時

データは `api/ai-usage.json` から取得されます。

---

## ❓ FAQ

<details>
<summary><strong>Q: レシピが追加されない場合はどうすればいいですか？</strong></summary>

**A:** 以下を確認してください：
1. GitHub PATが正しく設定されているか
2. GitHub Actionsが有効になっているか
3. Actions タブでワークフローの実行状況を確認
4. 複雑なサイトの場合、Gemini APIを有効にしてみてください
</details>

<details>
<summary><strong>Q: Gemini APIは必須ですか？</strong></summary>

**A:** いいえ、必須ではありません。基本的なスクレイピングのみで多くのサイトに対応できます。Gemini APIは、複雑なレイアウトのサイトや、標準的なパーサーで取得できない場合の補助として使用します。
</details>

<details>
<summary><strong>Q: データはどこに保存されますか？</strong></summary>

**A:**
- **レシピデータ**: あなたのGitHubリポジトリの`data/`フォルダ
- **デッキ・お気に入り**: ブラウザのlocalStorage（ブラウザごと）
- **AI履歴**: GitHubリポジトリの`api/ai-usage.json`
</details>

<details>
<summary><strong>Q: 他の人とレシピやデッキを共有できますか？</strong></summary>

**A:** はい！以下の方法で共有できます：
1. **デッキのエクスポート**: JSONファイルとして出力し、メールやチャットで共有
2. **リポジトリ公開**: GitHubリポジトリを公開して、他の人がフォーク
3. **GitHub Pagesの共有**: あなたのChef's DeckのURLを共有
</details>

<details>
<summary><strong>Q: モバイルでも使えますか？</strong></summary>

**A:** はい、レスポンシブデザインでスマートフォンやタブレットにも対応しています。ブラウザでアクセスするだけで使用できます。
</details>

<details>
<summary><strong>Q: オフラインで使えますか？</strong></summary>

**A:** 一度読み込んだレシピはブラウザにキャッシュされますが、新しいレシピの追加や編集にはインターネット接続が必要です（GitHub APIを使用するため）。
</details>

<details>
<summary><strong>Q: レシピの分量計算の仕組みは？</strong></summary>

**A:** 各レシピには「基準の人数」が設定されており、それに対する倍率（スケールファクター）を計算して、すべての材料の分量を自動調整します。デッキモードでは、複数のレシピを一括で調整できます。
</details>

---

## 🤝 コントリビューション

貢献を歓迎します！以下の方法で参加できます：

### バグ報告・機能リクエスト

[Issues](https://github.com/soramk/chefs-deck/issues)から報告してください。

### プルリクエスト

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### 開発環境のセットアップ

```bash
# リポジトリをクローン
git clone https://github.com/soramk/chefs-deck.git
cd chefs-deck

# 依存関係をインストール
npm install

# ローカルサーバーで起動（例：live-server）
npx live-server
```

---

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

---

## 🙏 謝辞

- **React** - UI構築
- **Tailwind CSS** - スタイリング
- **Cheerio** - HTMLパース
- **Google Generative AI** - AIによるレシピ抽出
- **GitHub** - ホスティングとCI/CD

---

## 📞 お問い合わせ

質問や提案がある場合は、[Issues](https://github.com/soramk/chefs-deck/issues)または[Discussions](https://github.com/soramk/chefs-deck/discussions)をご利用ください。

---

<div align="center">

Made with ❤️ by [soramk](https://github.com/soramk)

⭐ このプロジェクトが役に立ったら、スターをつけてください！

</div>
