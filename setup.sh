#!/bin/bash

echo "🚀 OAuth認証アプリのセットアップを開始します..."

# .env.local ファイルが存在しない場合は作成
if [ ! -f .env.local ]; then
    echo "📝 .env.local ファイルを作成しています..."
    cp .env.example .env.local
    echo "✅ .env.local ファイルを作成しました"
    echo ""
    echo "⚠️  重要: .env.local ファイルを編集して、以下の値を設定してください："
    echo "   - NEXTAUTH_SECRET: 長いランダム文字列"
    echo "   - OAuth設定 (オプション): GoogleやGitHubのクライアントID/シークレット"
    echo ""
else
    echo "✅ .env.local ファイルは既に存在します"
fi

# 依存関係のインストール
echo "📦 依存関係をインストールしています..."
npm install

echo ""
echo "🎉 セットアップ完了！"
echo ""
echo "次の手順:"
echo "1. .env.local ファイルを編集して環境変数を設定"
echo "2. npm run dev でアプリケーションを起動"
echo "3. http://localhost:3000 でアプリケーションにアクセス"
echo ""
echo "📖 詳細な設定方法は README.md を参照してください"
