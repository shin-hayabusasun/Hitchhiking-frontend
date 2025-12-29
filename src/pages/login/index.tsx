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
			const response = await fetch('http://localhost:8000/api/user/login', {
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

			if (data.ok) {
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
   <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

            <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">


        {/* 上部余白とヘッダー */}
        <div className="flex flex-col items-center pt-12 pb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-md">
            {/* 車のアイコン */}
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </svg>
          </div>
          <h1 className="text-blue-500 text-xl font-bold tracking-wider mb-1">相乗りサービス</h1>
          <p className="text-gray-500 text-sm font-medium">アカウントにログイン</p>
        </div>

        {/* ログインカード（画像のような角の丸みが大きいデザイン） */}


        <div className="flex-1 bg-white rounded-t-[1rem] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)] px-8 pt-10 pb-12 pr-8 pl-8 ml-8 mr-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">ログイン</h2>
          <p className="text-gray-400 text-[13px] mb-8 leading-relaxed">メールアドレスとパスワードを入力してください</p>



          {/* デモアカウントセクション (1, 2) */}
          <div className="bg-blue-50 rounded-2xl p-4 mb-8 border border-blue-100">
            <div className="text-[11px] mb-3 leading-tight">


              <p className="text-blue-800 font-bold mb-1">デモアカウント</p>
              <p className="text-blue-700">一般: user@test.com / password123</p>
              <p className="text-purple-700">管理者: admin@rideshare.jp / admin123</p>


            </div>
            
            <div className="flex gap-2">
              {/* ① 一般ユーザーボタン */}
              <button 
                type="button"


                onClick={() => { setEmail(''); setPassword(''); setIsUser(1); }}


                className="flex-1 bg-white border border-gray-200 py-2.5 rounded-xl text-gray-700 text-[11px] font-bold shadow-sm active:bg-gray-50 transition-colors"
              >
                一般ユーザーで入力
              </button>
              {/* ② 管理者ボタン */}
              <button 
                type="button"


                onClick={() => { setEmail(''); setPassword(''); setIsUser(0); }}


                className="flex-1 bg-white border border-gray-200 py-2.5 rounded-xl text-purple-600 text-[11px] font-bold shadow-sm active:bg-gray-50 transition-colors"
              >
                管理者で入力
              </button>
            </div>
          </div>

          <form className="space-y-6">
            {/* ③ メールアドレス */}



			<div>
			  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">メールアドレス</label>
			  <input
				type="email"
				className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-700 placeholder:text-gray-400"
				value={email}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
				placeholder="example@email.com"
			  />
			</div>




            {/* ④ パスワード */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">パスワード</label>
              <input
                type="password"
                className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-700 placeholder:text-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-500 text-xs text-center font-medium">{error}</p>}

            {/* ⑤ ログインボタン */}
            <button
              type="button"
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-transform disabled:opacity-50"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          {/* フッターリンク */}
          <div className="mt-10 flex flex-col items-center space-y-8">





            <div className="w-full border-t border-gray-100 pt-8 text-center">
              <span className="text-gray-400 text-[13px]">アカウントをお持ちでない場合 </span>
              {/* ⑥ 新規登録 */}
              <button
                type="button"
                className="text-blue-600 text-[13px] font-bold hover:underline ml-1"
                onClick={handleRegisterClick}
              >
                新規登録
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );



}

export default LoginPage;

// % End

