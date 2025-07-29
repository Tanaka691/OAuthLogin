# OAuth Authentication App

Next.js + NextAuth.js を使用したOAuth認証システムのサンプルアプリケーションです。

## 🚀 クイックスタート

### 前提条件
- Node.js 18.0 以上
- npm または yarn

### インストール手順

1. **リポジトリのクローン**
```bash
git clone <your-repository-url>
cd my-app
```

2. **自動セットアップ（推奨）**
```bash
npm run setup
```

または手動セットアップ：
```bash
# 依存関係のインストール
npm install

# 環境変数テンプレートのコピー
npm run setup:example
# または
copy .env.example .env.local  # Windows
cp .env.example .env.local    # Linux/Mac
```

3. **環境変数の編集**
`.env.local` ファイルを開いて、以下の値を設定してください：

```bash
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=任意の長いランダム文字列

# Google OAuth Configuration (オプション)
GOOGLE_CLIENT_ID=あなたのGoogleクライアントID
GOOGLE_CLIENT_SECRET=あなたのGoogleクライアントシークレット

# GitHub OAuth Configuration (オプション)
GITHUB_CLIENT_ID=あなたのGitHubクライアントID
GITHUB_CLIENT_SECRET=あなたのGitHubクライアントシークレット
```

5. **開発サーバーの起動**
```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いてください。

## 🔧 OAuth設定 (オプション)

### 最低限の設定

認証機能をテストするだけなら、以下の最低限の設定で動作します：

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

**テストログイン**を使用できます：
- ユーザー名: `test`
- パスワード: `test`

### Google OAuth設定

Googleログインを使用したい場合：

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成または既存プロジェクトを選択
3. 「APIとサービス」→「認証情報」
4. 「認証情報を作成」→「OAuth 2.0 クライアント ID」
5. アプリケーションの種類：「ウェブアプリケーション」
6. 承認済みリダイレクト URI に追加：
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. クライアントIDとシークレットを`.env.local`に設定

### GitHub OAuth設定

GitHubログインを使用したい場合：

1. [GitHub Settings](https://github.com/settings/applications/new) にアクセス
2. 「New OAuth App」をクリック
3. 以下を設定：
   - Application name: `Your App Name`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. 「Register application」をクリック
5. Client IDとClient Secretを`.env.local`に設定

## 📁 プロジェクト構造

```
my-app/
├── app/
│   ├── api/auth/[...nextauth]/route.ts  # NextAuth.js API ルート
│   ├── auth/                            # 認証関連ページ
│   ├── test/                            # テストページ
│   └── page.tsx                         # ホームページ
├── lib/
│   └── auth.ts                          # NextAuth.js 設定
├── .env.local                           # 環境変数（作成が必要）
├── .env.example                         # 環境変数テンプレート
└── README.md                            # このファイル
```

## 🎮 使用方法

### 認証方法

1. **Googleログイン**: Googleアカウントでサインイン
2. **GitHubログイン**: GitHubアカウントでサインイン
3. **テストログイン**: 開発用簡易認証（username: test, password: test）

### 認証が必要なページ

- `/test` - ログイン後にアクセス可能なテストページ

## 🔐 セキュリティ注意事項

- `.env.local` ファイルは絶対にGitにコミットしないでください
- 本番環境では強力な `NEXTAUTH_SECRET` を設定してください
- OAuth アプリケーションの設定で適切なリダイレクトURIを設定してください

## 🚨 トラブルシューティング

### "There was a problem with the server configuration" エラー

このエラーが発生する場合：

1. `.env.local` ファイルが存在することを確認
2. `NEXTAUTH_SECRET` が設定されていることを確認
3. 開発サーバーを再起動：
   ```bash
   # Ctrl+C でサーバーを停止
   npm run dev
   ```

### CSRF エラー

NextAuth.js v5 ベータ版では、CSRFエラーが発生することがあります。その場合は：

1. **テストログイン**を使用: http://localhost:3000/auth/direct-signin
2. または**直接認証ページ**を使用

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 15
- **認証**: NextAuth.js v5 (beta)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **OAuth プロバイダー**: Google, GitHub

## 📝 ライセンス

MIT License
