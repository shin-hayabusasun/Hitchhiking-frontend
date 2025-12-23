// % Start(AI Assistant)
// 在庫管理画面。在庫数確認と補充

import { useState, useEffect } from 'react';
import { TitleHeader } from '@/components/TitleHeader';

interface Product {
	id: string;
	name: string;
	stock: number;
	alertThreshold: number;
}

interface StockStats {
	totalStock: number;
	warningCount: number;
	totalSales: number;
}

export function StockManagementPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [stats, setStats] = useState<StockStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [replenishId, setReplenishId] = useState<string | null>(null);
	const [replenishAmount, setReplenishAmount] = useState('');

	useEffect(() => {
		fetchData();
	}, []);

	async function fetchData() {
		try {
			const [productsRes, statsRes] = await Promise.all([
				fetch('/api/admin/products', {
					method: 'GET',
					credentials: 'include',
				}),
				fetch('/api/admin/stocks/stats', {
					method: 'GET',
					credentials: 'include',
				}),
			]);

			const productsData = await productsRes.json();
			const statsData = await statsRes.json();

			if (productsRes.ok && productsData.products) {
				setProducts(productsData.products);
			}
			if (statsRes.ok) {
				setStats({
					totalStock: statsData.total_stock || 0,
					warningCount: statsData.warning_count || 0,
					totalSales: statsData.total_sales || 0,
				});
			}
		} catch (err) {
			setError('データの取得に失敗しました');
		} finally {
			setLoading(false);
		}
	}

	async function handleReplenish(productId: string) {
		const amount = Number(replenishAmount);
		if (!amount || amount <= 0) {
			alert('正しい数量を入力してください');
			return;
		}

		try {
			const response = await fetch(`/api/admin/products/${productId}/replenish`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ amount }),
			});

			const data = await response.json();
			if (response.ok) {
				alert(`在庫を補充しました。現在庫: ${data.current_stock}`);
				setReplenishId(null);
				setReplenishAmount('');
				fetchData();
			} else {
				alert(data.message || '補充に失敗しました');
			}
		} catch (err) {
			alert('補充に失敗しました');
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100">
				<TitleHeader title="在庫管理" backPath="/admin/dashboard" />
				<main className="p-8 text-center">
					<p>読み込み中...</p>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<TitleHeader title="在庫管理" backPath="/admin/dashboard" />
			<main className="p-8">
				<h2 className="text-2xl font-bold mb-6">在庫管理</h2>

				{stats && (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
						<div className="bg-white p-6 rounded-lg shadow-md">
							<h3 className="text-lg font-semibold text-gray-600">総在庫数</h3>
							<p className="text-3xl font-bold text-blue-600">
								{stats.totalStock.toLocaleString()}
							</p>
						</div>
						<div className="bg-white p-6 rounded-lg shadow-md">
							<h3 className="text-lg font-semibold text-gray-600">在庫警告数</h3>
							<p className="text-3xl font-bold text-red-600">
								{stats.warningCount.toLocaleString()}
							</p>
						</div>
						<div className="bg-white p-6 rounded-lg shadow-md">
							<h3 className="text-lg font-semibold text-gray-600">総販売数</h3>
							<p className="text-3xl font-bold text-green-600">
								{stats.totalSales.toLocaleString()}
							</p>
						</div>
					</div>
				)}

				{error && <p className="text-red-500 mb-4">{error}</p>}

				<div className="bg-white p-6 rounded-lg shadow-md">
					<h3 className="text-xl font-bold mb-4">商品在庫一覧</h3>
					{products.length === 0 ? (
						<p className="text-center text-gray-600">商品がありません</p>
					) : (
						<div className="space-y-4">
							{products.map((product) => {
								const isLowStock = product.stock < product.alertThreshold;
								return (
									<div
										key={product.id}
										className={`border rounded-lg p-4 ${
											isLowStock ? 'border-red-300 bg-red-50' : ''
										}`}
									>
										<div className="flex justify-between items-center mb-2">
											<div>
												<h4 className="font-bold text-lg">{product.name}</h4>
												<p className="text-sm text-gray-600">
													警告閾値: {product.alertThreshold}個
												</p>
											</div>
											<div className="text-right">
												<p
													className={`text-2xl font-bold ${
														isLowStock ? 'text-red-600' : 'text-green-600'
													}`}
												>
													{product.stock}個
												</p>
												{isLowStock && (
													<p className="text-sm text-red-600 font-semibold">
														⚠️ 在庫不足
													</p>
												)}
											</div>
										</div>

										{replenishId === product.id ? (
											<div className="mt-4 flex space-x-2">
												<input
													type="number"
													className="shadow border rounded py-2 px-3 flex-1"
													value={replenishAmount}
													onChange={(e) => setReplenishAmount(e.target.value)}
													placeholder="補充数量"
													min="1"
												/>
												<button
													onClick={() => handleReplenish(product.id)}
													className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
												>
													補充
												</button>
												<button
													onClick={() => {
														setReplenishId(null);
														setReplenishAmount('');
													}}
													className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
												>
													キャンセル
												</button>
											</div>
										) : (
											<button
												onClick={() => setReplenishId(product.id)}
												className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
											>
												在庫補充
											</button>
										)}
									</div>
								);
							})}
						</div>
					)}
				</div>
			</main>
		</div>
	);
}

export default StockManagementPage;

// % End

