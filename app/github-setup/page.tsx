export default function GitHubOAuthGuide() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            GitHub OAuth設定ガイド
          </h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                手順1: GitHub Settingsにアクセス
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>
                  <a 
                    href="https://github.com/settings/developers" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    GitHub Developer Settings
                  </a>
                  にアクセス
                </li>
                <li>「OAuth Apps」をクリック</li>
                <li>「New OAuth App」をクリック</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                手順2: OAuth Appの設定
              </h2>
              <div className="bg-gray-100 p-4 rounded-md space-y-2">
                <div><strong>Application name:</strong> My OAuth App</div>
                <div><strong>Homepage URL:</strong> http://localhost:3000</div>
                <div><strong>Application description:</strong> OAuth authentication app</div>
                <div><strong>Authorization callback URL:</strong> http://localhost:3000/api/auth/callback/github</div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                手順3: 認証情報の取得
              </h2>
              <p className="text-gray-700 mb-4">
                アプリを作成すると、Client IDとClient Secretが生成されます。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                手順4: 環境変数の設定
              </h2>
              <p className="text-gray-700 mb-4">
                <code>.env.local</code>ファイルを更新：
              </p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto">
                <pre>{`# GitHub OAuth Configuration
GITHUB_CLIENT_ID=あなたのGitHubクライアントID
GITHUB_CLIENT_SECRET=あなたのGitHubクライアントシークレット`}</pre>
              </div>
            </section>

            <section className="bg-blue-50 border border-blue-200 rounded-md p-6">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                ✅ 現在の状況
              </h2>
              <p className="text-blue-700 mb-4">
                現在、GitHubログインは一時的に無効になっています。<br/>
                Googleログインとテストログインのみ利用可能です。
              </p>
              <div className="space-y-2">
                <div>✅ Google OAuth: 設定済み</div>
                <div>⏸️ GitHub OAuth: 一時的に無効</div>
                <div>✅ テストログイン: 利用可能</div>
              </div>
            </section>
          </div>

          <div className="mt-8 flex space-x-4 justify-center">
            <a
              href="/auth/signin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              サインインページへ
            </a>
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              ホームに戻る
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
