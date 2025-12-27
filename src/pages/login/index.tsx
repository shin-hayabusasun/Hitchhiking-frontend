// % Start(稗田隼也)
// ログイン画面: ユーザーまたは管理者の認証を行うUI

import { useState } from 'react';
import { useRouter } from 'next/router';

export function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isUser, setIsUser] = useState(1);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	// バリデーション
	function validateForm() {
		if (!email) {
			setError('メールアドレスを入力してください');
			return false;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setError('正しいメールアドレス形式で入力してください');
			return false;
		}
		if (!password) {
			setError('パスワードを入力してください');
			return false;
		}
		if (password.length < 8) {
			setError('パスワードは8文字以上で入力してください');
			return false;
		}
		return true;
	}

	// ログイン処理
	async function handleLogin() {
		setError('');

		if (!validateForm()) {
			return;
		}

		setLoading(true);

		try {
			const response = await fetch('/api/user/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({
					mail: email,
					password,
					isuser: isUser,
				}),
			});

			const data = await response.json();

			if (response.ok && data.ok) {
				// セッション情報を保存（cookieに自動保存される）
				// ホーム画面へ遷移
				router.push('/');
			} else {
				setError('ログインに失敗しました。メールアドレスまたはパスワードを確認してください。');
			}
		} catch (err) {
			setError('ログインに失敗しました。もう一度お試しください。');
		} finally {
			setLoading(false);
		}
	}

	function handleRegisterClick() {
		router.push('/login/Regist');
	}

	return (
		<div className="login-page min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center pt-10 pb-6 px-4 font-sans">
    
    {/* ロゴとタイトル（画像上部） */}
    <div className="flex flex-col items-center mb-10">
      <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
        {/* 車のアイコン (SVG) */}
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <path d="M9 17h6" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      </div>
      <h1 className="text-blue-600 text-xl font-bold tracking-wider mb-1">相乗りサービス</h1>
      <p className="text-gray-500 text-sm">アカウントにログイン</p>
    </div>

    {/* ログインカード */}
    <div className="login-container w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <h2 className="login-title text-2xl font-bold text-gray-800 mb-2">ログイン</h2>
      <p className="text-gray-500 text-sm mb-8">メールアドレスとパスワードを入力してください</p>

      {/* デモアカウントセクション (元の「ログイン種別」の代わり) */}
      <div className="bg-blue-50 rounded-2xl p-5 mb-8 border border-blue-100 text-xs">
        <p className="text-blue-600 font-bold mb-1.5">デモアカウント</p>
        <p className="text-blue-500 mb-0.5">一般ユーザー: test@example.com / password123</p>
        <p className="text-purple-500 mb-4">管理者: admin@rideshare.jp / admin123</p>
        
        <div className="flex gap-3">
          {/* ① 一般ユーザーボタン */}
          <button 
            type="button"
            onClick={() => { setEmail('test@example.com'); setPassword('password123'); setIsUser(1); }}
            className="flex-1 bg-white border border-gray-300 py-2.5 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition"
          >
            一般ユーザーで入力
          </button>
          {/* ② 管理者ボタン */}
          <button 
            type="button"
            onClick={() => { setEmail('admin@rideshare.jp'); setPassword('admin123'); setIsUser(0); }}
            className="flex-1 bg-white border border-gray-300 py-2.5 rounded-xl text-purple-600 font-bold hover:bg-gray-50 transition"
          >
            管理者で入力
          </button>
        </div>
      </div>

      <div className="login-form space-y-7">
        {/* ③ メールアドレス入力 */}
        <div className="form-group">
          <label htmlFor="email" className="form-label block text-sm font-bold text-gray-700 mb-1.5">
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            className="form-input w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
          />
        </div>

        {/* ④ パスワード入力 */}
        <div className="form-group">
          <label htmlFor="password" className="form-label block text-sm font-bold text-gray-700 mb-1.5">
            パスワード
          </label>
          <input
            type="password"
            id="password"
            className="form-input w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" /* 画像に合わせてドットに変更 */
          />
        </div>

        {error && <div className="error-message text-red-500 text-sm bg-red-50 p-3 rounded-xl text-center">{error}</div>}

        {/* ⑤ ログインボタン */}
        <button
          type="button"
          className="btn btn-primary btn-block w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 shadow-md shadow-blue-100 transition active:scale-[0.98] disabled:opacity-60"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
      </div>

      {/* フッターリンク (元の新規登録ボタンの位置を変更) */}
      <div className="mt-10 flex flex-col items-center gap-6 border-t border-gray-100 pt-8">
        <button type="button" className="text-blue-500 text-sm font-medium hover:underline">
          パスワードを忘れた場合
        </button>
        
        <div className="text-center">
          <span className="text-gray-500 text-sm">アカウントをお持ちでない場合 </span>
          {/* ⑥ 新規登録 */}
          <button
            type="button"
            className="text-blue-600 text-sm font-bold hover:underline ml-1"
            onClick={handleRegisterClick}
          >
            新規登録
          </button>
        </div>
      </div>
    </div>
  </div>
	);
}

export default LoginPage;

// % End

