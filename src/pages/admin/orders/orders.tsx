// src/pages/admin/orders.tsx
// 注文管理画面: 背景色を青グラデーションに変更、角丸削除

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
            // タブによるフィルタ
            let matchesTab = true;
            if (activeTab === 'pending') matchesTab = order.status === 'pending';
            else if (activeTab === 'shipped') matchesTab = order.status === 'shipped';
            else if (activeTab === 'completed') matchesTab = order.status === 'completed';
            
            // 検索ワードによるフィルタ
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

    const handleBack = () => {
        router.push('/admin/dashboard');
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            {/* ★修正ポイント: 
               1. rounded-[3rem] を削除 (角丸なし)
               2. bg-gray-50 を bg-gradient-to-b from-sky-200 to-white に変更 (青グラデーション)
            */}
            <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">
                
                {/* ヘッダーエリア */}
                {/* 背景を半透明(bg-white/50)にして背面の青色を透けさせます */}
                <div className="bg-white/50 backdrop-blur-sm sticky top-0 z-20 pb-4 shadow-sm">
                    
                    <TitleHeader title="注文管理" backPath="/admin/dashboard" />
                    
                    {/* 検索バー */}
                    <div className="px-5 mt-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="注文番号・商品名で検索..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/80 text-gray-700 text-sm font-bold rounded-2xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:font-medium"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 scrollbar-hide pb-20">
                    
                    {/* 3つの統計パネル */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                            <p className="text-[10px] text-gray-400 font-bold mb-1">総注文</p>
                            <p className="text-lg font-extrabold text-gray-800">{stats.total}</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-yellow-100 flex flex-col items-center justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-50 rounded-bl-full -mr-2 -mt-2"></div>
                            <p className="text-[10px] text-yellow-600 font-bold mb-1">対応待ち</p>
                            <p className="text-lg font-extrabold text-yellow-600">{stats.pending}</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                            <p className="text-[10px] text-green-600 font-bold mb-1">完了済</p>
                            <p className="text-lg font-extrabold text-green-600">{stats.completed}</p>
                        </div>
                    </div>

                    {/* 4つのフィルタタグ */}
                    <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                        {[
                            { id: 'all', label: 'すべて' },
                            { id: 'pending', label: '準備中' },
                            { id: 'shipped', label: '発送済' },
                            { id: 'completed', label: '完了' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 min-w-fit px-3 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all text-center ${
                                    activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                        : 'bg-white/70 text-gray-500 border border-white/50 hover:bg-white'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* リスト表示 */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-xs font-bold text-center">
                            {error}
                        </div>
                    )}
                    
                    {filteredOrders.length === 0 && !error ? (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-400 space-y-4">
                            <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center text-2xl grayscale opacity-50">📦</div>
                            <p className="text-sm font-bold">該当する注文がありません</p>
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
                </div>
            </div>
        </div>
    );
}