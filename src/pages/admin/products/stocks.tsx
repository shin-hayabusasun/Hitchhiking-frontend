// src/pages/admin/stocks.tsx
import { useState, useEffect } from 'react';
import { TitleHeader } from '@/components/TitleHeader';
import { StockStatsCard } from '@/components/admin/stock/StockStatsCard';
import { StockItemCard } from '@/components/admin/stock/StockItemCard';
import { Product, StockStats } from '@/types';
import { getApiUrl } from '@/config/api';
import { Loader2, PackageSearch } from 'lucide-react'; // アイコン追加

const ALERT_THRESHOLD = 20; // 警告値

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
            const [productsRes, salesRes] = await Promise.all([
                fetch(getApiUrl('/api/admin/stocks'), { method: 'GET' }),
                fetch(getApiUrl('/api/admin/stocks/sales'), { method: 'GET' })
            ]);

            if (!productsRes.ok || !salesRes.ok) {
                throw new Error('Network response was not ok');
            }

            const productsData = await productsRes.json();
            const salesData = await salesRes.json();

            const productList: Product[] = productsData.products || [];
            const salesCount = salesData.total_sales || 0;

            const totalStock = productList.reduce((sum, p) => sum + p.stock, 0);
            const warningCount = productList.filter(p => p.stock < ALERT_THRESHOLD).length;

            setProducts(productList);
            setStats({
                totalStock,
                warningCount,
                totalSales: salesCount
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
                fetchData();
            } else {
                alert('補充に失敗しました');
            }
        } catch (err) {
            alert('補充処理中にエラーが発生しました');
        }
    }

    if (loading) {
        return (
            // 【修正後】ローディング画面を他の画面と統一
            <div className="min-h-screen bg-sky-100 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                <p className="text-blue-600 font-bold">在庫データを照合中...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* 【修正後】角丸を削除し、全画面に青のグラデーションを適用 */}
            <div className="w-full min-h-screen flex flex-col font-sans relative bg-gradient-to-b from-sky-200 to-white overflow-y-auto">
                
                {/* ヘッダー：透過デザインで統一 */}
                <div className="bg-white/50 backdrop-blur-md sticky top-0 z-20 border-b border-white/20">
                    <TitleHeader title="在庫管理" backPath="/admin/dashboard" />
                </div>

                <div className="flex-1 p-5 pb-24 max-w-4xl mx-auto w-full">
                    {error && (
                        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-bold flex items-center shadow-sm">
                            <span className="mr-2">⚠️</span>
                            {error}
                        </div>
                    )}

                    {/* 統計カードセクション */}
                    <div className="mb-8">
                        {stats && <StockStatsCard stats={stats} />}
                    </div>

                    {/* リストヘッダー */}
                    <div className="mb-6 flex items-end justify-between px-1">
                        <div>
                            <h3 className="text-lg font-black text-gray-800 leading-none">商品在庫一覧</h3>
                            <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase tracking-wider">Product Inventory</p>
                        </div>
                        <span className="text-[11px] font-black text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-full shadow-sm">
                            警告閾値: {ALERT_THRESHOLD}個未満
                        </span>
                    </div>

                    {/* メインリスト */}
                    {products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-4 bg-white/30 rounded-[2rem] border border-dashed border-white/50">
                            <PackageSearch className="w-12 h-12 opacity-30" />
                            <p className="text-sm font-bold opacity-70">管理対象の商品がありません</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
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