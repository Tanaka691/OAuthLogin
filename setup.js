const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 OAuth認証アプリのセットアップを開始します...');

// .env.local ファイルが存在しない場合は作成
const envLocalPath = path.join(__dirname, '.env.local');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envLocalPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📝 .env.local ファイルを作成しています...');
    fs.copyFileSync(envExamplePath, envLocalPath);
    console.log('✅ .env.local ファイルを作成しました');
    console.log('');
    console.log('⚠️  重要: .env.local ファイルを編集して、以下の値を設定してください：');
    console.log('   - NEXTAUTH_SECRET: 長いランダム文字列');
    console.log('   - OAuth設定 (オプション): GoogleやGitHubのクライアントID/シークレット');
    console.log('');
  } else {
    console.log('❌ .env.example ファイルが見つかりません');
    process.exit(1);
  }
} else {
  console.log('✅ .env.local ファイルは既に存在します');
}

// 依存関係のインストール
console.log('📦 Node.js依存関係をインストールしています...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Node.js依存関係のインストール完了');
} catch (error) {
  console.log('❌ npm install でエラーが発生しました:', error.message);
  process.exit(1);
}

// Pythonの依存関係チェックとインストール
console.log('🐍 Python環境をチェックしています...');
try {
  // Pythonが利用可能かチェック
  try {
    execSync('python --version', { stdio: 'pipe' });
    console.log('✅ Pythonが見つかりました');
  } catch {
    try {
      execSync('python3 --version', { stdio: 'pipe' });
      console.log('✅ Python3が見つかりました');
    } catch {
      console.log('❌ Pythonが見つかりません');
      console.log('   Python 3.7以上をインストールしてください: https://www.python.org/downloads/');
      process.exit(1);
    }
  }

  // pipでGradioをインストール
  console.log('📦 Python依存関係をインストールしています...');
  try {
    execSync('pip install -r requirements.txt', { stdio: 'inherit' });
    console.log('✅ Python依存関係のインストール完了');
  } catch {
    // pipが失敗した場合はpip3を試す
    try {
      execSync('pip3 install -r requirements.txt', { stdio: 'inherit' });
      console.log('✅ Python依存関係のインストール完了');
    } catch (error) {
      console.log('❌ pip install でエラーが発生しました:', error.message);
      console.log('   手動でインストールしてください: pip install gradio==5.35.0');
    }
  }
} catch (error) {
  console.log('⚠️  Python環境の設定でエラーが発生しました:', error.message);
  console.log('   手動でPython依存関係をインストールしてください: pip install gradio==5.35.0');
}

console.log('');
console.log('🎉 セットアップ完了！');
console.log('');
console.log('次の手順:');
console.log('1. .env.local ファイルを編集して環境変数を設定');
console.log('2. npm run dev でアプリケーションを起動');
console.log('3. http://localhost:3000 でアプリケーションにアクセス');
console.log('4. サインイン後にGradioアプリを起動できます');
console.log('');
console.log('📖 詳細な設定方法は README.md を参照してください');
console.log('');
console.log('📋 インストールされた依存関係:');
console.log('   - Node.js: Next.js, NextAuth.js, React');
console.log('   - Python: Gradio 5.35.0');
