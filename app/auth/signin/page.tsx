'use client';

import { signIn, getProviders, getCsrfToken } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Provider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

export default function SignIn() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [providersRes, csrfRes] = await Promise.all([
          getProviders(),
          getCsrfToken()
        ]);
        setProviders(providersRes);
        setCsrfToken(csrfRes || '');
      } catch (error) {
        console.error('Failed to fetch auth data:', error);
      }
    };
    fetchData();
  }, []);

  const handleSignIn = async (providerId: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // credentials プロバイダーの場合は直接フォーム送信
      if (providerId === 'credentials') {
        const formData = new FormData();
        formData.append('username', 'test');
        formData.append('password', 'test');
        formData.append('csrfToken', csrfToken);
        formData.append('callbackUrl', '/');
        
        const response = await fetch('/api/auth/callback/credentials', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          router.push('/');
        } else {
          console.error('Credentials login failed');
        }
      } else {
        // OAuth providers
        const result = await signIn(providerId, { 
          callbackUrl: '/',
          redirect: true 
        });
        
        if (result?.error) {
          console.error('Sign in error:', result.error);
        }
      }
    } catch (error) {
      console.error('Sign in failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            アカウントにサインイン
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            以下のプロバイダーを使用してサインインしてください
          </p>
        </div>
        <div className="mt-8 space-y-4">
          {/* テスト用の認証フォーム */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">テスト用ログイン</h3>
            <p className="text-xs text-yellow-700 mb-3">
              実際のOAuth設定前にテストできます（username: test, password: test）
            </p>
            <div className="space-y-2">
              <button
                onClick={() => handleSignIn('credentials')}
                disabled={isLoading}
                className="w-full py-2 px-4 border border-yellow-300 rounded-md shadow-sm text-sm font-medium text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'ログイン中...' : 'テストログイン'}
              </button>
              <a
                href="/auth/direct-signin"
                className="block w-full py-2 px-4 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center"
              >
                直接認証テスト（推奨）
              </a>
            </div>
          </div>

          {providers &&
            Object.values(providers).filter(provider => provider.id !== 'credentials').map((provider) => (
              <div key={provider.name}>
                <button
                  onClick={() => handleSignIn(provider.id)}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {provider.name === 'Google' && (
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  {provider.name === 'GitHub' && (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {provider.name} でサインイン
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
