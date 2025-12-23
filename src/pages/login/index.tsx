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
		<div className="login-page">
			<div className="login-container">
				<h1 className="login-title">ログイン</h1>

				<div className="login-form">
					<div className="form-group">
						<label htmlFor="email" className="form-label">
							メールアドレス
						</label>
						<input
							type="email"
							id="email"
							className="form-input"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							placeholder="example@email.com"
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password" className="form-label">
							パスワード
						</label>
						<input
							type="password"
							id="password"
							className="form-input"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
							}}
							placeholder="8文字以上"
						/>
					</div>

					<div className="form-group">
						<label className="form-label">ログイン種別</label>
						<div className="radio-group">
							<label className="radio-label">
								<input
									type="radio"
									name="userType"
									checked={isUser === 1}
									onChange={() => {
										setIsUser(1);
									}}
								/>
								<span>一般ユーザー</span>
							</label>
							<label className="radio-label">
								<input
									type="radio"
									name="userType"
									checked={isUser === 0}
									onChange={() => {
										setIsUser(0);
									}}
								/>
								<span>管理者</span>
							</label>
						</div>
					</div>

					{error && <div className="error-message">{error}</div>}

					<button
						type="button"
						className="btn btn-primary btn-block"
						onClick={handleLogin}
						disabled={loading}
					>
						{loading ? 'ログイン中...' : 'ログイン'}
					</button>

					<button
						type="button"
						className="btn btn-secondary btn-block"
						onClick={handleRegisterClick}
					>
						新規登録
					</button>
				</div>
			</div>
		</div>
	);
}

export default LoginPage;

// % End

