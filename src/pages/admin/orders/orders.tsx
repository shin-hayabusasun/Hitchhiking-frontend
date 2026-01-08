// % Start(AI Assistant)
// 注文管理画面。注文一覧確認とステータス管理

import { useState, useEffect } from 'react';
import { TitleHeader } from '@/components/TitleHeader';
import { Search, Filter, Package, Truck, CheckCircle, Clock } from 'lucide-react';

interface Order {
    id: string;
    productName: string;
    points: number;
    status: string;
    orderDate: string;
    // APIにない項目をフロントで補完
    orderNumber?: string;
    customerName?: string;
    quantity?: number;
}

interface OrderStats {
    totalOrders: number;
    pendingCount: number;
    shippedCount: number;
}

export function OrderManagementPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState<OrderStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // フィルタリングと検索
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            // 指定されたモックAPIを使用
            const response = await fetch('/api/points/orders', {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const rawOrders = data.orders || [];

            // 表示用にデータを加工（モックに足りない情報を補完）
            const processedOrders: Order[] = rawOrders.map((o: any) => ({
                ...o,
                orderNumber: o.id.substring(0, 8).toUpperCase(), // IDの一部を注文番号風に
                customerName: `User-${o.id.substring(0, 4)}`,   // 仮のユーザー名
                quantity: 1, // 数量は1固定
            }));

            setOrders(processedOrders);
            calculateStats(processedOrders);

        } catch (err) {
            console.error(err);
            setError('データの取得に失敗しました');
        } finally {
            setLoading(false);
        }
    }

    // 統計情報の計算
    function calculateStats(orderList: Order[]) {
        setStats({
            totalOrders: orderList.length,
            pendingCount: orderList.filter(o => o.status === 'pending').length,
            shippedCount: orderList.filter(o => o.status === 'shipped').length,
        });
    }

    // ステータス更新（モック動作：ローカルStateのみ更新）
    async function handleUpdateStatus(orderId: string, newStatus: string) {
        // 確認ダイアログ
        const actionName = newStatus === 'shipped' ? '発送済みに' : '配達完了に';
        if (!confirm(`この注文を「${actionName}」しますか？`)) {
            return;
        }

        const updatedOrders = orders.map(order => {
            if (order.id === orderId) {
                return { ...order, status: newStatus };
            }
            return order;
        });

        setOrders(updatedOrders);
        calculateStats(updatedOrders); // 統計も更新
    }

    // フィルタリング処理
    const filteredOrders = orders.filter((order) => {
        // ステータスフィルタ
        const statusMatch = statusFilter === 'all' || order.status === statusFilter;
        
        // 検索フィルタ（注文番号 or 商品名 or ユーザー名）
        const searchLower = searchTerm.toLowerCase();
        const searchMatch = 
            (order.orderNumber?.toLowerCase().includes(searchLower)) ||
            (order.productName.toLowerCase().includes(searchLower)) ||
            (order.customerName?.toLowerCase().includes(searchLower));

        return statusMatch && searchMatch;
    });

    // ステータスごとのラベルと色定義
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending':
                return { label: '準備中', color: 'bg-yellow-100 text-yellow-700', icon: Clock };
            case 'shipped':
                return { label: '発送済', color: 'bg-blue-100 text-blue-700', icon: Truck };
            case 'delivered':
                return { label: '完了', color: 'bg-green-100 text-green-700', icon: CheckCircle };
            default:
                return { label: status, color: 'bg-gray-100 text-gray-700', icon: Package };
        }
    };

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
            <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">
                
                {/* ヘッダー */}
                <div className="bg-white/50 backdrop-blur-sm z-10 relative">
                    <TitleHeader title="注文管理" backPath="/admin/dashboard" />
                </div>

                {/* スクロールエリア */}
                <div className="flex-1 overflow-y-auto p-5 scrollbar-hide pb-20">
                    
                    {/* 統計カード */}
                    {stats && (
                        <div className="grid grid-cols-3 gap-2 mb-6">
                            <div className="bg-white p-3 rounded-xl shadow-sm text-center border border-white/60">
                                <h3 className="text-[10px] font-bold text-gray-500 mb-1">未発送</h3>
                                <p className="text-xl font-extrabold text-yellow-500 leading-none">
                                    {stats.pendingCount}
                                </p>
                            </div>
                            <div className="bg-white p-3 rounded-xl shadow-sm text-center border border-white/60">
                                <h3 className="text-[10px] font-bold text-gray-500 mb-1">発送済</h3>
                                <p className="text-xl font-extrabold text-blue-500 leading-none">
                                    {stats.shippedCount}
                                </p>
                            </div>
                            <div className="bg-white p-3 rounded-xl shadow-sm text-center border border-white/60">
                                <h3 className="text-[10px] font-bold text-gray-500 mb-1">総注文</h3>
                                <p className="text-xl font-extrabold text-gray-700 leading-none">
                                    {stats.totalOrders}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 検索バー */}
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="注文番号・商品名で検索"
                            className="w-full bg-white border-none shadow-sm rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>

                    {/* タブフィルタ */}
                    {/* 変更点: overflow-x-autoなどを削除し、justify-centerを追加 */}
                    <div className="flex justify-center gap-2 mb-6">
                        {['all', 'pending', 'shipped', 'delivered'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                                    statusFilter === status
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-white text-gray-500 border border-white/60'
                                }`}
                            >
                                {status === 'all' ? 'すべて' : 
                                 status === 'pending' ? '準備中' :
                                 status === 'shipped' ? '配送中' : '完了'}
                            </button>
                        ))}
                    </div>

                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                    {/* 注文リスト */}
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <p>該当する注文がありません</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredOrders.map((order) => {
                                const statusConfig = getStatusConfig(order.status);
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <div key={order.id} className="bg-white p-4 rounded-2xl shadow-sm border border-white/60">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-400 font-bold mb-0.5">
                                                    #{order.orderNumber}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {order.orderDate}
                                                </span>
                                            </div>
                                            <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${statusConfig.color}`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {statusConfig.label}
                                            </span>
                                        </div>

                                        <div className="mb-4">
                                            <h4 className="font-bold text-gray-800 text-base mb-1">
                                                {order.productName}
                                            </h4>
                                            <div className="flex justify-between items-end">
                                                <p className="text-xs text-gray-500 font-medium">
                                                    {order.customerName} 様
                                                </p>
                                                <p className="text-blue-600 font-bold">
                                                    {order.points.toLocaleString()} pt
                                                </p>
                                            </div>
                                        </div>

                                        {/* ステータス操作アクション */}
                                        <div className="border-t border-gray-100 pt-3 flex justify-end">
                                            {order.status === 'pending' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(order.id, 'shipped')}
                                                    className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all"
                                                >
                                                    <Truck className="w-3.5 h-3.5" />
                                                    発送済みにする
                                                </button>
                                            )}
                                            {order.status === 'shipped' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(order.id, 'delivered')}
                                                    className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-green-200 active:scale-95 transition-all"
                                                >
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    配達完了にする
                                                </button>
                                            )}
                                            {order.status === 'delivered' && (
                                                <span className="text-xs text-gray-400 font-bold flex items-center gap-1">
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    対応完了
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrderManagementPage;

// % End