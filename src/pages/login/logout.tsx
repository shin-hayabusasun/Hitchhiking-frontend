// % Start(稗田隼也)
// ログアウト完了画面: ログアウトが完了したことを示す画面のUI

import { useRouter } from 'next/router';

export function LogoutPage() {
	const router = useRouter();

	function handleLoginClick() {
		router.push('/login');
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-sky-200 to-white flex items-center justify-center p-8">
			<div className="w-full max-w-md bg-white/90 rounded-lg shadow-md p-8 text-center">
				<div className="logout-icon mb-4 flex justify-center">
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
				<h1 className="text-2xl font-semibold mb-2">ログアウトしました</h1>
				<p className="text-sm text-gray-600 mb-6">
					ご利用ありがとうございました。
					<br />
					またのご利用をお待ちしております。
				</p>
				<button
					type="button"
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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

