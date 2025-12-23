// % Start(稗田隼也)
// ホーム画面: アプリケーションのホームページUI

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export function HomePage() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	// セッション確認
	useEffect(() => {
		async function checkSession() {
			try {
				const response = await fetch('/api/user/IsLogin', {
					method: 'GET',
					credentials: 'include',
				});
				const data = await response.json();
				
				if (!response.ok || !data.ok) {
					// ログインしていない場合はログイン画面へ
					router.push('/login');
				} else {
					setLoading(false);
				}
			} catch (err) {
				router.push('/login');
			}
		}

		checkSession();
	}, [router]);

	async function handleLogout() {
		try {
			await fetch('/api/user/logout', {
				method: 'GET',
				credentials: 'include',
			});
			router.push('/login/logout');
		} catch (err) {
			console.error('ログアウトエラー:', err);
		}
	}

	function handleSettingsClick() {
		router.push('/settings');
	}

	function handlePointsClick() {
		router.push('/points');
	}

	function handleHitchhikerClick() {
		router.push('/hitch_hiker/Search');
	}

	function handleDriverClick() {
		router.push('/driver/drives');
	}

	function handleInquiryClick() {
		router.push('/inquiry');
	}

	if (loading) {
		return (
			<div className="loading-container">
				<div className="loading-spinner"></div>
			</div>
		);
	}

	return (
		<div className="home-page">
			<header className="home-header">
				<h1 className="home-title">ヒッチハイクマッチング</h1>
			</header>

			<div className="home-container">
				<div className="home-menu">
					<button
						type="button"
						className="menu-item"
						onClick={handleHitchhikerClick}
					>
						<div className="menu-icon">
							<svg
								width="48"
								height="48"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<circle cx="12" cy="12" r="10" />
								<path d="M16 16s-1.5-2-4-2-4 2-4 2" />
								<line x1="9" y1="9" x2="9.01" y2="9" />
								<line x1="15" y1="9" x2="15.01" y2="9" />
							</svg>
						</div>
						<div className="menu-label">同乗者として利用</div>
					</button>

					<button
						type="button"
						className="menu-item"
						onClick={handleDriverClick}
					>
						<div className="menu-icon">
							<svg
								width="48"
								height="48"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
								<path d="M7 11V7a5 5 0 0 1 10 0v4" />
								<circle cx="12" cy="16" r="1" />
							</svg>
						</div>
						<div className="menu-label">運転者として利用</div>
					</button>

					<button
						type="button"
						className="menu-item"
						onClick={handlePointsClick}
					>
						<div className="menu-icon">
							<svg
								width="48"
								height="48"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<line x1="12" y1="1" x2="12" y2="23" />
								<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
							</svg>
						</div>
						<div className="menu-label">ポイント</div>
					</button>

					<button
						type="button"
						className="menu-item"
						onClick={handleSettingsClick}
					>
						<div className="menu-icon">
							<svg
								width="48"
								height="48"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<circle cx="12" cy="12" r="3" />
								<path d="M12 1v6m0 6v6m-6-9H1m6 0h6m6 0h5" />
							</svg>
						</div>
						<div className="menu-label">設定</div>
					</button>

					<button
						type="button"
						className="menu-item"
						onClick={handleInquiryClick}
					>
						<div className="menu-icon">
							<svg
								width="48"
								height="48"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<circle cx="12" cy="12" r="10" />
								<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
								<line x1="12" y1="17" x2="12.01" y2="17" />
							</svg>
						</div>
						<div className="menu-label">問い合わせ</div>
					</button>

					<button
						type="button"
						className="menu-item menu-item-danger"
						onClick={handleLogout}
					>
						<div className="menu-icon">
							<svg
								width="48"
								height="48"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
								<polyline points="16 17 21 12 16 7" />
								<line x1="21" y1="12" x2="9" y2="12" />
							</svg>
						</div>
						<div className="menu-label">ログアウト</div>
					</button>
				</div>
			</div>
		</div>
	);
}

export default HomePage;

// % End
