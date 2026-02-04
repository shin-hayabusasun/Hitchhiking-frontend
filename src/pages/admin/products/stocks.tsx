import { useState, useEffect } from 'react';
import { TitleHeader } from '@/components/TitleHeader';
import { StockStatsCard } from '@/components/admin/stock/StockStatsCard';
import { StockItemCard } from '@/components/admin/stock/StockItemCard';
import { Product, StockStats } from '@/types';
import { getApiUrl } from '@/config/api';

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
            <div className="min-h-screen bg-sky-50 flex items-center justify-center">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        /* ★ 背景は画面一杯（wide）、角丸・外枠なし */
        <div className="w-full min-h-screen bg-gradient-to-b from-sky-200 to-white flex flex-col items-center font-sans">
            
            {/* ★ ヘッダー：白背景は横いっぱい、中身は max-w-2xl */}
            <header className="w-full bg-white/60 backdrop-blur-md sticky top-0 z-30 shadow-sm border-none">
                <div className="max-w-2xl mx-auto">
                    <TitleHeader title="在庫管理" backPath="/admin/dashboard" />
                </div>
            </header>

            {/* ★ メインコンテンツ：max-w-2xl で中央寄せ */}
            <main className="w-full max-w-2xl flex flex-col p-5">
                {error && (
                    <div className="bg-red-50 border-none text-red-600 px-4 py-4 rounded-2xl mb-6 text-sm font-bold text-center shadow-sm">
                        {error}
                    </div>
                )}

                {/* 統計パネル */}
                <section className="mb-6">
                    {stats && <StockStatsCard stats={stats} />}
                </section>

                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-black text-gray-700 tracking-tight">商品在庫一覧</h3>
                    <span className="text-[10px] font-black text-gray-500 bg-white/80 px-3 py-1 rounded-full shadow-sm border border-white/50">
                        閾値: {ALERT_THRESHOLD}個未満
                    </span>
                </div>

                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-4">
                        <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center text-3xl grayscale opacity-50 shadow-sm">📦</div>
                        <p className="text-sm font-black tracking-wider uppercase">No Products Found</p>
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

                {/* フッター余白 */}
                <div className="h-20" />
            </main>
        </div>
    );
}

export default StockManagementPage;