# OAuth認証アプリ

Next.js 15とNextAuth.js v5を使用したOAuth認証システムです。

## 🚀 クイックスタート

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

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

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセス

## ⚙️ OAuth設定方法

### Google OAuth設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成または既存のプロジェクトを選択
3. 「APIとサービス」→「認証情報」に移動
4. 「認証情報を作成」→「OAuth 2.0 クライアントID」を選択
5. アプリケーションタイプで「ウェブアプリケーション」を選択
6. 承認済みのリダイレクトURIに以下を追加：
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (本番環境用)
7. クライアントIDとクライアントシークレットを`.env.local`に設定

### GitHub OAuth設定

1. [GitHub Settings](https://github.com/settings/developers)にアクセス
2. 「OAuth Apps」→「New OAuth App」をクリック
3. 以下の情報を入力：
   - Application name: `Your App Name`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. アプリケーションを作成後、Client IDとClient Secretを`.env.local`に設定

## 🔧 機能

- ✅ Google OAuth認証
- ✅ GitHub OAuth認証
- ✅ テスト用認証システム（開発環境）
- ✅ セッション管理
- ✅ 認証保護ページ
- ✅ CSRFトークン保護
- ✅ エラーハンドリング

## 📝 テスト方法

### テスト用認証

実際のOAuth設定前にアプリケーションをテストできます：

1. サインインページで「テストログイン」ボタンをクリック
2. username: `test`, password: `test` でログイン
3. 認証機能の動作を確認

### OAuth認証のテスト

1. Google/GitHubのOAuth設定を完了
2. 各プロバイダーのボタンをクリック
3. リダイレクトされてログイン
4. 認証後、アプリケーションに戻る

## 🚨 トラブルシューティング

### よくある問題と解決方法

1. **CSRFエラー (MissingCSRF)**
   - `NEXTAUTH_SECRET`が正しく設定されているか確認
   - 開発サーバーを再起動
   - 解決済み：CSRFトークンの適切な処理を実装

2. **リダイレクトエラー**
   - OAuthアプリケーションのリダイレクトURIが正しいか確認
   - `NEXTAUTH_URL`が正しく設定されているか確認

3. **認証プロバイダーエラー**
   - クライアントIDとシークレットが正しいか確認
   - OAuthアプリケーションが有効になっているか確認

## 📂 プロジェクト構造

```
├── app/
│   ├── api/auth/[...nextauth]/route.ts  # NextAuth.js APIルート
│   ├── auth/                            # 認証関連ページ
│   │   ├── signin/page.tsx             # サインインページ
│   │   └── error/page.tsx              # エラーページ
│   ├── test/page.tsx                   # 認証保護されたテストページ
│   ├── layout.tsx                      # ルートレイアウト
│   └── page.tsx                        # ホームページ
├── lib/
│   └── auth.ts                         # NextAuth.js設定
├── components/
│   └── AuthProvider.tsx               # 認証プロバイダー
└── .env.local                          # 環境変数
```

## 🔐 セキュリティ

- CSRFトークン保護
- セキュアなセッション管理
- 環境変数による機密情報の保護
- 本番環境用のセキュリティ設定

---

NextAuth.js v5 + Next.js 15による現代的なOAuth認証システム
