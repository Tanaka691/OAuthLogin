export default function OAuthSetupGuide() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Google OAuth設定ガイド
          </h1>
          
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              ⚠️ 現在のエラー
            </h2>
            <p className="text-red-700">
              <code>OAuth client was not found</code> - Google OAuthの設定が必要です
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                手順1: Google Cloud Consoleにアクセス
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>
                  <a 
                    href="https://console.cloud.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Google Cloud Console
                  </a>
                  にアクセスしてログイン
                </li>
                <li>新しいプロジェクトを作成するか、既存のプロジェクトを選択</li>
                <li>左側のメニューから「APIとサービス」→「認証情報」を選択</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                手順2: OAuth同意画面の設定
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>「OAuth同意画面」タブをクリック</li>
                <li>「外部」を選択して「作成」をクリック</li>
                <li>以下の情報を入力：
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>アプリ名: <code>My OAuth App</code></li>
                    <li>ユーザーサポートメール: あなたのメールアドレス</li>
                    <li>デベロッパーの連絡先情報: あなたのメールアドレス</li>
                  </ul>
                </li>
                <li>「保存して次へ」をクリックして完了まで進む</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                手順3: OAuth 2.0クライアントIDの作成
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>「認証情報」タブに戻る</li>
                <li>「認証情報を作成」→「OAuth 2.0 クライアントID」を選択</li>
                <li>アプリケーションの種類で「ウェブアプリケーション」を選択</li>
                <li>名前: <code>OAuth Web Client</code></li>
                <li>承認済みのJavaScript生成元に追加:
                  <div className="bg-gray-100 p-2 rounded mt-2">
                    <code>http://localhost:3000</code>
                  </div>
                </li>
                <li>承認済みのリダイレクトURIに追加:
                  <div className="bg-gray-100 p-2 rounded mt-2">
                    <code>http://localhost:3000/api/auth/callback/google</code>
                  </div>
                </li>
                <li>「作成」をクリック</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                手順4: 認証情報の取得
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-yellow-800 mb-2">
                  作成後、クライアントIDとクライアントシークレットが表示されます：
                </p>
                <ul className="list-disc list-inside space-y-1 text-yellow-700">
                  <li>これらの値をコピーして保存</li>
                  <li>次の手順で<code>.env.local</code>ファイルに設定</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                手順5: 環境変数の設定
              </h2>
              <p className="text-gray-700 mb-4">
                プロジェクトの<code>.env.local</code>ファイルを以下のように更新：
              </p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto">
                <pre>{`# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-very-long-secret-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=あなたのクライアントID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=あなたのクライアントシークレット

# GitHub OAuth Configuration (Optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret`}</pre>
              </div>
            </section>

            <section className="bg-green-50 border border-green-200 rounded-md p-6">
              <h2 className="text-2xl font-semibold text-green-800 mb-4">
                ✅ 設定完了後
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-green-700">
                <li>開発サーバーを再起動</li>
                <li>
                  <a href="/auth/signin" className="text-blue-600 hover:text-blue-800 underline">
                    サインインページ
                  </a>
                  でGoogleログインをテスト
                </li>
                <li>認証が成功すれば設定完了！</li>
              </ol>
            </section>

            <section className="bg-blue-50 border border-blue-200 rounded-md p-6">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                🔧 トラブルシューティング
              </h2>
              <div className="space-y-4 text-blue-700">
                <div>
                  <h3 className="font-semibold">設定前にテストしたい場合:</h3>
                  <p>
                    <a href="/auth/direct-signin" className="text-blue-600 hover:text-blue-800 underline">
                      直接認証テストページ
                    </a>
                    でテスト用ログイン（username: test, password: test）を使用
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold">よくあるエラー:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><code>invalid_client</code>: クライアントIDまたはシークレットが間違っている</li>
                    <li><code>redirect_uri_mismatch</code>: リダイレクトURIが設定と一致していない</li>
                    <li><code>access_denied</code>: ユーザーが認証を拒否した</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              ホームに戻る
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
