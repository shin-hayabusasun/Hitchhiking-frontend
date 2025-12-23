// % Start(AI Assistant)
// 交換した商品の注文履歴確認画面

import { useEffect, useState } from 'react';
import { TitleHeader } from '@/components/TitleHeader';

interface Order {
	id: string;
	productName: string;
	points: number;
	status: string;
	orderDate: string;
}

export function PointOrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');

	useEffect(() => {
		async function fetchOrders() {
			try {
				const response = await fetch('/api/points/orders', {
					method: 'GET',
					credentials: 'include',
				});
				const data = await response.json();
				if (response.ok && data.orders) {
					setOrders(data.orders);
				}
			} catch (err) {
				setError('注文履歴の取得に失敗しました');
			} finally {
				setLoading(false);
			}
		}
		fetchOrders();
	}, []);

	const filteredOrders = orders.filter((o) => {
		if (statusFilter === 'all') return true;
		return o.status === statusFilter;
	});

	const getStatusLabel = (status: string) => {
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
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'pending':
				return 'text-yellow-600';
			case 'shipped':
				return 'text-blue-600';
			case 'delivered':
				return 'text-green-600';
			default:
				return 'text-gray-600';
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100">
				<TitleHeader title="注文履歴" backPath="/points" />
				<main className="p-8 text-center">
					<p>読み込み中...</p>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<TitleHeader title="注文履歴" backPath="/points" />
			<main className="p-8">
				<div className="bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-2xl font-bold mb-6">注文履歴</h2>

					<div className="mb-6 flex space-x-4">
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

					{error && <p className="text-red-500 mb-4">{error}</p>}

					{filteredOrders.length === 0 ? (
						<p className="text-center text-gray-600">注文履歴がありません</p>
					) : (
						<div className="space-y-4">
							{filteredOrders.map((order) => (
								<div
									key={order.id}
									className="border rounded-lg p-4 flex justify-between items-center"
								>
									<div>
										<h3 className="font-bold text-lg">{order.productName}</h3>
										<p className="text-sm text-gray-600">
											注文日: {order.orderDate}
										</p>
										<p className="text-sm text-gray-600">
											注文番号: {order.id}
										</p>
									</div>
									<div className="text-right">
										<p className="text-blue-600 font-bold">
											{order.points.toLocaleString()}P
										</p>
										<p className={`text-sm font-semibold ${getStatusColor(order.status)}`}>
											{getStatusLabel(order.status)}
										</p>
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

export default PointOrdersPage;

// % End

