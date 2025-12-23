// % Start(Assistant)
// マイリクエスト画面 - 同乗者が申請したリクエストの一覧と状態を表示
// % End

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface Request {
	id: string;
	driveId: string;
	driverName: string;
	origin: string;
	destination: string;
	date: string;
	time: string;
	status: 'pending' | 'approved' | 'rejected' | 'completed';
	fee: number;
}

export const MyRequestPage: React.FC = () => {
	const router = useRouter();
	const [requests, setRequests] = useState<Request[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>('');
	const [activeTab, setActiveTab] = useState<string>('pending');

	useEffect(() => {
		fetchMyRequests();
	}, [activeTab]);

	const fetchMyRequests = async () => {
		setLoading(true);
		setError('');
		
		try {
			const response = await fetch(`/api/hitchhiker/my-requests?status=${activeTab}`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
			});
			const data = await response.json();

			if (response.ok && data.success) {
				setRequests(data.data);
			} else {
				setError(data.error || 'リクエスト情報の取得に失敗しました。');
			}
		} catch (err) {
			setError('ネットワークエラーが発生しました。');
		} finally {
			setLoading(false);
		}
	};

	const handleCancelRequest = async (requestId: string) => {
		if (!confirm('この申請をキャンセルしますか？')) return;

		try {
			const response = await fetch(`/api/hitchhiker/requests/${requestId}/cancel`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
			});
			const data = await response.json();

			if (response.ok && data.success) {
				alert('申請をキャンセルしました。');
				fetchMyRequests();
			} else {
				alert(data.error || 'キャンセルに失敗しました。');
			}
		} catch (err) {
			alert('ネットワークエラーが発生しました。');
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'pending': return '承認待ち';
			case 'approved': return '承認済み';
			case 'rejected': return '拒否';
			case 'completed': return '完了';
			default: return status;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'pending': return '#FFA500';
			case 'approved': return '#4CAF50';
			case 'rejected': return '#F44336';
			case 'completed': return '#2196F3';
			default: return '#999';
		}
	};

	return (
		<>
			<Head>
				<title>マイリクエスト | ヒッチハイクマッチング</title>
			</Head>

			<div style={styles.container}>
				<header style={styles.header}>
					<button onClick={() => router.back()} style={styles.backButton}>
						← 戻る
					</button>
					<h1 style={styles.title}>マイリクエスト</h1>
					<div style={{ width: '50px' }}></div>
				</header>

				{/* タブ */}
				<div style={styles.tabs}>
					<button
						style={{
							...styles.tab,
							...(activeTab === 'pending' ? styles.activeTab : {}),
						}}
						onClick={() => setActiveTab('pending')}
					>
						承認待ち
					</button>
					<button
						style={{
							...styles.tab,
							...(activeTab === 'approved' ? styles.activeTab : {}),
						}}
						onClick={() => setActiveTab('approved')}
					>
						承認済み
					</button>
					<button
						style={{
							...styles.tab,
							...(activeTab === 'completed' ? styles.activeTab : {}),
						}}
						onClick={() => setActiveTab('completed')}
					>
						完了
					</button>
				</div>

				<main style={styles.main}>
					{error && <div style={styles.error}>{error}</div>}

					{loading ? (
						<div style={styles.loading}>読み込み中...</div>
					) : requests.length === 0 ? (
						<div style={styles.empty}>
							<p>該当するリクエストがありません。</p>
						</div>
					) : (
						<div style={styles.requestList}>
							{requests.map((request) => (
								<div key={request.id} style={styles.requestCard}>
									<div style={styles.cardHeader}>
										<span
											style={{
												...styles.statusBadge,
												backgroundColor: getStatusColor(request.status),
											}}
										>
											{getStatusText(request.status)}
										</span>
										<span style={styles.date}>{request.date}</span>
									</div>

									<div style={styles.cardBody}>
										<div style={styles.route}>
											<div style={styles.routePoint}>
												<div style={styles.originDot}></div>
												<span>{request.origin}</span>
											</div>
											<div style={styles.routeLine}></div>
											<div style={styles.routePoint}>
												<div style={styles.destinationDot}></div>
												<span>{request.destination}</span>
											</div>
										</div>

										<div style={styles.info}>
											<p style={styles.infoRow}>
												<strong>運転者:</strong> {request.driverName}
											</p>
											<p style={styles.infoRow}>
												<strong>出発時刻:</strong> {request.time}
											</p>
											<p style={styles.infoRow}>
												<strong>料金:</strong> ¥{request.fee.toLocaleString()}
											</p>
										</div>
									</div>

									<div style={styles.cardFooter}>
										<button
											onClick={() => router.push(`/hitch_hiker/DriveDetail/${request.driveId}`)}
											style={styles.detailButton}
										>
											詳細を見る
										</button>
										{request.status === 'pending' && (
											<button
												onClick={() => handleCancelRequest(request.id)}
												style={styles.cancelButton}
											>
												キャンセル
											</button>
										)}
										{request.status === 'completed' && (
											<button
												onClick={() => router.push(`/hitch_hiker/review/${request.driveId}`)}
												style={styles.reviewButton}
											>
												レビューする
											</button>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</main>
			</div>
		</>
	);
};

const styles: { [key: string]: React.CSSProperties } = {
	container: {
		minHeight: '100vh',
		backgroundColor: '#f5f5f5',
	},
	header: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: '16px',
		backgroundColor: '#fff',
		borderBottom: '1px solid #ddd',
		position: 'sticky' as 'sticky',
		top: 0,
		zIndex: 10,
	},
	backButton: {
		fontSize: '16px',
		background: 'none',
		border: 'none',
		cursor: 'pointer',
		color: '#333',
	},
	title: {
		fontSize: '20px',
		fontWeight: 'bold',
		margin: 0,
	},
	tabs: {
		display: 'flex',
		backgroundColor: '#fff',
		borderBottom: '1px solid #ddd',
	},
	tab: {
		flex: 1,
		padding: '12px',
		fontSize: '14px',
		background: 'none',
		border: 'none',
		cursor: 'pointer',
		color: '#666',
		borderBottom: '2px solid transparent',
	},
	activeTab: {
		color: '#4CAF50',
		borderBottom: '2px solid #4CAF50',
		fontWeight: 'bold',
	},
	main: {
		padding: '16px',
	},
	error: {
		backgroundColor: '#ffebee',
		color: '#c62828',
		padding: '12px',
		borderRadius: '4px',
		marginBottom: '16px',
	},
	loading: {
		textAlign: 'center' as 'center',
		padding: '40px',
		color: '#666',
	},
	empty: {
		textAlign: 'center' as 'center',
		padding: '40px',
		color: '#999',
	},
	requestList: {
		display: 'flex',
		flexDirection: 'column' as 'column',
		gap: '16px',
	},
	requestCard: {
		backgroundColor: '#fff',
		borderRadius: '8px',
		padding: '16px',
		boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
	},
	cardHeader: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: '12px',
	},
	statusBadge: {
		display: 'inline-block',
		padding: '4px 12px',
		borderRadius: '12px',
		fontSize: '12px',
		fontWeight: 'bold',
		color: '#fff',
	},
	date: {
		fontSize: '14px',
		color: '#666',
	},
	cardBody: {
		marginBottom: '12px',
	},
	route: {
		display: 'flex',
		alignItems: 'center',
		marginBottom: '12px',
	},
	routePoint: {
		display: 'flex',
		alignItems: 'center',
		gap: '8px',
	},
	originDot: {
		width: '12px',
		height: '12px',
		borderRadius: '50%',
		backgroundColor: '#4CAF50',
	},
	destinationDot: {
		width: '12px',
		height: '12px',
		borderRadius: '50%',
		backgroundColor: '#F44336',
	},
	routeLine: {
		flex: 1,
		height: '2px',
		backgroundColor: '#ddd',
		margin: '0 8px',
	},
	info: {
		fontSize: '14px',
		color: '#333',
	},
	infoRow: {
		margin: '4px 0',
	},
	cardFooter: {
		display: 'flex',
		gap: '8px',
	},
	detailButton: {
		flex: 1,
		padding: '10px',
		backgroundColor: '#2196F3',
		color: '#fff',
		border: 'none',
		borderRadius: '4px',
		cursor: 'pointer',
		fontSize: '14px',
	},
	cancelButton: {
		flex: 1,
		padding: '10px',
		backgroundColor: '#F44336',
		color: '#fff',
		border: 'none',
		borderRadius: '4px',
		cursor: 'pointer',
		fontSize: '14px',
	},
	reviewButton: {
		flex: 1,
		padding: '10px',
		backgroundColor: '#FF9800',
		color: '#fff',
		border: 'none',
		borderRadius: '4px',
		cursor: 'pointer',
		fontSize: '14px',
	},
};

export default MyRequestPage;

