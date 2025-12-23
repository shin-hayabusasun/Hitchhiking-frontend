// % Start(田所櫂人)
// マイページ画面: ユーザーの情報を表示するマイページ画面

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader';

interface UserInfo {
	name: string;
	email: string;
	isVerified: boolean;
}

export function MyPage() {
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

	function handleEditClick() {
		router.push('/settings/identity');
	}

	function handleMyRequestClick() {
		router.push('/hitch_hiker/MyRequest');
	}

	function handleBack() {
		router.push('/hitch_hiker/Search');
	}

	if (loading) {
		return (
			<div className="loading-container">
				<div className="loading-spinner"></div>
			</div>
		);
	}

	if (error || !userInfo) {
		return (
			<div className="error-container">
				<p>{error || 'ユーザー情報が見つかりません'}</p>
			</div>
		);
	}

	return (
		<div className="mypage-page">
			<TitleHeader title="マイページ" onBack={handleBack} />

			<div className="mypage-container">
				<div className="user-info-card">
					<div className="user-avatar">
						<svg
							width="80"
							height="80"
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
						<h2 className="user-name">{userInfo.name}</h2>
						<p className="user-email">{userInfo.email}</p>
						<div className="user-verification">
							{userInfo.isVerified ? (
								<span className="verified-badge">✓ 本人確認済み</span>
							) : (
								<span className="unverified-badge">
									本人確認が必要です
								</span>
							)}
						</div>
					</div>
				</div>

				<div className="mypage-menu">
					<button
						type="button"
						className="menu-item"
						onClick={handleEditClick}
					>
						<span>プロフィール編集</span>
						<svg
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
						className="menu-item"
						onClick={handleMyRequestClick}
					>
						<span>マイリクエスト</span>
						<svg
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
				</div>
			</div>
		</div>
	);
}

export default MyPage;

// % End

