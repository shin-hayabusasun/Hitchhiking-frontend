// % Start(小松憲生)
// 商品情報管理画面: 商品情報の一覧閲覧、新規登録、編集・削除を行う画面

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { adminApi } from '@/lib/api';
//import { TitleHeader } from '@/components/TitleHeader';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/admin/products/ProductCard';
import { ProductHeader } from '@/components/admin/products/ProductHeader';
import { ProductFormModal } from '@/components/admin/products/ProductFormModal'; // ★追加

export function ProductManagementPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    // ★追加: モーダル制御用のState
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    
    // 商品一覧取得
    useEffect(() => {
        async function fetchProducts() {
            try {
                // 指定されたモック情報のURLへ直接リクエスト
                const response = await fetch('/api/points/products', {
                    method: 'GET',
                    credentials: 'include', // 認証情報を含める（必要に応じて）
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                // レスポンスの形に合わせて products をセット
                setProducts(data.products || []); 
            } catch (err) {
                console.error('Fetch error:', err);
                setError('商品情報の取得に失敗しました');
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    const handleCreate = () => {
        // 新規作成画面へ（オーバーレイまたは別ページ）
        // alert('新規作成機能は実装予定です');
        setIsModalOpen(true);
        setEditingProduct(null);
    }

    const handleEdit = (id: string) => {
        // 編集画面へ
        const target = products.find(p => p.id === id);
        if (target) {
            setIsModalOpen(true);
            setEditingProduct(target);
        }
    }

    // ■ ハンドラ: モーダルで「保存/登録」された時
    const handleFormSubmit = async (formData: Omit<Product, 'id'>) => {
        try {
            let method = 'POST';
            let url = `/api/points/products`;

            // 編集モードならURLとメソッドを変更
            if (editingProduct) {
                method = 'PUT';
                url = `/api/points/products/${editingProduct.id}`;
            }

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert(editingProduct ? '更新しました' : '登録しました');
                setIsModalOpen(false); // モーダルを閉じる
                fetchProducts();       // リストを再取得
            } else {
                alert('処理に失敗しました');
            }
        } catch (error) {
            alert('エラーが発生しました');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('本当に削除しますか？')) return;
        try {
            // await fetch(`${API_BASE_URL}/api/points/products/${id}`, { method: 'DELETE' });
            await fetch(`/api/points/products/${id}`, { method: 'DELETE' });
            setProducts(prev => prev.filter(p => p.id !== id));
            alert('削除しました');
        } catch (err) {
            alert('削除に失敗しました');
        }
    };

    const handleBack = () => {
        router.push('/admin/dashboard');
    }

    // ローディング画面のデザイン調整
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-[390px] aspect-[9/19] bg-white shadow-2xl rounded-[3rem] flex items-center justify-center">
                    <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            
            {/* スマホ枠 */}
            <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto rounded-[3rem]">

                <ProductHeader onBack={handleBack} onCreate={handleCreate} />

                {/* コンテンツエリア：余白を追加 */}
                <div className="p-5 pb-20"> 
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {products.map((product) => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                onEdit={handleEdit} 
                                onDelete={handleDelete} 
                            />
                        ))}
                    </div>

                    {products.length === 0 && !error && (
                        <div className="text-center py-10 text-gray-400">
                            <p>商品がありません</p>
                        </div>
                    )}
                </div>

                {/* ★追加: モーダルコンポーネント */}
                {/* 条件分岐(isModalOpen)はコンポーネント内で行っても良いですが、ここで囲むとデータのリセットが明確になります */}
                <ProductFormModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleFormSubmit}
                    initialData={editingProduct}
                />

            </div>
        </div>
    );
}

export default ProductManagementPage;

// % End


