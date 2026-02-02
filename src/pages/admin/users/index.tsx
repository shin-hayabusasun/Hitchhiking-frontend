import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader';
import { getApiUrl } from '@/config/api';
import { Loader2, Search, UserX, AlertTriangle, Users } from 'lucide-react'; // アイコン追加

// 顧客データの型定義
interface Customer {
    id: string;
    name: string;
    email: string;
    points?: number;
    orderCount?: number;
    rideCount?: number;
    registeredAt?: string;
}

// 統計データの型定義
interface CustomerStats {
    total_count: number;
}

export function UserManagementPage() {
    const router = useRouter();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [stats, setStats] = useState<CustomerStats | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // --- 顧客一覧の取得 ---
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const response = await fetch(getApiUrl('/api/admin/customers'), {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                if (!response.ok) {
                    throw new Error('データの取得に失敗しました');
                }

                const data = await response.json();
                const fetchedCustomers: Customer[] = data.customers || [];
                
                setCustomers(fetchedCustomers);
                setStats({ total_count: fetchedCustomers.length });

            } catch (err) {
                setError('顧客情報の取得に失敗しました');
                console.error('Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // --- アクションハンドラ: 警告 ---
    async function handleWarn(id: string) {
        if (!confirm('この顧客に警告を送信しますか？')) return;
        alert('警告機能は現在開発中です');
    }

    // --- アクションハンドラ: 削除 ---
    async function handleDelete(id: string) {
        if (deletingId === id) return;
        if (!confirm('本当にこの顧客データを削除しますか？\nこの操作は取り消せません。')) return;

        setDeletingId(id);

        try {
            const response = await fetch(getApiUrl(`/api/admin/customers/${id}`), {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || '削除に失敗しました');
            }

            setCustomers((prev) => prev.filter((c) => c.id !== id));
            setStats((prev) => prev ? { total_count: prev.total_count - 1 } : null);
            alert('顧客データを削除しました');

        } catch (err) {
            console.error('Delete Error:', err);
            alert(err instanceof Error ? err.message : '削除処理中にエラーが発生しました');
        } finally {
            setDeletingId(null);
        }
    }

    function handleBack() {
        router.push('/admin/dashboard');
    }

    const filteredCustomers = customers.filter((customer) => {
        return (
            customer.name.includes(searchQuery) ||
            customer.email.includes(searchQuery)
        );
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-sky-100 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                <p className="text-blue-600 font-bold uppercase tracking-widest">Loading Customers...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="w-full min-h-screen flex flex-col font-sans relative bg-gradient-to-b from-sky-200 to-white overflow-y-auto">
                
                {/* ヘッダーエリア */}
                <div className="bg-white/50 backdrop-blur-md sticky top-0 z-20 border-b border-white/20">
                    <TitleHeader title="顧客管理" onBack={handleBack} />
                </div>

                <div className="flex-1 p-5 pb-24 max-w-4xl mx-auto w-full space-y-6">
                    {error && (
                        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center shadow-sm">
                            <span className="mr-2">⚠️</span>
                            {error}
                        </div>
                    )}

                    {/* 検索バー */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-12 pr-4 py-4 border-none rounded-2xl bg-white/80 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm font-medium text-gray-700"
                            placeholder="名前またはメールで検索"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* 統計カード */}
                    {stats && (
                        <div className="bg-white/40 backdrop-blur-sm p-4 rounded-3xl border border-white/40 shadow-sm flex items-center justify-between px-8">
                            <div>
                                <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-1">Registered Total</p>
                                <div className="text-3xl font-black text-gray-800 flex items-baseline">
                                    {stats.total_count}
                                    <span className="text-sm font-bold text-gray-400 ml-1">名</span>
                                </div>
                            </div>
                            <Users className="w-10 h-10 text-blue-500/20" />
                        </div>
                    )}

                    {/* 顧客リスト */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredCustomers.map((customer) => (
                            <div key={customer.id} className="bg-white rounded-3xl border border-white/60 shadow-md overflow-hidden hover:shadow-lg transition-all flex flex-col">
                                <div className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-100 shrink-0">
                                            {customer.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-lg font-black text-gray-800 truncate">{customer.name}</h3>
                                            <p className="text-xs text-gray-400 truncate font-bold">{customer.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* 数値データエリア */}
                                <div className="px-6 py-4 grid grid-cols-3 gap-2 bg-gray-50/50 border-y border-gray-100">
                                    <div className="text-center">
                                        <div className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">Points</div>
                                        <div className="font-black text-blue-600 text-sm">{customer.points || 0}</div>
                                    </div>
                                    <div className="text-center border-x border-gray-200/50">
                                        <div className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">Orders</div>
                                        <div className="font-black text-gray-700 text-sm">{customer.orderCount || 0}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">Rides</div>
                                        <div className="font-black text-gray-700 text-sm">{customer.rideCount || 0}</div>
                                    </div>
                                </div>

                                {/* アクションボタン */}
                                <div className="p-3 flex gap-2 bg-white mt-auto">
                                    <button
                                        type="button"
                                        onClick={() => handleWarn(customer.id)}
                                        className="flex-1 py-3 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-colors text-[11px] font-black flex items-center justify-center gap-1"
                                    >
                                        <AlertTriangle size={14} />
                                        警告
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(customer.id)}
                                        disabled={deletingId === customer.id}
                                        className={`flex-1 py-3 rounded-xl transition-all text-[11px] font-black flex items-center justify-center gap-1
                                            ${deletingId === customer.id 
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                                            }`}
                                    >
                                        {deletingId === customer.id ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <UserX size={14} />
                                        )}
                                        {deletingId === customer.id ? '削除中...' : '削除'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredCustomers.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-4 bg-white/30 rounded-[2.5rem] border border-dashed border-white/50 mx-auto w-full">
                            <Search className="w-12 h-12 opacity-20" />
                            <p className="text-sm font-bold opacity-70">検索結果が見つかりませんでした</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserManagementPage;