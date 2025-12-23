// % Start(稗田隼也)
// 新規登録完了画面: 新規登録が完了したことを示す画面のUI

import { useRouter } from 'next/router';

export function CompletePage() {
	const router = useRouter();

	function handleLoginClick() {
		router.push('/login/logout');
	}

	return (
		<div className="complete-page">
			<div className="complete-container">
				<div className="complete-icon">
					<svg
						width="80"
						height="80"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#4CAF50"
						strokeWidth="2"
					>
						<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
						<polyline points="22 4 12 14.01 9 11.01" />
					</svg>
				</div>
				<h1 className="complete-title">登録が完了しました</h1>
				<p className="complete-message">
					ご登録ありがとうございます。
					<br />
					ログイン画面からログインしてご利用ください。
				</p>
				<button
					type="button"
					className="btn btn-primary"
					onClick={handleLoginClick}
				>
					ログイン画面へ
				</button>
			</div>
		</div>
	);
}

export default CompletePage;

// % End

