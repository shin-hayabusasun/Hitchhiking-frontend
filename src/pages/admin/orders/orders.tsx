import { useState, useEffect, useMemo } from 'react';
import { TitleHeader } from '@/components/TitleHeader';
import { useRouter } from 'next/router';
import { OrderCard, Order } from '@/components/admin/orders/OrderCard';
import { getApiUrl } from '@/config/api';

export default function OrderManagementPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // UI用のState
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'shipped', 'completed'

    useEffect(() => {
        fetchOrders();
    }, []);

    // 1. 注文一覧取得
    async function fetchOrders() {
        try {
            const response = await fetch(getApiUrl('/api/admin/orders'), {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            setOrders(data.orders || []);
        } catch (err) {
            console.error(err);
            setError('注文データの取得に失敗しました');
        } finally {
            setLoading(false);
        }
    }

    // 2. ステータス更新処理
    async function handleStatusChange(orderId: string, newStatus: string) {
        const originalOrders = [...orders];
        setOrders(prev => prev.map(o => 
            o.id === orderId ? { ...o, status: newStatus } : o
        ));

        try {
            const response = await fetch(getApiUrl(`/api/admin/orders/${orderId}/status`), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update');
        } catch (err) {
            alert('ステータスの更新に失敗しました');
            setOrders(originalOrders);
        }
    }

    // 3. フィルタリングと検索ロジック
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            let matchesTab = true;
            if (activeTab === 'pending') matchesTab = order.status === 'pending';
            else if (activeTab === 'shipped') matchesTab = order.status === 'shipped';
            else if (activeTab === 'completed') matchesTab = order.status === 'completed';
            
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = 
                order.productName.toLowerCase().includes(searchLower) ||
                order.customerName.toLowerCase().includes(searchLower) ||
                order.orderNumber.toLowerCase().includes(searchLower);

            return matchesTab && matchesSearch;
        });
    }, [orders, activeTab, searchQuery]);

    // 4. 統計データの計算
    const stats = useMemo(() => {
        return {
            total: orders.length,
            pending: orders.filter(o => o.status === 'pending').length,
            completed: orders.filter(o => o.status === 'completed' || o.status === 'shipped').length
        };
    }, [orders]);

    if (loading) return (
        <div className="min-h-screen bg-sky-50 flex items-center justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
    );

    return (
        /* ★ 背景は画面一杯（wide）、角丸なし */
        <div className="w-full min-h-screen bg-gradient-to-b from-sky-200 to-white flex flex-col items-center font-sans">
            
            {/* ★ ヘッダー：白背景は横いっぱい、中身は max-w-2xl で中央寄せ */}
            <header className="w-full bg-white/60 backdrop-blur-md sticky top-0 z-30 shadow-sm border-none">
                <div className="max-w-2xl mx-auto flex flex-col">
                    <TitleHeader title="注文管理" backPath="/admin/dashboard" />
                    
                    {/* 検索バー */}
                    <div className="px-5 pb-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="注文番号・商品名で検索..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/80 text-gray-700 text-sm font-bold rounded-2xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:font-medium border-none shadow-inner"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ★ メインコンテンツ：max-w-2xl で中央寄せ */}
            <div className="w-full max-w-2xl flex flex-col p-5 space-y-6">
                
                {/* 3つの統計パネル */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                        <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">Total</p>
                        <p className="text-lg font-extrabold text-gray-800">{stats.total}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-yellow-100 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-50 rounded-bl-full -mr-2 -mt-2"></div>
                        <p className="text-[10px] text-yellow-600 font-bold mb-1 uppercase tracking-wider">Wait</p>
                        <p className="text-lg font-extrabold text-yellow-600">{stats.pending}</p>
                    </div>
                    {/* 指定色 #00B049 を適用 */}
                    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-[#00B049]/20 flex flex-col items-center justify-center">
                        <p className="text-[10px] text-[#00B049] font-bold mb-1 uppercase tracking-wider">Done</p>
                        <p className="text-lg font-extrabold text-[#00B049]">{stats.completed}</p>
                    </div>
                </div>

                {/* 4つのフィルタタグ */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                        { id: 'all', label: 'すべて' },
                        { id: 'pending', label: '準備中' },
                        { id: 'shipped', label: '発送済' },
                        { id: 'completed', label: '完了' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 min-w-fit px-3 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all text-center border-none ${
                                activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                    : 'bg-white/70 text-gray-500 hover:bg-white'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* リスト表示 */}
                {error && (
                    <div className="bg-red-50 border-none text-red-600 px-4 py-3 rounded-xl text-xs font-bold text-center shadow-sm">
                        {error}
                    </div>
                )}
                
                {filteredOrders.length === 0 && !error ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400 space-y-4">
                        <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center text-2xl grayscale opacity-50 shadow-sm">📦</div>
                        <p className="text-sm font-bold tracking-tight">該当する注文がありません</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredOrders.map((order) => (
                            <OrderCard 
                                key={order.id} 
                                order={order} 
                                onStatusChange={handleStatusChange} 
                            />
                        ))}
                    </div>
                )}
                
                {/* フッター余白 */}
                <div className="h-20" />
            </div>
        </div>
    );
}