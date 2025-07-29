@echo off
echo 🚀 OAuth認証アプリのセットアップを開始します...

REM .env.local ファイルが存在しない場合は作成
if not exist .env.local (
    echo 📝 .env.local ファイルを作成しています...
    copy .env.example .env.local >nul
    echo ✅ .env.local ファイルを作成しました
    echo.
    echo ⚠️  重要: .env.local ファイルを編集して、以下の値を設定してください：
    echo    - NEXTAUTH_SECRET: 長いランダム文字列
    echo    - OAuth設定 (オプション^): GoogleやGitHubのクライアントID/シークレット
    echo.
) else (
    echo ✅ .env.local ファイルは既に存在します
)

REM 依存関係のインストール
echo 📦 依存関係をインストールしています...
npm install

echo.
echo 🎉 セットアップ完了！
echo.
echo 次の手順:
echo 1. .env.local ファイルを編集して環境変数を設定
echo 2. npm run dev でアプリケーションを起動
echo 3. http://localhost:3000 でアプリケーションにアクセス
echo.
echo 📖 詳細な設定方法は README.md を参照してください
pause
