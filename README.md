# OAuth認証アプリ

Next.js 15とNextAuth.js v5を使用したOAuth認証システムです。

## 🚀 クイックスタート

### 自動セットアップ（推奨）

```bash
# 1. リポジトリのクローン
git clone <repository-url>
cd my-app

# 2. 自動セットアップ
npm run setup

# 3. 最低限の環境変数設定
# .env.local を編集して以下を設定：
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=any-long-random-string

# 4. 開発サーバーの起動
npm run dev
```

### 手動セットアップ

```bash
# 1. 依存関係のインストール
npm install

# 2. 環境変数ファイルの作成
cp .env.example .env.local

# 3. .env.local を編集（下記参照）

# 4. 開発サーバーの起動
npm run dev
```

## ⚙️ 環境変数の設定

`.env.local`ファイルを編集して、OAuth認証の設定を行います：

```env
# NextAuth.js設定
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-very-long-secret-key-here

# Google OAuth設定
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth設定（オプション）
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## 🔧 OAuth設定方法

### Google OAuth設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成または既存のプロジェクトを選択
3. 「APIとサービス」→「認証情報」に移動
4. 「認証情報を作成」→「OAuth 2.0 クライアントID」を選択
5. アプリケーションタイプで「ウェブアプリケーション」を選択
6. 承認済みのリダイレクトURIに以下を追加：
   - `http://localhost:3000/api/auth/callback/google`
7. クライアントIDとクライアントシークレットを`.env.local`に設定

### GitHub OAuth設定

1. [GitHub Settings](https://github.com/settings/applications/new)にアクセス
2. 「New OAuth App」をクリック
3. 以下を設定：
   - Application name: `Your App Name`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. クライアントIDとクライアントシークレットを`.env.local`に設定

## 🧪 認証方法

### 利用可能な認証方法

1. **Googleログイン** - Googleアカウントでサインイン
2. **GitHubログイン** - GitHubアカウントでサインイン
3. **テストログイン** - 開発用認証（username: test, password: test）

### 認証が必要なページ

- `/test` - ログイン後にアクセス可能なテストページ

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
2. Username: `test`, Password: `test`

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 15
- **認証**: NextAuth.js v5 (beta)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **OAuth プロバイダー**: Google, GitHub

## 📝 ライセンス

MIT License
