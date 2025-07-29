'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Page() {
  const { data: session, status } = useSession();

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
          OAuth認証アプリ
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
            
            <div className="space-y-2">
              <Link href="/test">
                <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  テストページへ
                </button>
              </Link>
              
              <button
                onClick={() => signOut()}
                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                サインアウト
              </button>
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