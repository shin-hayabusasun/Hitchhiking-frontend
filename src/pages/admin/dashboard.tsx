// % Start(五藤暖葵)
// 管理者ホーム画面: 管理者向けの重要指標表示および各管理メニューへの導線画面

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Stats {
	totalUsers: number;
	totalOrders: number;
	totalProductsnumber: number;
	issuedPoints: number;
}

export function AdminDashboardPage() {
	const router = useRouter();
	const [stats, setStats] = useState<Stats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	// 統計情報取得
	useEffect(() => {
		async function fetchStats() {
			try {
				const response = await fetch('/api/admin/stats', {
					method: 'GET',
					credentials: 'include',
				});
				const data = await response.json();
				setStats(data);
			} catch (err) {
				setError('統計情報の取得に失敗しました');
			} finally {
				setLoading(false);
			}
		}

		fetchStats();
	}, []);

	function handleCustomersClick() {
		router.push('/admin/users');
	}

	function handleProductsClick() {
		router.push('/admin/products/products');
	}

	function handleStocksClick() {
		router.push('/admin/products/stocks');
	}

	function handleOrdersClick() {
		router.push('/admin/orders/orders');
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

	if (loading) {
		return (
			<div className="loading-container">
				<div className="loading-spinner"></div>
			</div>
		);
	}

	return (
		<div className="admin-dashboard-page">
			<header className="admin-header">
				<h1>管理者ダッシュボード</h1>
			</header>

			<div className="admin-dashboard-container">
				{error && <div className="error-message">{error}</div>}

				<div className="stats-grid">
					<div className="stat-card">
						<div className="stat-label">総顧客数</div>
						<div className="stat-value">
							{stats?.totalUsers.toLocaleString() || 0}
						</div>
					</div>
					<div className="stat-card">
						<div className="stat-label">総注文数</div>
						<div className="stat-value">
							{stats?.totalOrders.toLocaleString() || 0}
						</div>
					</div>
					<div className="stat-card">
						<div className="stat-label">総商品数</div>
						<div className="stat-value">
							{stats?.totalProductsnumber.toLocaleString() || 0}
						</div>
					</div>
					<div className="stat-card">
						<div className="stat-label">付与ポイント</div>
						<div className="stat-value">
							{stats?.issuedPoints.toLocaleString() || 0}
							<span className="stat-unit">pt</span>
						</div>
					</div>
				</div>

				<div className="admin-menu">
					<button
						type="button"
						className="menu-item"
						onClick={handleCustomersClick}
					>
						<div className="menu-icon">
							<svg
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
								<circle cx="9" cy="7" r="4" />
								<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
								<path d="M16 3.13a4 4 0 0 1 0 7.75" />
							</svg>
						</div>
						<div className="menu-label">顧客管理</div>
					</button>

					<button
						type="button"
						className="menu-item"
						onClick={handleProductsClick}
					>
						<div className="menu-icon">
							<svg
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
								<polyline points="3.27 6.96 12 12.01 20.73 6.96" />
								<line x1="12" y1="22.08" x2="12" y2="12" />
							</svg>
						</div>
						<div className="menu-label">商品情報管理</div>
					</button>

					<button
						type="button"
						className="menu-item"
						onClick={handleStocksClick}
					>
						<div className="menu-icon">
							<svg
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<line x1="8" y1="6" x2="21" y2="6" />
								<line x1="8" y1="12" x2="21" y2="12" />
								<line x1="8" y1="18" x2="21" y2="18" />
								<line x1="3" y1="6" x2="3.01" y2="6" />
								<line x1="3" y1="12" x2="3.01" y2="12" />
								<line x1="3" y1="18" x2="3.01" y2="18" />
							</svg>
						</div>
						<div className="menu-label">在庫管理</div>
					</button>

					<button
						type="button"
						className="menu-item"
						onClick={handleOrdersClick}
					>
						<div className="menu-icon">
							<svg
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
								<polyline points="14 2 14 8 20 8" />
								<line x1="16" y1="13" x2="8" y2="13" />
								<line x1="16" y1="17" x2="8" y2="17" />
								<polyline points="10 9 9 9 8 9" />
							</svg>
						</div>
						<div className="menu-label">注文管理</div>
					</button>

					<button
						type="button"
						className="menu-item menu-item-danger"
						onClick={handleLogoutClick}
					>
						<div className="menu-icon">
							<svg
								width="32"
								height="32"
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

export default AdminDashboardPage;

// % End

