// % Start(Assistant)
// 募集管理画面 - 同乗者が作成した募集を管理する画面
// % End

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface Recruitment {
	id: string;
	origin: string;
	destination: string;
	date: string;
	time: string;
	status: 'active' | 'matched' | 'completed' | 'cancelled';
	applicantsCount: number;
	fee: number;
}

export const RecruitmentManagementPage: React.FC = () => {
	const router = useRouter();
	const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>('');

	useEffect(() => {
		fetchRecruitments();
	}, []);

	const fetchRecruitments = async () => {
		setLoading(true);
		setError('');
		
		try {
			const response = await fetch('/api/hitchhiker/my-recruitments', {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
			});
			const data = await response.json();

			if (response.ok && data.success) {
				setRecruitments(data.data);
			} else {
				setError(data.error || '募集情報の取得に失敗しました。');
			}
		} catch (err) {
			setError('ネットワークエラーが発生しました。');
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteRecruitment = async (id: string) => {
		if (!confirm('この募集を削除しますか？')) return;

		try {
			const response = await fetch(`/api/hitchhiker/recruitments/${id}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
			});
			const data = await response.json();

			if (response.ok && data.success) {
				alert('募集を削除しました。');
				fetchRecruitments();
			} else {
				alert(data.error || '削除に失敗しました。');
			}
		} catch (err) {
			alert('ネットワークエラーが発生しました。');
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'active': return '募集中';
			case 'matched': return 'マッチング済み';
			case 'completed': return '完了';
			case 'cancelled': return 'キャンセル';
			default: return status;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active': return '#4CAF50';
			case 'matched': return '#2196F3';
			case 'completed': return '#9E9E9E';
			case 'cancelled': return '#F44336';
			default: return '#999';
		}
	};

	return (
		<>
			<Head>
				<title>募集管理 | ヒッチハイクマッチング</title>
			</Head>

			<div style={styles.container}>
				<header style={styles.header}>
					<button onClick={() => router.back()} style={styles.backButton}>
						← 戻る
					</button>
					<h1 style={styles.title}>募集管理</h1>
					<button
						onClick={() => router.push('/hitch_hiker/passenger/CreateDrivePassenger')}
						style={styles.addButton}
					>
						+ 新規作成
					</button>
				</header>

				<main style={styles.main}>
					{error && <div style={styles.error}>{error}</div>}

					{loading ? (
						<div style={styles.loading}>読み込み中...</div>
					) : recruitments.length === 0 ? (
						<div style={styles.empty}>
							<p>募集がありません。</p>
							<button
								onClick={() => router.push('/hitch_hiker/passenger/CreateDrivePassenger')}
								style={styles.createButton}
							>
								募集を作成する
							</button>
						</div>
					) : (
						<div style={styles.recruitmentList}>
							{recruitments.map((recruitment) => (
								<div key={recruitment.id} style={styles.recruitmentCard}>
									<div style={styles.cardHeader}>
										<span
											style={{
												...styles.statusBadge,
												backgroundColor: getStatusColor(recruitment.status),
											}}
										>
											{getStatusText(recruitment.status)}
										</span>
										{recruitment.applicantsCount > 0 && (
											<span style={styles.applicantsBadge}>
												申請 {recruitment.applicantsCount} 件
											</span>
										)}
									</div>

									<div style={styles.cardBody}>
										<div style={styles.route}>
											<div style={styles.routePoint}>
												<div style={styles.originDot}></div>
												<span>{recruitment.origin}</span>
											</div>
											<div style={styles.routeLine}></div>
											<div style={styles.routePoint}>
												<div style={styles.destinationDot}></div>
												<span>{recruitment.destination}</span>
											</div>
										</div>

										<div style={styles.info}>
											<p style={styles.infoRow}>
												<strong>出発日時:</strong> {recruitment.date} {recruitment.time}
											</p>
											<p style={styles.infoRow}>
												<strong>料金:</strong> ¥{recruitment.fee.toLocaleString()}
											</p>
										</div>
									</div>

									<div style={styles.cardFooter}>
										{recruitment.status === 'active' && (
											<>
												<button
													onClick={() => router.push(`/hitch_hiker/passenger/EditDrivePassenger?id=${recruitment.id}`)}
													style={styles.editButton}
												>
													編集
												</button>
												<button
													onClick={() => handleDeleteRecruitment(recruitment.id)}
													style={styles.deleteButton}
												>
													削除
												</button>
											</>
										)}
										{recruitment.applicantsCount > 0 && (
											<button
												onClick={() => router.push(`/hitch_hiker/recruitment/${recruitment.id}/applicants`)}
												style={styles.viewApplicantsButton}
											>
												申請を見る
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
	addButton: {
		padding: '8px 16px',
		backgroundColor: '#4CAF50',
		color: '#fff',
		border: 'none',
		borderRadius: '4px',
		cursor: 'pointer',
		fontSize: '14px',
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
	createButton: {
		marginTop: '20px',
		padding: '12px 24px',
		backgroundColor: '#4CAF50',
		color: '#fff',
		border: 'none',
		borderRadius: '4px',
		cursor: 'pointer',
		fontSize: '16px',
	},
	recruitmentList: {
		display: 'flex',
		flexDirection: 'column' as 'column',
		gap: '16px',
	},
	recruitmentCard: {
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
	applicantsBadge: {
		display: 'inline-block',
		padding: '4px 12px',
		borderRadius: '12px',
		fontSize: '12px',
		fontWeight: 'bold',
		backgroundColor: '#FF9800',
		color: '#fff',
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
	editButton: {
		flex: 1,
		padding: '10px',
		backgroundColor: '#2196F3',
		color: '#fff',
		border: 'none',
		borderRadius: '4px',
		cursor: 'pointer',
		fontSize: '14px',
	},
	deleteButton: {
		flex: 1,
		padding: '10px',
		backgroundColor: '#F44336',
		color: '#fff',
		border: 'none',
		borderRadius: '4px',
		cursor: 'pointer',
		fontSize: '14px',
	},
	viewApplicantsButton: {
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

export default RecruitmentManagementPage;

