// 管理者ホーム画面: 管理者向けの重要指標表示および各管理メニューへの導線画面

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getApiUrl } from '@/config/api';

interface Stats {
    totalUsers: number;
    totalOrders: number;
    totalProductsnumber: number;
    issuedPoints: number;
}

export function AdminDashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 統計情報取得
    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch(getApiUrl('/api/admin/stats'), {
                    method: 'GET',
                    credentials: 'include',
                });
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setStats(data);
            } catch (err) {
                setError('統計情報の取得に失敗しました');
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    function handleCustomersClick() { router.push('/admin/users'); }
    function handleProductsClick() { router.push('/admin/products/products'); }
    function handleStocksClick() { router.push('/admin/products/stocks'); }
    function handleOrdersClick() { router.push('/admin/orders/orders'); }

    async function handleLogoutClick() {
        if (!confirm('ログアウトしますか？')) { return; }
        try {
            await fetch('/api/user/logout', { method: 'GET', credentials: 'include' });
            router.push('/login/logout');
        } catch (err) { alert('ログアウトに失敗しました'); }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-sky-50">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
        );
    }

    return (
        /* ★ 背景は画面一杯（wide） */
        <div className="w-full min-h-screen bg-gradient-to-b from-sky-200 to-white flex flex-col items-center font-sans">
            
            {/* ★ ヘッダー：白背景は横いっぱい、中身は max-w-2xl */}
            <header className="w-full bg-white/60 backdrop-blur-md sticky top-0 z-30 shadow-sm border-none">
                <div className="max-w-2xl mx-auto flex items-center justify-between px-6 py-4">
                    <h1 className="text-lg font-black text-gray-800 tracking-tight">管理者ダッシュボード</h1>
                    <button 
                        onClick={handleLogoutClick} 
                        className="p-2.5 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all duration-200"
                        title="ログアウト"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* ★ メインコンテンツ：max-w-2xl で中央寄せ */}
            <main className="w-full max-w-2xl p-6 space-y-8">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold text-center shadow-sm">
                        {error}
                    </div>
                )}

                {/* --- 統計カードセクション --- */}
                <section className="grid grid-cols-2 gap-4">
                    {/* 総顧客数 */}
                    <div className="bg-white p-5 rounded-3xl flex flex-col justify-between h-36 shadow-sm border border-white/50">
                        <div className="text-blue-500 bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-gray-800">
                                {stats?.totalUsers?.toLocaleString() ?? 0}
                            </div>
                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">総顧客数</div>
                        </div>
                    </div>

                    {/* 総注文数 - 指定色 #00B049 を適用 */}
                    <div className="bg-white p-5 rounded-3xl flex flex-col justify-between h-36 shadow-sm border border-white/50">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#00B04915', color: '#00B049' }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-gray-800">
                                {stats?.totalOrders?.toLocaleString() ?? 0}
                            </div>
                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">総注文数</div>
                        </div>
                    </div>

                    {/* 総商品数 */}
                    <div className="bg-white p-5 rounded-3xl flex flex-col justify-between h-36 shadow-sm border border-white/50">
                        <div className="text-purple-500 bg-purple-50 w-10 h-10 rounded-xl flex items-center justify-center">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-gray-800">
                                {stats?.totalProductsnumber?.toLocaleString() ?? 0}
                            </div>
                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">総商品数</div>
                        </div>
                    </div>

                    {/* 付与ポイント */}
                    <div className="bg-white p-5 rounded-3xl flex flex-col justify-between h-36 shadow-sm border border-white/50">
                        <div className="text-orange-500 bg-orange-50 w-10 h-10 rounded-xl flex items-center justify-center">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                <polyline points="17 6 23 6 23 12"></polyline>
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-gray-800">
                                {stats?.issuedPoints?.toLocaleString() ?? 0}
                                <span className="text-xs font-bold ml-1 text-gray-400">pt</span>
                            </div>
                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">付与ポイント</div>
                        </div>
                    </div>
                </section>

                {/* --- 管理機能メニューセクション --- */}
                <section className="space-y-3">
                    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Main Menu</h2>
                    
                    <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-sm border border-white/50 overflow-hidden divide-y divide-gray-100">
                        {/* 顧客管理 */}
                        <button onClick={handleCustomersClick} className="w-full flex items-center px-6 py-5 hover:bg-sky-50 transition-all text-left active:scale-[0.98]">
                            <div className="text-blue-500 mr-5 bg-blue-50 p-2 rounded-xl">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            <span className="flex-1 font-bold text-gray-700">顧客管理</span>
                            <svg className="text-gray-300" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>

                        {/* 商品情報管理 */}
                        <button onClick={handleProductsClick} className="w-full flex items-center px-6 py-5 hover:bg-sky-50 transition-all text-left active:scale-[0.98]">
                            <div className="text-green-600 mr-5 bg-green-50 p-2 rounded-xl">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                </svg>
                            </div>
                            <span className="flex-1 font-bold text-gray-700">商品情報管理</span>
                            <svg className="text-gray-300" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>

                        {/* 在庫管理 */}
                        <button onClick={handleStocksClick} className="w-full flex items-center px-6 py-5 hover:bg-sky-50 transition-all text-left active:scale-[0.98]">
                            <div className="text-purple-500 mr-5 bg-purple-50 p-2 rounded-xl">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="20" x2="18" y2="10"></line>
                                    <line x1="12" y1="20" x2="12" y2="4"></line>
                                    <line x1="6" y1="20" x2="6" y2="14"></line>
                                </svg>
                            </div>
                            <span className="flex-1 font-bold text-gray-700">在庫管理</span>
                            <svg className="text-gray-300" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>

                        {/* 注文管理 */}
                        <button onClick={handleOrdersClick} className="w-full flex items-center px-6 py-5 hover:bg-sky-50 transition-all text-left active:scale-[0.98]">
                            <div className="text-orange-500 mr-5 bg-orange-50 p-2 rounded-xl">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                            </div>
                            <span className="flex-1 font-bold text-gray-700">注文管理</span>
                            <svg className="text-gray-300" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                    </div>
                </section>

                <div className="h-12" />
            </main>
        </div>
    );
}

export default AdminDashboardPage;