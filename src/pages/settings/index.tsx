// ver2
// 設定ホーム画面: プロフィール設定、通知設定、ログアウトなどへの導線を提供する画面

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader'; 
import { API_BASE_URL } from '@/config/api'; 

interface UserInfo {
    name: string;
    email: string;
    isVerified: boolean;
}

export function SettingsPage() {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // ユーザー情報取得 (既存ロジック維持)
    useEffect(() => {
        async function fetchUserInfo() {
            try {
                const response = await fetch(`${API_BASE_URL}/api/users/me`, {
                    method: 'GET',
                    credentials: 'include', 
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setUserInfo(data);

            } catch (err) {
                console.error(err);
                setError('ユーザー情報の取得に失敗しました');
            } finally {
                setLoading(false);
            }
        }

        fetchUserInfo();
    }, [router]);

    // --- イベントハンドラ ---
    function handleIdentityClick() { router.push('/settings/identity'); }
    function handleNotificationsClick() { router.push('/settings/notifications'); }
    function handlePaymentClick() { router.push('/settings/payment'); }
    
    async function handleLogoutClick() {
        if (!confirm('ログアウトしますか？')) return;
        try {
            await fetch('/api/user/logout', { method: 'GET', credentials: 'include' });
            router.push('/login/logout');
        } catch (err) { alert('ログアウトに失敗しました'); }
    }

    function handleBack() { router.push('/'); }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <p className="text-gray-500">読み込み中...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
            <div className="max-w-2xl mx-auto min-h-screen flex flex-col bg-white shadow-sm relative">
                
                {/* ① ヘッダー */}
                <header className="bg-white/80 backdrop-blur-md px-4 py-3 flex items-center border-b border-gray-100 sticky top-0 z-10">
                    <button onClick={handleBack} className="p-2 -ml-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="ml-2 text-lg font-bold text-gray-800">設定</h1>
                </header>

                <main className="p-4 sm:p-6 space-y-8 flex-1">
                    {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium border border-red-100">{error}</div>}

                    {/* ユーザー情報カード */}
                    <section className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-5">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-black ring-4 ring-blue-50">
                                {userInfo?.name ? userInfo.name.charAt(0) : 'U'}
                            </div>
                            {/* カメラアイコンバッジ */}
                            <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1.5 border-4 border-white text-white shadow-sm cursor-pointer hover:bg-blue-700 transition-colors">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                    <circle cx="12" cy="13" r="4"></circle>
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-black text-gray-900 leading-tight">{userInfo?.name || 'ゲストユーザー'}</h2>
                            <p className="text-sm text-gray-500 font-medium">{userInfo?.email || 'メールアドレス未設定'}</p>
                            {userInfo?.isVerified && (
                                <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-md uppercase tracking-wider">
                                    本人確認済み
                                </span>
                            )}
                        </div>   
                    </section>

                    {/* アカウントセクション */}
                    <section>
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] mb-3 ml-1">Account Settings</h3>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                            {/* ② 本人確認 */}
                            <button 
                                onClick={handleIdentityClick}
                                className="w-full flex items-center justify-between p-4 hover:bg-blue-50/50 transition-all group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="bg-green-50 p-2.5 rounded-xl text-green-600 group-hover:scale-110 transition-transform">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                        </svg>
                                    </div>
                                    <span className="font-bold text-gray-700">プロフィール・本人確認</span>
                                </div>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 group-hover:text-blue-500 transition-colors">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </button>
                        </div>
                    </section>

                    {/* その他セクション */}
                    <section>
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] mb-3 ml-1">General</h3>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                            {/* ③ 通知設定 */}
                            <button 
                                onClick={handleNotificationsClick}
                                className="w-full flex items-center justify-between p-4 hover:bg-blue-50/50 transition-all group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="bg-yellow-50 p-2.5 rounded-xl text-yellow-600 group-hover:scale-110 transition-transform">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                        </svg>
                                    </div>
                                    <span className="font-bold text-gray-700">通知設定</span>
                                </div>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 group-hover:text-blue-500 transition-colors">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </button>

                            {/* ④ 決済情報 */}
                            <button 
                                onClick={handlePaymentClick}
                                className="w-full flex items-center justify-between p-4 hover:bg-blue-50/50 transition-all group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="bg-pink-50 p-2.5 rounded-xl text-pink-500 group-hover:scale-110 transition-transform">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                            <line x1="1" y1="10" x2="23" y2="10"></line>
                                        </svg>
                                    </div>
                                    <span className="font-bold text-gray-700">決済情報</span>
                                </div>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 group-hover:text-blue-500 transition-colors">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </button>
                        </div>
                    </section>

                    {/* ⑤ ログアウトボタン */}
                    <button 
                        onClick={handleLogoutClick}
                        className="w-full bg-white border border-red-100 text-red-500 font-bold p-5 rounded-2xl shadow-sm hover:bg-red-50 transition-all flex items-center justify-center space-x-3 active:scale-[0.98]"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        <span>ログアウト</span>
                    </button>
                </main>
            </div>
        </div>
    );
}

export default SettingsPage;