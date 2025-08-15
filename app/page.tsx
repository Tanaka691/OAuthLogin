'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function Page() {
  const { data: session, status } = useSession();
  const [gradioStatus, setGradioStatus] = useState('stopped');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const startGradio = async () => {
    setIsLoading(true);
    setError('');
    setGradioStatus('starting');
    
    try {
      const response = await fetch('/api/gradio');
      const data = await response.json();
      
      if (data.status === 'running') {
        setGradioStatus('running');
        // 新しいタブでGradioを開く
        window.open('http://localhost:7860', '_blank');
      } else if (data.status === 'starting') {
        setGradioStatus('starting');
        // 数秒後に再確認
        setTimeout(async () => {
          try {
            const checkResponse = await fetch('/api/gradio');
            const checkData = await checkResponse.json();
            if (checkData.status === 'running') {
              setGradioStatus('running');
              window.open('http://localhost:7860', '_blank');
            }
          } catch (err) {
            console.error('Status check failed:', err);
          }
        }, 3000);
      } else {
        setError(data.message || 'Gradio起動に失敗しました');
        setGradioStatus('error');
      }
    } catch (err) {
      setError('APIエラーが発生しました');
      setGradioStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const stopGradio = async () => {
    try {
      await fetch('/api/gradio', { method: 'DELETE' });
      setGradioStatus('stopped');
    } catch (err) {
      console.error('Stop failed:', err);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          OAuth + Gradio アプリ
        </h1>
        
        {session ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600">ようこそ、</p>
              <p className="text-lg font-semibold text-gray-900">
                {session.user?.name || 'ユーザー'}
              </p>
              {session.user?.email && (
                <p className="text-sm text-gray-500">{session.user.email}</p>
              )}
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="プロフィール画像"
                  className="w-16 h-16 rounded-full mx-auto mt-2"
                />
              )}
            </div>
            
            <div className="space-y-4">
              {/* Gradio管理セクション */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🎮 Gradioアプリ</h3>
                
                {gradioStatus === 'stopped' && (
                  <button
                    onClick={startGradio}
                    disabled={isLoading}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {isLoading ? '起動中...' : '🚀 Gradioアプリを起動'}
                  </button>
                )}
                
                {gradioStatus === 'starting' && (
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mb-2"></div>
                    <p className="text-sm text-gray-600">Gradioアプリを起動中...</p>
                  </div>
                )}
                
                {gradioStatus === 'running' && (
                  <div className="space-y-2">
                    <div className="text-center text-sm text-green-600 mb-2">
                      ✅ Gradioアプリが実行中です
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open('http://localhost:7860', '_blank')}
                        className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        🌐 アプリを開く
                      </button>
                      <button
                        onClick={stopGradio}
                        className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        ⏹️ 停止
                      </button>
                    </div>
                  </div>
                )}
                
                {gradioStatus === 'error' && (
                  <div className="text-center">
                    <p className="text-sm text-red-600 mb-2">❌ エラーが発生しました</p>
                    {error && <p className="text-xs text-gray-500 mb-2">{error}</p>}
                    <button
                      onClick={startGradio}
                      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      🔄 再試行
                    </button>
                  </div>
                )}
              </div>
              
              {/* その他のリンク */}
              <div className="space-y-2">
                <Link href="/test">
                  <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    テストページへ
                  </button>
                </Link>
                
                <button
                  onClick={() => window.open("https://data-app-350226937602614.14.azure.databricksapps.com", "_blank")}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  📊 Databricks Appを開く
                </button>
                
                <button
                  onClick={() => signOut()}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  サインアウト
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-gray-600">
              アプリを使用するにはサインインしてください
            </p>
            
            <div className="space-y-2">
              <button
                onClick={() => signIn()}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                サインイン
              </button>
              
              <Link href="/oauth-setup">
                <button className="w-full py-2 px-4 border border-yellow-300 rounded-md shadow-sm text-sm font-medium text-yellow-800 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                  ⚙️ Google OAuth設定ガイド
                </button>
              </Link>
              
              <Link href="/auth/direct-signin">
                <button className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  🧪 テスト認証（設定前）
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}