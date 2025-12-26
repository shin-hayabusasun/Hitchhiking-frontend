// % Start(小松暉)
// 申請確認画面: 同乗者からのリクエストを一覧表示し、承認/拒否を行う

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { applicationApi } from '@/lib/api';
import { DriverHeader } from '@/components/driver/DriverHeader';

interface Request {
	id: string;
	driveId: string;
	passengerId: string;
	passengerName: string;
	message?: string;
	createdAt: string;
}

export function DriverRequestsPage() {
	const router = useRouter();

	const currentPath = router.pathname; // 現在のURLを取得

  // どのページがどのパスに対応するか定義
  const tabs = [
    { name: 'マイドライブ', path: '/driver/drives' },
    { name: '申請確認', path: '/driver/requests' },
    { name: '近くの募集', path: '/driver/nearby' },
    { name: '募集検索', path: '/driver/search' },
  ];
  const styles = {
		container: {
			maxWidth: '448px', // max-w-md と同じ幅
			margin: '0 auto',  // mx-auto (中央寄せ)
			padding: '1rem',   // px-4 pt-4 相当
			width: '100%',
		},
		tabsList: {
			display: 'grid',
			gridTemplateColumns: 'repeat(4, 1fr)', // 4等分
			gap: '4px',
			backgroundColor: '#f3f4f6', // 薄いグレー背景
			padding: '4px',
			borderRadius: '8px',
			marginBottom: '1rem',
		},
		buttonBase: {
			position: 'relative' as const,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			fontSize: '12px', // フォントサイズを明示
			padding: '8px 4px',
			borderRadius: '6px',
			border: 'none',
			cursor: 'pointer',
			width: '100%',
			fontWeight: 500,
			textDecoration: 'none',
			transition: 'all 0.2s',
			lineHeight: '1.5', // 高さを確保
		},
		// アクティブ時のスタイル
		active: {
			backgroundColor: '#ffffff', // 白背景
			color: '#000000',           // ★文字色を黒に固定
			boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
		},
		// 非アクティブ時のスタイル
		inactive: {
			backgroundColor: 'transparent',
			color: '#6b7280',           // ★文字色をグレーに固定
		},
	};

	const [requests, setRequests] = useState<Request[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	
	

	// 申請一覧取得
	useEffect(() => {
		async function fetchRequests() {
			try {
				const response = await applicationApi.getRequests('pending');
				setRequests(response.requests || []);
			} catch (err) {
				setError('申請情報の取得に失敗しました');
			} finally {
				setLoading(false);
			}
		}

		fetchRequests();
	}, []);

	async function handleApprove(id: string) {
		if (!confirm('この申請を承認しますか？')) {
			return;
		}

		try {
			await applicationApi.approveApplication(id);
			setRequests(requests.filter((req) => req.id !== id));
			alert('承認しました');
		} catch (err) {
			alert('承認に失敗しました');
		}
	}

	async function handleReject(id: string) {
		if (!confirm('この申請を拒否しますか？')) {
			return;
		}

		try {
			await applicationApi.rejectApplication(id);
			setRequests(requests.filter((req) => req.id !== id));
			alert('拒否しました');
		} catch (err) {
			alert('拒否に失敗しました');
		}
	}

	// function handleTabClick(tab: string) {
	// 	if (tab === 'drives') {
	// 		router.push('/driver/drives');
	// 	} else if (tab === 'nearby') {
	// 		router.push('/driver/nearby');
	// 	} else if (tab === 'search') {
	// 		router.push('/driver/search');
	// 	}
	// }

	return (
		<div className="driver-requests-page">
			<DriverHeader title="申請確認" />

			<div style={styles.container}>
				<div style={styles.tabsList}>
					{tabs.map((tab) => {
						const isActive = currentPath === tab.path;

						// スタイルを結合 (基本 + アクティブ/非アクティブ)
						const currentButtonStyle = {
							...styles.buttonBase,
							...(isActive ? styles.active : styles.inactive)
						};

						return (
							<button
								key={tab.id}
								type="button"
								style={currentButtonStyle}
								onClick={() => router.push(tab.path)}
							>
								{tab.name}
							</button>
						);
					})}
				</div>

				{loading && (
					<div className="loading-container">
						<div className="loading-spinner"></div>
					</div>
				)}

				{error && <div className="error-message">{error}</div>}

				{!loading && !error && requests.length === 0 && (
					<div className="empty-state">
						<p>現在、申請はありません</p>
					</div>
				)}

				{!loading && !error && requests.length > 0 && (
					<div className="requests-list">
						{requests.map((request) => {
							return (
								<div key={request.id} className="request-card">
									<div className="request-header">
										<h3>{request.passengerName}</h3>
										<span className="request-date">
											{new Date(
												request.createdAt
											).toLocaleDateString('ja-JP')}
										</span>
									</div>
									{request.message && (
										<div className="request-message">
											<p>{request.message}</p>
										</div>
									)}
									<div className="request-actions">
										<button
											type="button"
											className="btn btn-danger"
											onClick={() => {
												handleReject(request.id);
											}}
										>
											拒否
										</button>
										<button
											type="button"
											className="btn btn-primary"
											onClick={() => {
												handleApprove(request.id);
											}}
										>
											承認
										</button>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

export default DriverRequestsPage;

// % End

