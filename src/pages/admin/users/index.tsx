// % Start(五藤暖葵)
// 顧客管理画面: 登録ユーザーの検索、ステータス確認、警告・削除を行う管理画面

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { adminApi } from '@/lib/api';
import { TitleHeader } from '@/components/TitleHeader';

interface Customer {
	id: string;
	name: string;
	email: string;
	isVerified: boolean;
	warningCount?: number;
}

interface CustomerStats {
	total_count: number;
	verified_count: number;
	warned_count: number;
}

export function UserManagementPage() {
	const router = useRouter();
	const [customers, setCustomers] = useState<Customer[]>([]);
	const [stats, setStats] = useState<CustomerStats | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	// 顧客データ取得
	useEffect(() => {
		async function fetchData() {
			try {
				const [customersResponse, statsResponse] = await Promise.all([
					adminApi.getCustomers(),
					adminApi.getCustomerStats(),
				]);
				setCustomers(customersResponse.customers || []);
				setStats(statsResponse);
			} catch (err) {
				setError('顧客情報の取得に失敗しました');
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	async function handleWarn(id: string) {
		if (!confirm('この顧客に警告を送信しますか？')) {
			return;
		}

		try {
			await adminApi.warnCustomer(id);
			alert('警告を送信しました');
			// リロード
			window.location.reload();
		} catch (err) {
			alert('警告の送信に失敗しました');
		}
	}

	async function handleDelete(id: string) {
		if (!confirm('本当にこの顧客を削除しますか？')) {
			return;
		}

		try {
			await adminApi.deleteCustomer(id);
			setCustomers(customers.filter((c) => c.id !== id));
			alert('削除しました');
		} catch (err) {
			alert('削除に失敗しました');
		}
	}

	function handleBack() {
		router.push('/admin/dashboard');
	}

	const filteredCustomers = customers.filter((customer) => {
		return (
			customer.name.includes(searchQuery) ||
			customer.email.includes(searchQuery)
		);
	});

	if (loading) {
		return (
			<div className="loading-container">
				<div className="loading-spinner"></div>
			</div>
		);
	}

	return (
		<div className="user-management-page">
			<TitleHeader title="顧客管理" onBack={handleBack} />

			<div className="user-management-container">
				{error && <div className="error-message">{error}</div>}

				{stats && (
					<div className="stats-row">
						<div className="stat-item">
							<div className="stat-label">総数</div>
							<div className="stat-value">
								{stats.total_count.toLocaleString()}
							</div>
						</div>
						<div className="stat-item">
							<div className="stat-label">確認済み</div>
							<div className="stat-value">
								{stats.verified_count.toLocaleString()}
							</div>
						</div>
						<div className="stat-item">
							<div className="stat-label">警告中</div>
							<div className="stat-value">
								{stats.warned_count.toLocaleString()}
							</div>
						</div>
					</div>
				)}

				<div className="search-bar">
					<input
						type="text"
						className="form-input"
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value);
						}}
						placeholder="顧客名またはメールアドレスで検索"
					/>
				</div>

				<div className="customers-list">
					{filteredCustomers.map((customer) => {
						return (
							<div key={customer.id} className="customer-card">
								<div className="customer-info">
									<h3>{customer.name}</h3>
									<p>{customer.email}</p>
									<div className="customer-badges">
										{customer.isVerified && (
											<span className="badge badge-success">
												本人確認済み
											</span>
										)}
										{customer.warningCount &&
											customer.warningCount > 0 && (
												<span className="badge badge-warning">
													警告: {customer.warningCount}回
												</span>
											)}
									</div>
								</div>
								<div className="customer-actions">
									<button
										type="button"
										className="btn btn-warning"
										onClick={() => {
											handleWarn(customer.id);
										}}
									>
										警告
									</button>
									<button
										type="button"
										className="btn btn-danger"
										onClick={() => {
											handleDelete(customer.id);
										}}
									>
										削除
									</button>
								</div>
							</div>
						);
					})}
				</div>

				{filteredCustomers.length === 0 && (
					<div className="empty-state">
						<p>顧客が見つかりません</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default UserManagementPage;

// % End

