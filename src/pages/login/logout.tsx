// % Start(稗田隼也)
// ログアウト完了画面: ログアウトが完了したことを示す画面のUI

import { useRouter } from 'next/router';

export function LogoutPage() {
	const router = useRouter();

	function handleLoginClick() {
		router.push('/login');
	}

	return (
		<div className="logout-page">
			<div className="logout-container">
				<div className="logout-icon">
					<svg
						width="80"
						height="80"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#2196F3"
						strokeWidth="2"
					>
						<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
						<polyline points="16 17 21 12 16 7" />
						<line x1="21" y1="12" x2="9" y2="12" />
					</svg>
				</div>
				<h1 className="logout-title">ログアウトしました</h1>
				<p className="logout-message">
					ご利用ありがとうございました。
					<br />
					またのご利用をお待ちしております。
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

export default LogoutPage;

// % End

