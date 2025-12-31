// % Start(五藤暖葵)
// 設定ホーム画面: プロフィール設定、通知設定、ログアウトなどへの導線を提供する画面

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader';

interface UserInfo {
	name: string;
	email: string;
	isVerified: boolean;
}

export function SettingsPage() {
	const router = useRouter();
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	// ユーザー情報取得
	useEffect(() => {
		async function fetchUserInfo() {
			try {
				const response = await fetch('/api/users/me', {
					method: 'GET',
					credentials: 'include',
				});
				const data = await response.json();
				setUserInfo(data);
			} catch (err) {
				setError('ユーザー情報の取得に失敗しました');
			} finally {
				setLoading(false);
			}
		}

		fetchUserInfo();
	}, []);

	function handleIdentityClick() {
		router.push('/settings/identity');
	}

	function handleNotificationsClick() {
		router.push('/settings/notifications');
	}

	function handlePaymentClick() {
		router.push('/settings/payment');
	}

	async function handleLogoutClick() {
		if (!confirm('ログアウトしますか？')) {
			return;
		}

		try {
			await fetch('/api/user/logout', {
				method: 'GET',
				credentials: 'include',
			});
			router.push('/login/logout');
		} catch (err) {
			alert('ログアウトに失敗しました');
		}
	}

	function handleBack() {
		router.push('/');
	}

	if (loading) {
		return (
			<div className="loading-container">
				<div className="loading-spinner"></div>
			</div>
		);
	}

	return (
		<div className="settings-page">
			<TitleHeader title="設定" onBack={handleBack} />

			<div className="settings-container">
				{error && <div className="error-message">{error}</div>}

				<div className="user-info-section">
					<div className="user-avatar">
						<svg
							width="60"
							height="60"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
							<circle cx="12" cy="7" r="4" />
						</svg>
					</div>
					<div className="user-info">
						<h2 className="user-name">{userInfo?.name || 'ユーザー'}</h2>
						<p className="user-email">{userInfo?.email || ''}</p>
					</div>
				</div>

				<div className="settings-menu">
					<button
						type="button"
						className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 
						flex items-center justify-between hover:bg-gray-50 transition-colors"
						onClick={handleIdentityClick}
					>
						<div className="menu-icon">
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
								<circle cx="12" cy="7" r="4" />
							</svg>
						</div>
						<span>本人確認</span>
						<svg
							className="menu-arrow"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M9 18l6-6-6-6" />
						</svg>
					</button>

					<button
						type="button"
						className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 
						flex items-center justify-between hover:bg-gray-50 transition-colors"
						onClick={handleNotificationsClick}
					>
						<div className="menu-icon">
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
								<path d="M13.73 21a2 2 0 0 1-3.46 0" />
							</svg>
						</div>
						<span>通知設定</span>
						<svg
							className="menu-arrow"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M9 18l6-6-6-6" />
						</svg>
					</button>

					<button
						type="button"
						className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 
						flex items-center justify-between hover:bg-gray-50 transition-colors"
						onClick={handlePaymentClick}
					>
						<div className="menu-icon">
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
								<line x1="1" y1="10" x2="23" y2="10" />
							</svg>
						</div>
						<span>決済情報</span>
						<svg
							className="menu-arrow"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M9 18l6-6-6-6" />
						</svg>
					</button>

					<button
						type="button"
						className="w-full bg-white p-4 rounded-2xl shadow-sm border border-red-100
						flex items-center justify-center gap-2 text-red-600 
						font-bold hover:bg-red-50 transition-colors"
						onClick={handleLogoutClick}
					>
						<div className="menu-icon">
							<svg
								width="24"
								height="24"
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
						<span>ログアウト</span>
					</button>
				</div>
			</div>
		</div>
	);
}

export default SettingsPage;

// % End