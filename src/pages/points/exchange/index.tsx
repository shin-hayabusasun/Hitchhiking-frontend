// % Start(AI Assistant)
// ポイント交換画面（商品検索・交換手続き）

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader';

interface Product {
	id: string;
	name: string;
	description: string;
	points: number;
	stock: number;
	image?: string;
}

export function PointExchangePage() {
	const router = useRouter();
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [searchKeyword, setSearchKeyword] = useState('');

	useEffect(() => {
		async function fetchProducts() {
			try {
				const response = await fetch('/api/points/products', {
					method: 'GET',
					credentials: 'include',
				});
				const data = await response.json();
				if (response.ok && data.products) {
					setProducts(data.products);
				}
			} catch (err) {
				setError('商品情報の取得に失敗しました');
			} finally {
				setLoading(false);
			}
		}
		fetchProducts();
	}, []);

	const filteredProducts = products.filter((p) =>
		p.name.toLowerCase().includes(searchKeyword.toLowerCase())
	);

	async function handleExchange(productId: string, points: number) {
		if (!confirm(`${points}ポイントで交換しますか？`)) {
			return;
		}

		try {
			const response = await fetch('/api/points/exchange', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ productId }),
			});

			if (response.ok) {
				alert('交換が完了しました');
				router.push('/points/orders');
			} else {
				const data = await response.json();
				alert(data.message || '交換に失敗しました');
			}
		} catch (err) {
			alert('交換に失敗しました');
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100">
				<TitleHeader title="商品交換" backPath="/points" />
				<main className="p-8 text-center">
					<p>読み込み中...</p>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<TitleHeader title="商品交換" backPath="/points" />
			<main className="p-8">
				<div className="bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-2xl font-bold mb-6">商品を探す</h2>

					<div className="mb-6">
						<input
							type="text"
							placeholder="商品名で検索..."
							className="shadow border rounded w-full py-2 px-3"
							value={searchKeyword}
							onChange={(e) => setSearchKeyword(e.target.value)}
						/>
					</div>

					{error && <p className="text-red-500 mb-4">{error}</p>}

					{filteredProducts.length === 0 ? (
						<p className="text-center text-gray-600">商品が見つかりませんでした</p>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{filteredProducts.map((product) => (
								<div
									key={product.id}
									className="border rounded-lg p-4 shadow hover:shadow-lg transition"
								>
									{product.image && (
										<img
											src={product.image}
											alt={product.name}
											className="w-full h-40 object-cover rounded mb-4"
										/>
									)}
									<h3 className="font-bold text-lg mb-2">{product.name}</h3>
									<p className="text-gray-600 text-sm mb-4">
										{product.description}
									</p>
									<div className="flex justify-between items-center">
										<span className="text-blue-600 font-bold text-lg">
											{product.points.toLocaleString()}P
										</span>
										<button
											onClick={() => handleExchange(product.id, product.points)}
											className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
											disabled={product.stock === 0}
										>
											{product.stock === 0 ? '在庫なし' : '交換する'}
										</button>
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

export default PointExchangePage;

// % End

