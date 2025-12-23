// % Start(小松憲生)
// 商品情報管理画面: 商品情報の一覧閲覧、新規登録、編集・削除を行う画面

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { adminApi } from '@/lib/api';
import { TitleHeader } from '@/components/TitleHeader';

interface Product {
	id: string;
	name: string;
	points: number;
	stock: number;
	description: string;
}

export function ProductManagementPage() {
	const router = useRouter();
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	// 商品一覧取得
	useEffect(() => {
		async function fetchProducts() {
			try {
				const response = await adminApi.getProducts();
				setProducts(response.products || []);
			} catch (err) {
				setError('商品情報の取得に失敗しました');
			} finally {
				setLoading(false);
			}
		}

		fetchProducts();
	}, []);

	function handleCreateClick() {
		// 新規作成画面へ（オーバーレイまたは別ページ）
		alert('新規作成機能は実装予定です');
	}

	function handleEditClick(id: string) {
		// 編集画面へ
		alert(`商品ID: ${id} の編集機能は実装予定です`);
	}

	async function handleDeleteClick(id: string) {
		if (!confirm('本当に削除しますか？')) {
			return;
		}

		try {
			await adminApi.deleteProduct(id);
			setProducts(products.filter((p) => p.id !== id));
			alert('削除しました');
		} catch (err) {
			alert('削除に失敗しました');
		}
	}

	function handleBack() {
		router.push('/admin/dashboard');
	}

	if (loading) {
		return (
			<div className="loading-container">
				<div className="loading-spinner"></div>
			</div>
		);
	}

	return (
		<div className="product-management-page">
			<TitleHeader title="商品情報管理" onBack={handleBack} />

			<div className="product-management-container">
				{error && <div className="error-message">{error}</div>}

				<div className="actions">
					<button
						type="button"
						className="btn btn-primary"
						onClick={handleCreateClick}
					>
						新規登録
					</button>
				</div>

				<div className="products-list">
					{products.map((product) => {
						return (
							<div key={product.id} className="product-card">
								<div className="product-info">
									<h3>{product.name}</h3>
									<p>{product.description}</p>
									<div className="product-details">
										<span>{product.points}pt</span>
										<span>在庫: {product.stock}</span>
									</div>
								</div>
								<div className="product-actions">
									<button
										type="button"
										className="btn btn-secondary"
										onClick={() => {
											handleEditClick(product.id);
										}}
									>
										編集
									</button>
									<button
										type="button"
										className="btn btn-danger"
										onClick={() => {
											handleDeleteClick(product.id);
										}}
									>
										削除
									</button>
								</div>
							</div>
						);
					})}
				</div>

				{products.length === 0 && !error && (
					<div className="empty-state">
						<p>商品がありません</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default ProductManagementPage;

// % End

