// % Start(五藤暖葵)
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
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="w-full min-h-screen flex flex-col font-sans relative bg-gradient-to-b from-sky-200 to-white overflow-y-auto"> 
                {/* --- ヘッダー部分: パディングを拡張 (px-6 py-5) --- */}
                <header className="flex items-center justify-between px-6 py-5 bg-white border-b sticky top-0 z-10 shadow-sm">
                    <h1 className="text-xl font-bold tracking-tight text-gray-800">管理者ダッシュボード</h1>

                    <button onClick={handleLogoutClick} className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </button>
                </header>

                {/* --- メインコンテンツ: コンテンツ幅を拡大 (max-w-2xl) と余白の調整 (p-6, space-y-8) --- */}
                <main className="p-6 max-w-2xl mx-auto w-full space-y-8">
                    {error && <p className="text-red-500 text-base text-center font-medium bg-red-50 p-4 rounded-xl">{error}</p>}

                    {/* --- ③ 統計カードセクション: カードの高さを拡大 (h-40) --- */}
                    <section className="grid grid-cols-2 gap-5">
                        {/* 総顧客数 */}
                        <div className="bg-blue-50 p-6 rounded-3xl flex flex-col justify-between h-40 shadow-sm transition-transform hover:scale-[1.02]">
                            <div className="text-blue-500">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-gray-800 tracking-tight">
                                    {stats?.totalUsers?.toLocaleString() ?? 0}
                                </div>
                                <div className="text-sm text-gray-500 font-bold mt-1">総顧客数</div>
                            </div>
                        </div>

                        {/* 総注文数 */}
                        <div className="bg-green-50 p-6 rounded-3xl flex flex-col justify-between h-40 shadow-sm transition-transform hover:scale-[1.02]">
                            <div className="text-green-600">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-gray-800 tracking-tight">
                                    {stats?.totalOrders?.toLocaleString() ?? 0}
                                </div>
                                <div className="text-sm text-gray-500 font-bold mt-1">総注文数</div>
                            </div>
                        </div>

                        {/* 総商品数 */}
                        <div className="bg-purple-50 p-6 rounded-3xl flex flex-col justify-between h-40 shadow-sm transition-transform hover:scale-[1.02]">
                            <div className="text-purple-500">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                </svg>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-gray-800 tracking-tight">
                                    {stats?.totalProductsnumber?.toLocaleString() ?? 0}
                                </div>
                                <div className="text-sm text-gray-500 font-bold mt-1">総商品数</div>
                            </div>
                        </div>

                        {/* 付与ポイント */}
                        <div className="bg-yellow-50 p-6 rounded-3xl flex flex-col justify-between h-40 shadow-sm transition-transform hover:scale-[1.02]">
                            <div className="text-yellow-600">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                    <polyline points="17 6 23 6 23 12"></polyline>
                                </svg>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-gray-800 tracking-tight">
                                    {stats?.issuedPoints?.toLocaleString() ?? 0}
                                    <span className="text-lg font-normal ml-1.5">pt</span>
                                </div>
                                <div className="text-sm text-gray-500 font-bold mt-1">付与ポイント</div>
                            </div>
                        </div>
                    </section>

                    {/* --- 管理機能メニューセクション: セパレーターの高さ調整 (py-4) --- */}
                    <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">管理機能メニュー</h2>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {/* 各メニューのパディングを拡大 (py-5) */}
                            <button onClick={handleCustomersClick} className="w-full flex items-center px-6 py-5 hover:bg-gray-50 transition-colors text-left group">
                                <div className="text-blue-500 mr-5">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                </div>
                                <span className="flex-1 font-bold text-gray-700 text-lg">顧客管理</span>
                                <span className="text-gray-300 group-hover:text-blue-500 transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </span>
                            </button>

                            <button onClick={handleProductsClick} className="w-full flex items-center px-6 py-5 hover:bg-gray-50 transition-colors text-left group">
                                <div className="text-green-500 mr-5">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                    </svg>
                                </div>
                                <span className="flex-1 font-bold text-gray-700 text-lg">商品情報管理</span>
                                <span className="text-gray-300 group-hover:text-green-500 transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </span>
                            </button>

                            <button onClick={handleStocksClick} className="w-full flex items-center px-6 py-5 hover:bg-gray-50 transition-colors text-left group">
                                <div className="text-purple-500 mr-5">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="20" x2="18" y2="10"></line>
                                        <line x1="12" y1="20" x2="12" y2="4"></line>
                                        <line x1="6" y1="20" x2="6" y2="14"></line>
                                    </svg>
                                </div>
                                <span className="flex-1 font-bold text-gray-700 text-lg">在庫管理</span>
                                <span className="text-gray-300 group-hover:text-purple-500 transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </span>
                            </button>

                            <button onClick={handleOrdersClick} className="w-full flex items-center px-6 py-5 hover:bg-gray-50 transition-colors text-left group">
                                <div className="text-orange-500 mr-5">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="9" cy="21" r="1"></circle>
                                        <circle cx="20" cy="21" r="1"></circle>
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                    </svg>
                                </div>
                                <span className="flex-1 font-bold text-gray-700 text-lg">注文管理</span>
                                <span className="text-gray-300 group-hover:text-orange-500 transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </span>
                            </button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default AdminDashboardPage;
// % End