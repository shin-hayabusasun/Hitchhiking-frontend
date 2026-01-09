// % Start(小松憲生)
// 商品情報管理画面

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/admin/products/ProductCard';
import { ProductHeader } from '@/components/admin/products/ProductHeader';
import { ProductFormModal } from '@/components/admin/products/ProductFormModal';

const API_BASE_URL = 'http://127.0.0.1:8000';

export function ProductManagementPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // ★重要: useEffect の外に定義する
    async function fetchProducts() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/nori/products`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setProducts(data.products || []); 
        } catch (err) {
            console.error('Fetch error:', err);
            setError('データの取得に失敗しました');
        } finally {
            setLoading(false);
        }
    }

    // 初回読み込みはここで呼ぶ
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

    const handleFormSubmit = async (formData: Omit<Product, 'id'>) => {
        try {
            let method = 'POST';
            let url = `${API_BASE_URL}/api/nori/products`;

            if (editingProduct) {
                method = 'PUT';
                url = `${API_BASE_URL}/api/nori/products/${editingProduct.id}`;
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
                
                // ★これでエラーにならずに再読み込みできるはずです
                await fetchProducts();
                
            } else {
                alert('処理に失敗しました');
            }
        } catch (error) {
            // エラー内容をコンソールに出して確認できるようにする
            console.error("エラーの詳細:", error);
            alert('エラーが発生しました。コンソール(F12)を確認してください。');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('本当に削除しますか？')) return;
        try {
            await fetch(`${API_BASE_URL}/api/nori/products/${id}`, { 
                method: 'DELETE' ,
                
            });
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
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-[390px] aspect-[9/19] bg-white shadow-2xl rounded-[3rem] flex items-center justify-center">
                    <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto rounded-[3rem]">
                <ProductHeader onBack={handleBack} onCreate={handleCreate} />
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