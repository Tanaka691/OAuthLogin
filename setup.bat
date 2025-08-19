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
echo 📦 Node.js依存関係をインストールしています...
npm install
if %errorlevel% neq 0 (
    echo ❌ npm install でエラーが発生しました
    pause
    exit /b 1
)
echo ✅ Node.js依存関係のインストール完了

REM Pythonの依存関係チェックとインストール
echo 🐍 Python環境をチェックしています...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    python3 --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Pythonが見つかりません
        echo    Python 3.7以上をインストールしてください: https://www.python.org/downloads/
        pause
        exit /b 1
    ) else (
        echo ✅ Python3が見つかりました
    )
) else (
    echo ✅ Pythonが見つかりました
)

echo 📦 Python依存関係をインストールしています...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    pip3 install -r requirements.txt
    if %errorlevel% neq 0 (
        echo ⚠️  pip install でエラーが発生しました
        echo    手動でインストールしてください: pip install gradio==5.35.0
    ) else (
        echo ✅ Python依存関係のインストール完了
    )
) else (
    echo ✅ Python依存関係のインストール完了
)

echo.
echo 🎉 セットアップ完了！
echo.
echo 次の手順:
echo 1. .env.local ファイルを編集して環境変数を設定
echo 2. npm run dev でアプリケーションを起動
echo 3. http://localhost:3000 でアプリケーションにアクセス
echo 4. サインイン後にGradioアプリを起動できます
echo.
echo 📖 詳細な設定方法は README.md を参照してください
echo.
echo 📋 インストールされた依存関係:
echo    - Node.js: Next.js, NextAuth.js, React
echo    - Python: Gradio 5.35.0
pause
pause
