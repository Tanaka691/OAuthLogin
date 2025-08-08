'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// カウンターコンポーネント
function Counter() {
  const [count, setCount] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);

  const increment = () => {
    setCount(prev => prev + 1);
    setTotalClicks(prev => prev + 1);
  };

  const decrement = () => {
    setCount(prev => Math.max(0, prev - 1));
    setTotalClicks(prev => prev + 1);
  };

  const reset = () => {
    setCount(0);
    setTotalClicks(prev => prev + 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">🎉 カウンターアプリ</h2>
        
        {/* カウント表示 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-6">
          <div className="text-sm text-blue-100 mb-2">📊 現在のカウント</div>
          <div className="text-4xl font-bold">{count}</div>
        </div>

        {/* ボタン群 */}
        <div className="space-y-3 mb-6">
          <button 
            onClick={increment}
            className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <span>➕</span>
            <span>+1 増加</span>
          </button>
          
          <button 
            onClick={decrement}
            className="w-full py-3 px-6 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <span>➖</span>
            <span>-1 減少</span>
          </button>
          
          <button 
            onClick={reset}
            className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <span>🔄</span>
            <span>リセット</span>
          </button>
        </div>

        {/* 統計情報 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">総クリック数</div>
          <div className="text-2xl font-bold text-gray-900">{totalClicks}</div>
        </div>

        {/* ヘルプテキスト */}
        <div className="mt-6 text-xs text-gray-500">
          💡 ボタンをクリックしてカウンターを操作してください
        </div>
      </div>
    </div>
  );
}

// Gradioサーバー管理コンポーネント
function GradioManager() {
  const [gradioStatus, setGradioStatus] = useState<'stopped' | 'starting' | 'running' | 'error'>('stopped');
  const [gradioUrl, setGradioUrl] = useState<string>('');
  const [showIframe, setShowIframe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const startGradio = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      setGradioStatus('starting');
      
      console.log('Starting Gradio...');
      const response = await fetch('/api/gradio');
      const data = await response.json();
      
      console.log('Gradio API response:', data);
      
      if (data.status === 'starting' || data.status === 'running') {
        setGradioUrl(data.url);
        setGradioStatus(data.status);
        
        // 起動状態をチェック
        if (data.status === 'starting') {
          // 定期的に状態をチェック
          const checkInterval = setInterval(async () => {
            try {
              const checkResponse = await fetch('/api/gradio');
              const checkData = await checkResponse.json();
              
              if (checkData.status === 'running') {
                setGradioStatus('running');
                setShowIframe(true);
                clearInterval(checkInterval);
              } else if (checkData.status === 'error') {
                setGradioStatus('error');
                setErrorMessage(checkData.message || 'Unknown error');
                clearInterval(checkInterval);
              }
            } catch (error) {
              console.error('Status check failed:', error);
              clearInterval(checkInterval);
            }
          }, 2000);
          
          // 30秒でタイムアウト
          setTimeout(() => {
            clearInterval(checkInterval);
            if (gradioStatus === 'starting') {
              setGradioStatus('error');
              setErrorMessage('Gradio startup timeout');
            }
          }, 30000);
        } else {
          setShowIframe(true);
        }
      } else {
        setGradioStatus('error');
        setErrorMessage(data.message || data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Failed to start Gradio:', error);
      setGradioStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const stopGradio = async () => {
    try {
      await fetch('/api/gradio', { method: 'DELETE' });
      setGradioStatus('stopped');
      setShowIframe(false);
      setGradioUrl('');
    } catch (error) {
      console.error('Failed to stop Gradio:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">🔧 Gradio サーバー管理</h3>
      
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            gradioStatus === 'running' ? 'bg-green-500' : 
            gradioStatus === 'starting' ? 'bg-yellow-500' : 
            gradioStatus === 'error' ? 'bg-red-500' : 'bg-gray-400'
          }`}></div>
          <span className="text-sm text-gray-600">
            状態: {
              gradioStatus === 'running' ? '実行中' :
              gradioStatus === 'starting' ? '起動中...' :
              gradioStatus === 'error' ? 'エラー' : '停止中'
            }
          </span>
        </div>
        {isLoading && (
          <div className="text-sm text-blue-600">処理中...</div>
        )}
      </div>
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm text-red-800">
            <strong>エラー:</strong> {errorMessage}
          </div>
        </div>
      )}

      <div className="space-x-2">
        <button
          onClick={startGradio}
          disabled={isLoading || gradioStatus === 'starting' || gradioStatus === 'running'}
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200"
        >
          {isLoading ? '処理中...' : 'Gradio起動'}
        </button>
        
        <button
          onClick={stopGradio}
          disabled={isLoading || gradioStatus === 'stopped'}
          className="py-2 px-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Gradio停止
        </button>
        
        {gradioUrl && !showIframe && gradioStatus === 'running' && (
          <button
            onClick={() => setShowIframe(true)}
            className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Gradio表示
          </button>
        )}
      </div>

      {showIframe && gradioUrl && (
        <div className="mt-6">
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="p-2 bg-gray-100 text-sm text-gray-600 flex justify-between items-center">
              <span>Gradio App (別タブで開く場合: <a href={gradioUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{gradioUrl}</a>)</span>
              <button
                onClick={() => setShowIframe(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <iframe
              src={gradioUrl}
              width="100%"
              height="600px"
              style={{ border: 'none' }}
              title="Gradio App"
              onError={() => {
                console.error('iframe failed to load');
                setErrorMessage('Gradioアプリの読み込みに失敗しました。直接リンクを試してください。');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// 認証状態を確認するラッパーコンポーネント
function TestPageWithAuth() {
  const { data: session, status } = useSession();

  // 認証成功時に自動でGradioサーバーを起動
  useEffect(() => {
    if (session) {
      // 自動でGradioサーバーを起動
      fetch('/api/gradio')
        .then(response => response.json())
        .then(data => {
          console.log('Gradio auto-start:', data);
        })
        .catch(error => {
          console.error('Failed to auto-start Gradio:', error);
        });
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
            認証が必要です
          </h1>
          <p className="text-center text-gray-600 mb-6">
            このページにアクセスするにはサインインが必要です。
          </p>
          <Link
            href="/"
            className="block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-center"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ようこそ, {session.user?.name || 'ユーザー'}さん</h1>
              {session.user?.email && (
                <p className="text-sm text-gray-500">{session.user.email}</p>
              )}
              <p className="text-sm text-gray-600 mt-2">認証済みユーザー専用のテストページです</p>
            </div>
            <Link
              href="/"
              className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ホームに戻る
            </Link>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reactカウンター */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">🔥 React カウンター</h2>
            <Counter />
          </div>

          {/* Gradioサーバー管理 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">🐍 Gradio インテグレーション</h2>
            <GradioManager />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestPageWithAuth;
