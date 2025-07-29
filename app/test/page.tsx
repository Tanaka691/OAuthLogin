'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// propsがない場合は {} を指定
type Props = {};

// stateに count:number を定義
type State = {
  count: number;
};

class Counter extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { count: 0 };
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">カウンター</h2>
        <p className="text-lg mb-4">Count: {this.state.count}</p>
        <button 
          onClick={this.increment}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          クリック
        </button>
      </div>
    );
  }
}

// 認証状態を確認するラッパーコンポーネント
function TestPageWithAuth() {
  const { data: session, status } = useSession();

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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
            テストページ
          </h1>
          <div className="text-center mb-6">
            <p className="text-gray-600">ログイン中のユーザー:</p>
            <p className="text-lg font-semibold text-gray-900">
              {session.user?.name || 'ユーザー'}
            </p>
            {session.user?.email && (
              <p className="text-sm text-gray-500">{session.user.email}</p>
            )}
          </div>
          <Link
            href="/"
            className="block w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-center mb-4"
          >
            ホームに戻る
          </Link>
        </div>
        
        <Counter />
      </div>
    </div>
  );
}

export default TestPageWithAuth;
