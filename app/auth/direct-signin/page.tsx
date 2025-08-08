'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { signIn, getCsrfToken } from 'next-auth/react';

export default function DirectSignIn() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const token = await getCsrfToken();
        setCsrfToken(token || '');
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };
    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    
    try {
      // CSRFトークンを再取得して最新の状態にする
      const latestCsrfToken = await getCsrfToken();
      
      // NextAuth.js の signIn 関数を使用
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
        callbackUrl: '/',
        csrfToken: latestCsrfToken,
      });

      if (result?.error) {
        setError('ログインに失敗しました: ' + result.error);
      } else if (result?.ok) {
        // 成功時はホームページにリダイレクト
        router.push('/');
        router.refresh();
      } else {
        setError('予期しないエラーが発生しました');
      }
    } catch (error) {
      setError('ネットワークエラーが発生しました');
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            テスト認証ページ
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            OAuth設定前でもテストできる簡易認証システム
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {csrfToken && (
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          )}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              デモ用ログイン
            </h3>
            <p className="text-sm text-blue-700 mb-4">
              以下のテスト用認証情報を使用してログインできます：
            </p>
            <div className="text-sm text-blue-600 mb-4 bg-blue-100 p-2 rounded">
              <strong>ユーザー名:</strong> test<br/>
              <strong>パスワード:</strong> test
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  ユーザー名
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  defaultValue="test"
                  required
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="test"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  パスワード
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  defaultValue="test"
                  required
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="test"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  ログイン中...
                </div>
              ) : (
                '直接ログイン'
              )}
            </button>
          </div>
        </form>
        
        <div className="text-center space-y-2">
          <a
            href="/auth/signin"
            className="text-blue-600 hover:text-blue-500 text-sm block"
          >
            ← メインサインインページに戻る
          </a>
        </div>
      </div>
    </div>
  );
}
