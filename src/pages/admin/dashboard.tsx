// % Start(五藤暖葵)
// 管理者ホーム画面: 管理者向けの重要指標表示および各管理メニューへの導線画面

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

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
                const response = await fetch('http://localhost:8000/api/admin/stats', {
                    method: 'GET',
                    credentials: 'include',
                });
                
                // 【追加】データ取得失敗時の処理（元のコードにはなかったが安全のため追加）
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

    // 【追加】ヘッダーの「戻るボタン」用ハンドラー
    function handleBackClick() {
        router.back();
    }

    function handleCustomersClick() { router.push('/admin/users'); }
    function handleProductsClick() { router.push('/admin/products/products'); }
    function handleStocksClick() { router.push('/admin/products/stocks'); }
    function handleOrdersClick() { router.push('/admin/orders/orders'); }

    async function handleLogoutClick() {
        if (!confirm('ログアウトしますか？')) { return; }
        try {
            // 元のコード通り GET メソッドを使用
            await fetch('/api/user/logout', { method: 'GET', credentials: 'include' });
            // 元のコード通りの遷移先
            router.push('/login/logout');
        } catch (err) { alert('ログアウトに失敗しました'); }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

            <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">
            {/* --- ヘッダー部分 --- */}
            <header className="flex items-center justify-between px-4 py-4 bg-white border-b sticky top-0 z-10">
                {/* ① 戻るボタン (handleBackClickを使用) */}
                <button onClick={handleBackClick} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>

                <h1 className="text-lg font-bold">管理者ダッシュボード</h1>

                {/* ② ログアウトボタン (handleLogoutClickを使用) */}
                <button onClick={handleLogoutClick} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                </button>
            </header>

            <main className="p-4 max-w-md mx-auto space-y-6">
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                {/* --- ③ 統計カードセクション --- */}
                <section className="grid grid-cols-2 gap-4">
                    {/* 総顧客数 */}
                    <div className="bg-blue-50 p-4 rounded-2xl flex flex-col justify-between h-32 shadow-sm">
                        <div className="text-blue-500 mb-2">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-800">
                                {stats?.totalUsers?.toLocaleString() ?? 0}
                            </div>
                            <div className="text-xs text-gray-500 font-bold">総顧客数</div>
                        </div>
                    </div>

                    {/* 総注文数 */}
                    <div className="bg-green-50 p-4 rounded-2xl flex flex-col justify-between h-32 shadow-sm">
                        <div className="text-green-600 mb-2">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-800">
                                {stats?.totalOrders?.toLocaleString() ?? 0}
                            </div>
                            <div className="text-xs text-gray-500 font-bold">総注文数</div>
                        </div>
                    </div>

                    {/* 総商品数 */}
                    <div className="bg-purple-50 p-4 rounded-2xl flex flex-col justify-between h-32 shadow-sm">
                        <div className="text-purple-500 mb-2">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-800">
                                {stats?.totalProductsnumber?.toLocaleString() ?? 0}
                            </div>
                            <div className="text-xs text-gray-500 font-bold">総商品数</div>
                        </div>
                    </div>

                    {/* 付与ポイント */}
                    <div className="bg-yellow-50 p-4 rounded-2xl flex flex-col justify-between h-32 shadow-sm">
                        <div className="text-yellow-600 mb-2">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                <polyline points="17 6 23 6 23 12"></polyline>
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-800">
                                {stats?.issuedPoints?.toLocaleString() ?? 0}
                                <span className="text-sm font-normal ml-1">pt</span>
                            </div>
                            <div className="text-xs text-gray-500 font-bold">付与ポイント</div>
                        </div>
                    </div>
                </section>

                {/* --- 管理機能メニューセクション --- */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <h2 className="text-sm font-bold text-gray-500">管理機能</h2>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {/* ④ 顧客管理 */}
                        <button
                            onClick={handleCustomersClick}
                            className="w-full flex items-center px-4 py-4 hover:bg-gray-50 transition-colors text-left"
                        >
                            <div className="text-blue-500 mr-4">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <span className="flex-1 font-medium text-gray-700">顧客管理</span>
                            <span className="text-gray-400">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </span>
                        </button>

                        {/* ⑤ 商品情報管理 */}
                        <button
                            onClick={handleProductsClick}
                            className="w-full flex items-center px-4 py-4 hover:bg-gray-50 transition-colors text-left"
                        >
                            <div className="text-green-500 mr-4">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                </svg>
                            </div>
                            <span className="flex-1 font-medium text-gray-700">商品情報管理</span>
                            <span className="text-gray-400">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </span>
                        </button>

                        {/* ⑥ 在庫管理 */}
                        <button
                            onClick={handleStocksClick}
                            className="w-full flex items-center px-4 py-4 hover:bg-gray-50 transition-colors text-left"
                        >
                            <div className="text-purple-500 mr-4">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="20" x2="18" y2="10"></line>
                                    <line x1="12" y1="20" x2="12" y2="4"></line>
                                    <line x1="6" y1="20" x2="6" y2="14"></line>
                                </svg>
                            </div>
                            <span className="flex-1 font-medium text-gray-700">在庫管理</span>
                            <span className="text-gray-400">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </span>
                        </button>

                        {/* ⑦ 注文管理 */}
                        <button
                            onClick={handleOrdersClick}
                            className="w-full flex items-center px-4 py-4 hover:bg-gray-50 transition-colors text-left"
                        >
                            <div className="text-orange-500 mr-4">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                            </div>
                            <span className="flex-1 font-medium text-gray-700">注文管理</span>
                            <span className="text-gray-400">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
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