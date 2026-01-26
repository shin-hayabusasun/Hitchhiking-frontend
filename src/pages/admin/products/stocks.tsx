// src/pages/admin/stocks.tsx

import { useState, useEffect } from 'react';
import { TitleHeader } from '@/components/TitleHeader';
import { StockStatsCard } from '@/components/admin/stock/StockStatsCard';
import { StockItemCard } from '@/components/admin/stock/StockItemCard';
import { Product, StockStats } from '@/types';
import { getApiUrl } from '@/config/api';

const ALERT_THRESHOLD = 20; //警告値

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
            // ★修正: 2つのAPIを並行して呼び出す
            const [productsRes, salesRes] = await Promise.all([
                fetch(getApiUrl('/api/admin/stocks'), { method: 'GET' }),
                fetch(getApiUrl('/api/admin/stocks/sales'), { method: 'GET' })
            ]);

            if (!productsRes.ok || !salesRes.ok) {
                throw new Error('Network response was not ok');
            }

            // それぞれの結果をJSONにする
            const productsData = await productsRes.json();
            const salesData = await salesRes.json();

            const productList: Product[] = productsData.products || [];
            const salesCount = salesData.total_sales || 0;

            // 統計情報の計算
            const totalStock = productList.reduce((sum, p) => sum + p.stock, 0);
            const warningCount = productList.filter(p => p.stock < ALERT_THRESHOLD).length;

            setProducts(productList);
            setStats({
                totalStock,
                warningCount,
                totalSales: salesCount // APIから取得した値
            });

        } catch (err) {
            console.error(err);
            setError('データの取得に失敗しました');
        } finally {
            setLoading(false);
        }
    }

    async function handleReplenishConfirm(productId: string) {
        const amount = Number(replenishAmount);
        if (!amount || amount <= 0) {
            alert('正しい数量を入力してください');
            return;
        }

        try {
            const response = await fetch(getApiUrl(`/api/admin/stocks/${productId}/replenish`), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount }),
            });

            if (response.ok) {
                const data = await response.json();
                alert(`在庫を補充しました。現在庫: ${data.current_stock}`);
                setReplenishId(null);
                setReplenishAmount('');
                fetchData(); // 再取得
            } else {
                alert('補充に失敗しました');
            }
        } catch (err) {
            alert('補充処理中にエラーが発生しました');
        }
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
            <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">
                <div className="bg-white/50 backdrop-blur-sm z-10 relative">
                    <TitleHeader title="在庫管理" backPath="/admin/dashboard" />
                </div>

                <div className="flex-1 overflow-y-auto p-5 scrollbar-hide pb-20">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    {stats && <StockStatsCard stats={stats} />}

                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-bold text-gray-700">商品在庫一覧</h3>
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
                            閾値: {ALERT_THRESHOLD}個未満
                        </span>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <p>商品がありません</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {products.map((product) => (
                                <StockItemCard
                                    key={product.id}
                                    product={product}
                                    alertThreshold={ALERT_THRESHOLD}
                                    isReplenishing={replenishId === product.id}
                                    replenishAmount={replenishAmount}
                                    onStartReplenish={setReplenishId}
                                    onCancelReplenish={() => {
                                        setReplenishId(null);
                                        setReplenishAmount('');
                                    }}
                                    onConfirmReplenish={handleReplenishConfirm}
                                    onAmountChange={setReplenishAmount}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StockManagementPage;