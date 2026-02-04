import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader';
import { getApiUrl } from '@/config/api';

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
    
    // 二重送信防止用のステート
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // --- 顧客一覧の取得 ---
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const response = await fetch(getApiUrl('/api/admin/customers'), {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });
                
                if (!response.ok) throw new Error('データの取得に失敗しました');

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

    async function handleWarn(id: string) {
        if (!confirm('この顧客に警告を送信しますか？')) return;
        alert('警告機能は現在開発中です');
    }

    async function handleDelete(id: string) {
        if (deletingId === id) return;
        if (!confirm('本当にこの顧客データを削除しますか？\nこの操作は取り消せません。')) return;

        setDeletingId(id);
        try {
            const response = await fetch(getApiUrl(`/api/admin/customers/${id}`), {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
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
            <div className="min-h-screen bg-sky-50 flex items-center justify-center font-black text-blue-600 tracking-widest uppercase italic">
                Loading Customers...
            </div>
        );
    }

    return (
        /* ★ 背景は画面一杯（wide） */
        <div className="w-full min-h-screen bg-gradient-to-b from-sky-200 to-white flex flex-col items-center font-sans">

            {/* ★ ヘッダー：白背景は横いっぱい、中身は max-w-2xl */}
            <header className="w-full bg-white/60 backdrop-blur-md sticky top-0 z-30 shadow-sm border-none">
                <div className="max-w-2xl mx-auto">
                    <TitleHeader title="顧客管理" onBack={handleBack} />
                </div>
            </header>

            {/* ★ メインコンテンツ：max-w-2xl で中央寄せ */}
            <main className="w-full max-w-2xl p-5 space-y-6">
                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-2xl border-none text-sm font-bold text-center shadow-sm">
                        {error}
                    </div>
                )}

                {/* 検索バー */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-6 py-4 border-none rounded-2xl leading-5 bg-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all shadow-sm font-medium"
                        placeholder="名前またはメールで検索"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* 統計カード */}
                {stats && (
                    <div className="flex justify-center">
                        <div className="bg-white px-10 py-4 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center h-24 w-full border border-white/50">
                            {/* ★ 指定色 #00B049 を適用 */}
                            <div className="text-3xl font-black" style={{ color: '#00B049' }}>{stats.total_count}</div>
                            <div className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">Registered Customers</div>
                        </div>
                    </div>
                )}

                {/* 顧客リスト */}
                <div className="space-y-4">
                    {filteredCustomers.map((customer) => (
                        <div key={customer.id} className="bg-white rounded-3xl shadow-sm overflow-hidden border border-white/50 hover:shadow-md transition-all">
                            <div className="p-6 pb-4">
                                <div className="flex items-center space-x-5">
                                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-100">
                                        {customer.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-gray-900 truncate mb-1">{customer.name}</h3>
                                        <p className="text-sm text-gray-400 truncate font-medium">
                                            {customer.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 数値データエリア */}
                            <div className="px-6 py-4 grid grid-cols-3 gap-2 bg-gray-50/50 border-y border-gray-100/50">
                                <div className="text-center">
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Points</div>
                                    <div className="font-black text-gray-700 text-base">{customer.points || 0}</div>
                                </div>
                                <div className="text-center border-x border-gray-200/50">
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Orders</div>
                                    <div className="font-black text-gray-700 text-base">{customer.orderCount || 0}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Rides</div>
                                    <div className="font-black text-gray-700 text-base">{customer.rideCount || 0}</div>
                                </div>
                            </div>

                            {/* アクションボタン */}
                            <div className="p-4 flex gap-3 bg-white">
                                <button
                                    type="button"
                                    onClick={() => handleWarn(customer.id)}
                                    className="flex-1 py-3 bg-white border-2 border-orange-100 text-orange-500 rounded-xl hover:bg-orange-50 transition-colors text-xs font-black active:scale-95"
                                >
                                    警告
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(customer.id)}
                                    disabled={deletingId === customer.id}
                                    className={`flex-1 py-3 border-2 rounded-xl transition-all text-xs font-black active:scale-95 flex items-center justify-center 
                                        ${deletingId === customer.id 
                                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                                            : 'bg-white border-red-100 text-red-500 hover:bg-red-50'
                                        }`}
                                >
                                    {deletingId === customer.id ? (
                                        <>
                                            <span className="animate-spin mr-2">⏳</span>
                                            削除中...
                                        </>
                                    ) : (
                                        '削除'
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCustomers.length === 0 && (
                    <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-gray-300">
                        <div className="text-5xl mb-4 opacity-20">🔎</div>
                        <div className="text-gray-400 font-bold">検索結果がありません</div>
                    </div>
                )}

                {/* フッター余白 */}
                <div className="h-10" />
            </main>
        </div>
    );
}

export default UserManagementPage;