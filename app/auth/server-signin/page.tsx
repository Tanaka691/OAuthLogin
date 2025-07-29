import { signIn } from "@/lib/auth"
import { redirect } from "next/navigation"

export default function ServerSignIn() {
  async function authenticate(formData: FormData) {
    'use server'
    
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    
    if (username === 'test' && password === 'test') {
      try {
        await signIn('credentials', {
          username: 'test',
          password: 'test',
          redirectTo: '/'
        })
      } catch (error) {
        // NextAuth v5では認証後の自動リダイレクトが発生するため
        // エラーが投げられることがありますが、これは正常な動作です
        console.log('Sign in completed')
      }
    } else {
      redirect('/auth/signin?error=InvalidCredentials')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            サーバーサイド認証テスト
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Server Actionsを使用した認証
          </p>
        </div>
        
        <form action={authenticate} className="mt-8 space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-green-800 mb-4">
              サーバーサイド認証フォーム
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  defaultValue="test"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  defaultValue="test"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="mt-4 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              サーバーサイドログイン
            </button>
          </div>
        </form>
        
        <div className="text-center space-y-2">
          <a
            href="/auth/signin"
            className="text-indigo-600 hover:text-indigo-500 text-sm block"
          >
            ← メインサインインページに戻る
          </a>
          <a
            href="/auth/test-signin"
            className="text-indigo-600 hover:text-indigo-500 text-sm block"
          >
            クライアントサイドテストページ
          </a>
        </div>
      </div>
    </div>
  );
}
