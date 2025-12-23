// % Start(AI Assistant)
// 注文管理画面。注文一覧確認とステータス管理

import { useState, useEffect } from 'react';
import { TitleHeader } from '@/components/TitleHeader';

interface Order {
	id: string;
	orderNumber: string;
	customerName: string;
	productName: string;
	quantity: number;
	totalAmount: number;
	status: string;
	orderDate: string;
}

interface OrderStats {
	totalOrders: number;
	readyCount: number;
	shippedCount: number;
}

export function OrderManagementPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [stats, setStats] = useState<OrderStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		fetchData();
	}, [statusFilter]);

	async function fetchData() {
		try {
			const statusParam = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
			const [ordersRes, statsRes] = await Promise.all([
				fetch(`/api/admin/orders${statusParam}`, {
					method: 'GET',
					credentials: 'include',
				}),
				fetch('/api/admin/orders/stats', {
					method: 'GET',
					credentials: 'include',
				}),
			]);

			const ordersData = await ordersRes.json();
			const statsData = await statsRes.json();

			if (ordersRes.ok && ordersData.orders) {
				setOrders(ordersData.orders);
			}
			if (statsRes.ok) {
				setStats({
					totalOrders: statsData.total_orders || 0,
					readyCount: statsData.ready_count || 0,
					shippedCount: statsData.shipped_count || 0,
				});
			}
		} catch (err) {
			setError('データの取得に失敗しました');
		} finally {
			setLoading(false);
		}
	}

	async function handleUpdateStatus(orderId: string, newStatus: string) {
		if (!confirm(`ステータスを「${getStatusLabel(newStatus)}」に変更しますか？`)) {
			return;
		}

		try {
			const response = await fetch(`/api/admin/orders/${orderId}/status`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ status: newStatus }),
			});

			const data = await response.json();
			if (response.ok) {
				alert('ステータスを更新しました');
				fetchData();
			} else {
				alert(data.message || '更新に失敗しました');
			}
		} catch (err) {
			alert('更新に失敗しました');
		}
	}

	const filteredOrders = orders.filter((order) =>
		order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
		order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	function getStatusLabel(status: string) {
		switch (status) {
			case 'pending':
				return '準備中';
			case 'shipped':
				return '発送済み';
			case 'delivered':
				return '配達完了';
			default:
				return status;
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'pending':
				return 'text-yellow-600 bg-yellow-100';
			case 'shipped':
				return 'text-blue-600 bg-blue-100';
			case 'delivered':
				return 'text-green-600 bg-green-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100">
				<TitleHeader title="注文管理" backPath="/admin/dashboard" />
				<main className="p-8 text-center">
					<p>読み込み中...</p>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<TitleHeader title="注文管理" backPath="/admin/dashboard" />
			<main className="p-8">
				<h2 className="text-2xl font-bold mb-6">注文管理</h2>

				{stats && (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
						<div className="bg-white p-6 rounded-lg shadow-md">
							<h3 className="text-lg font-semibold text-gray-600">総注文数</h3>
							<p className="text-3xl font-bold text-blue-600">
								{stats.totalOrders.toLocaleString()}
							</p>
						</div>
						<div className="bg-white p-6 rounded-lg shadow-md">
							<h3 className="text-lg font-semibold text-gray-600">
								出荷準備中
							</h3>
							<p className="text-3xl font-bold text-yellow-600">
								{stats.readyCount.toLocaleString()}
							</p>
						</div>
						<div className="bg-white p-6 rounded-lg shadow-md">
							<h3 className="text-lg font-semibold text-gray-600">発送済み</h3>
							<p className="text-3xl font-bold text-green-600">
								{stats.shippedCount.toLocaleString()}
							</p>
						</div>
					</div>
				)}

				<div className="bg-white p-6 rounded-lg shadow-md">
					<div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
						<div className="flex space-x-2">
							<button
								onClick={() => setStatusFilter('all')}
								className={`px-4 py-2 rounded ${
									statusFilter === 'all'
										? 'bg-blue-500 text-white'
										: 'bg-gray-200 text-gray-700'
								}`}
							>
								全て
							</button>
							<button
								onClick={() => setStatusFilter('pending')}
								className={`px-4 py-2 rounded ${
									statusFilter === 'pending'
										? 'bg-yellow-500 text-white'
										: 'bg-gray-200 text-gray-700'
								}`}
							>
								準備中
							</button>
							<button
								onClick={() => setStatusFilter('shipped')}
								className={`px-4 py-2 rounded ${
									statusFilter === 'shipped'
										? 'bg-blue-500 text-white'
										: 'bg-gray-200 text-gray-700'
								}`}
							>
								発送済み
							</button>
							<button
								onClick={() => setStatusFilter('delivered')}
								className={`px-4 py-2 rounded ${
									statusFilter === 'delivered'
										? 'bg-green-500 text-white'
										: 'bg-gray-200 text-gray-700'
								}`}
							>
								配達完了
							</button>
						</div>

						<input
							type="text"
							placeholder="注文番号・顧客名で検索..."
							className="shadow border rounded py-2 px-3 flex-1 md:max-w-xs"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>

					{error && <p className="text-red-500 mb-4">{error}</p>}

					{filteredOrders.length === 0 ? (
						<p className="text-center text-gray-600">注文がありません</p>
					) : (
						<div className="space-y-4">
							{filteredOrders.map((order) => (
								<div key={order.id} className="border rounded-lg p-4">
									<div className="flex justify-between items-start mb-2">
										<div>
											<h4 className="font-bold text-lg">
												注文番号: {order.orderNumber}
											</h4>
											<p className="text-sm text-gray-600">
												顧客名: {order.customerName}
											</p>
											<p className="text-sm text-gray-600">
												商品: {order.productName} × {order.quantity}
											</p>
											<p className="text-sm text-gray-600">
												注文日: {order.orderDate}
											</p>
										</div>
										<div className="text-right">
											<p className="text-lg font-bold text-blue-600">
												{order.totalAmount.toLocaleString()}円
											</p>
											<span
												className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
													order.status
												)}`}
											>
												{getStatusLabel(order.status)}
											</span>
										</div>
									</div>

									<div className="mt-4 flex justify-end space-x-2">
										{order.status === 'pending' && (
											<button
												onClick={() =>
													handleUpdateStatus(order.id, 'shipped')
												}
												className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded text-sm"
											>
												発送済みにする
											</button>
										)}
										{order.status === 'shipped' && (
											<button
												onClick={() =>
													handleUpdateStatus(order.id, 'delivered')
												}
												className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded text-sm"
											>
												配達完了にする
											</button>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</main>
		</div>
	);
}

export default OrderManagementPage;

// % End

