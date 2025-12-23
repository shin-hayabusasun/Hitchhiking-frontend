// % Start(Assistant)
// 通知一覧画面 - 全ての通知を表示する画面
// % End

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface Notification {
	id: string;
	type: 'request' | 'approval' | 'message' | 'system';
	title: string;
	message: string;
	timestamp: string;
	isRead: boolean;
	link?: string;
}

export const NotificationsPage: React.FC = () => {
	const router = useRouter();
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>('');
	const [filter, setFilter] = useState<string>('all');

	useEffect(() => {
		fetchNotifications();
	}, []);

	const fetchNotifications = async () => {
		setLoading(true);
		setError('');
		
		try {
			const response = await fetch('/api/notifications', {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
			});
			const data = await response.json();

			if (response.ok && data.success) {
				setNotifications(data.data);
			} else {
				setError(data.error || '通知情報の取得に失敗しました。');
			}
		} catch (err) {
			setError('ネットワークエラーが発生しました。');
		} finally {
			setLoading(false);
		}
	};

	const markAsRead = async (id: string) => {
		try {
			const response = await fetch(`/api/notifications/${id}/read`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
			});
			const data = await response.json();

			if (response.ok && data.success) {
				setNotifications(prev =>
					prev.map(notif =>
						notif.id === id ? { ...notif, isRead: true } : notif
					)
				);
			}
		} catch (err) {
			console.error('Failed to mark notification as read:', err);
		}
	};

	const markAllAsRead = async () => {
		try {
			const response = await fetch('/api/notifications/read-all', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
			});
			const data = await response.json();

			if (response.ok && data.success) {
				setNotifications(prev =>
					prev.map(notif => ({ ...notif, isRead: true }))
				);
			}
		} catch (err) {
			console.error('Failed to mark all notifications as read:', err);
		}
	};

	const handleNotificationClick = (notification: Notification) => {
		markAsRead(notification.id);
		if (notification.link) {
			router.push(notification.link);
		}
	};

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case 'request': return '📩';
			case 'approval': return '✅';
			case 'message': return '💬';
			case 'system': return '🔔';
			default: return '📌';
		}
	};

	const filteredNotifications = notifications.filter(notif => {
		if (filter === 'all') return true;
		if (filter === 'unread') return !notif.isRead;
		return notif.type === filter;
	});

	const unreadCount = notifications.filter(n => !n.isRead).length;

	return (
		<>
			<Head>
				<title>通知 | ヒッチハイクマッチング</title>
			</Head>

			<div style={styles.container}>
				<header style={styles.header}>
					<button onClick={() => router.back()} style={styles.backButton}>
						← 戻る
					</button>
					<h1 style={styles.title}>通知</h1>
					{unreadCount > 0 && (
						<button onClick={markAllAsRead} style={styles.markAllButton}>
							全て既読
						</button>
					)}
				</header>

				{/* フィルター */}
				<div style={styles.filters}>
					<button
						style={{
							...styles.filterButton,
							...(filter === 'all' ? styles.activeFilter : {}),
						}}
						onClick={() => setFilter('all')}
					>
						すべて
					</button>
					<button
						style={{
							...styles.filterButton,
							...(filter === 'unread' ? styles.activeFilter : {}),
						}}
						onClick={() => setFilter('unread')}
					>
						未読 {unreadCount > 0 && `(${unreadCount})`}
					</button>
					<button
						style={{
							...styles.filterButton,
							...(filter === 'request' ? styles.activeFilter : {}),
						}}
						onClick={() => setFilter('request')}
					>
						申請
					</button>
					<button
						style={{
							...styles.filterButton,
							...(filter === 'message' ? styles.activeFilter : {}),
						}}
						onClick={() => setFilter('message')}
					>
						メッセージ
					</button>
				</div>

				<main style={styles.main}>
					{error && <div style={styles.error}>{error}</div>}

					{loading ? (
						<div style={styles.loading}>読み込み中...</div>
					) : filteredNotifications.length === 0 ? (
						<div style={styles.empty}>
							<p>通知がありません。</p>
						</div>
					) : (
						<div style={styles.notificationList}>
							{filteredNotifications.map((notification) => (
								<div
									key={notification.id}
									style={{
										...styles.notificationCard,
										...(notification.isRead ? {} : styles.unreadCard),
									}}
									onClick={() => handleNotificationClick(notification)}
								>
									<div style={styles.notificationIcon}>
										{getNotificationIcon(notification.type)}
									</div>
									<div style={styles.notificationContent}>
										<div style={styles.notificationHeader}>
											<h3 style={styles.notificationTitle}>
												{notification.title}
											</h3>
											{!notification.isRead && (
												<span style={styles.unreadBadge}>未読</span>
											)}
										</div>
										<p style={styles.notificationMessage}>
											{notification.message}
										</p>
										<span style={styles.notificationTime}>
											{notification.timestamp}
										</span>
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
	markAllButton: {
		padding: '6px 12px',
		backgroundColor: '#2196F3',
		color: '#fff',
		border: 'none',
		borderRadius: '4px',
		cursor: 'pointer',
		fontSize: '12px',
	},
	filters: {
		display: 'flex',
		gap: '8px',
		padding: '12px 16px',
		backgroundColor: '#fff',
		borderBottom: '1px solid #ddd',
		overflowX: 'auto' as 'auto',
	},
	filterButton: {
		padding: '6px 12px',
		fontSize: '14px',
		background: '#f5f5f5',
		border: '1px solid #ddd',
		borderRadius: '16px',
		cursor: 'pointer',
		whiteSpace: 'nowrap' as 'nowrap',
	},
	activeFilter: {
		backgroundColor: '#4CAF50',
		color: '#fff',
		border: '1px solid #4CAF50',
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
	notificationList: {
		display: 'flex',
		flexDirection: 'column' as 'column',
		gap: '8px',
	},
	notificationCard: {
		display: 'flex',
		gap: '12px',
		backgroundColor: '#fff',
		borderRadius: '8px',
		padding: '16px',
		boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
		cursor: 'pointer',
		transition: 'box-shadow 0.2s',
	},
	unreadCard: {
		backgroundColor: '#E3F2FD',
		borderLeft: '4px solid #2196F3',
	},
	notificationIcon: {
		fontSize: '24px',
		flexShrink: 0,
	},
	notificationContent: {
		flex: 1,
	},
	notificationHeader: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: '4px',
	},
	notificationTitle: {
		fontSize: '16px',
		fontWeight: 'bold',
		margin: 0,
		color: '#333',
	},
	unreadBadge: {
		fontSize: '10px',
		padding: '2px 8px',
		backgroundColor: '#2196F3',
		color: '#fff',
		borderRadius: '10px',
		fontWeight: 'bold',
	},
	notificationMessage: {
		fontSize: '14px',
		color: '#666',
		margin: '4px 0',
	},
	notificationTime: {
		fontSize: '12px',
		color: '#999',
	},
};

export default NotificationsPage;

