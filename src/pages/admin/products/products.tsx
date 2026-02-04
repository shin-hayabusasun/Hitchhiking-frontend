// 商品情報管理画面: 最新レイアウト規約を適用

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Product } from '@/types';
import { ProductCard } from '@/components/admin/products/ProductCard';
import { ProductHeader } from '@/components/admin/products/ProductHeader';
import { ProductFormModal } from '@/components/admin/products/ProductFormModal';
import { getApiUrl } from '@/config/api';

const SAMPLE_DATA = [
    { name: '10円分のクオカード（テスト）', description: '全国の加盟店で使えるクオカード', points: 10, stock: 5 },
    { name: 'Amazonギフト券 1,000円分', description: 'すぐに使えるAmazonギフト券', points: 1000, stock: 50 },
    { name: 'コンビニコーヒー無料券', description: 'セブン-イレブンで使えるコーヒー券', points: 150, stock: 100 },
    { name: 'スターバックスカード 500円分', description: 'スタバで使えるプリペイドカード', points: 500, stock: 30 },
    { name: 'クオカード 3,000円分', description: '全国の加盟店で使えるクオカード', points: 3000, stock: 0 }
];

export function ProductManagementPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const hasSeeded = useRef(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    async function seedSampleData() {
        console.log("🌱 データベースが空のため、サンプルデータを投入します...");
        try {
            for (const item of SAMPLE_DATA) {
                await fetch(getApiUrl('/api/admin/products'), {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item),
                });
            }
            console.log("✅ サンプルデータの投入完了");
        } catch (err) {
            console.error("Seed error:", err);
        }
    }

    async function fetchProducts() {
        try {
            const response = await fetch(getApiUrl('/api/admin/products'), {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            const currentList = data.products || [];

            if (currentList.length === 0) {
                if (hasSeeded.current) return; 
                hasSeeded.current = true;
                await seedSampleData();
                const retryResponse = await fetch(getApiUrl('/api/admin/products'), {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const retryData = await retryResponse.json();
                setProducts(retryData.products || []);
                return;
            } else {
                setProducts(currentList);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('データの取得に失敗しました');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCreate = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    }

    const handleEdit = (id: string) => {
        const target = products.find(p => p.id === id);
        if (target) {
            setEditingProduct(target);
            setIsModalOpen(true);
        }
    }

    const handleFormSubmit = async (formData: { name: string; points: number; stock: number; description: string }) => {
        try {
            let method = 'POST';
            let url = getApiUrl('/api/admin/products');

            if (editingProduct) {
                method = 'PUT';
                url = getApiUrl(`/api/admin/products/${editingProduct.id}`);
            }

            const response = await fetch(url, {
                method: method,
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert(editingProduct ? '更新しました' : '登録しました');
                setIsModalOpen(false);
                await fetchProducts();
            } else {
                alert('処理に失敗しました');
            }
        } catch (error) {
            console.error("エラーの詳細:", error);
            alert('エラーが発生しました。コンソール(F12)を確認してください。');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('本当に削除しますか？')) return;
        try {
            await fetch(getApiUrl(`/api/admin/products/${id}`), { method: 'DELETE' });
            setProducts(prev => prev.filter(p => p.id !== id));
            alert('削除しました');
        } catch (err) {
            alert('削除に失敗しました');
        }
    };

    const handleBack = () => {
        router.push('/admin/dashboard');
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-sky-50 flex items-center justify-center">
                <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        /* ★ 背景は画面一杯（wide）、角丸なし */
        <div className="w-full min-h-screen bg-gradient-to-b from-sky-200 to-white flex flex-col items-center font-sans">
            
            {/* ★ ヘッダー：白背景は横いっぱい、中身は max-w-2xl */}
            <header className="w-full bg-white/60 backdrop-blur-md sticky top-0 z-30 shadow-sm border-none">
                <div className="max-w-2xl mx-auto">
                    <ProductHeader onBack={handleBack} onCreate={handleCreate} />
                </div>
            </header>

            {/* ★ メインコンテンツ：max-w-2xl で中央寄せ */}
            <main className="w-full max-w-2xl flex flex-col p-5">
                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-4 rounded-2xl mb-6 text-sm font-bold text-center border-none shadow-sm">
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
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-4">
                        <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center text-3xl grayscale opacity-50 shadow-sm">📦</div>
                        <p className="text-sm font-black tracking-wider uppercase">No Products Found</p>
                    </div>
                )}

                {/* フッター余白 */}
                <div className="h-20" />
            </main>

            <ProductFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingProduct}
            />
        </div>
    );
}

export default ProductManagementPage;