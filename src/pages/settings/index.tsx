// ver2
// 設定ホーム画面: プロフィール設定、通知設定、ログアウトなどへの導線を提供する画面
// 画像のUIデザインに合わせて作成

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader'; 
const API_BASE_URL = 'http://54.165.126.189:8000';

interface UserInfo {
    name: string;
    email: string;
    isVerified: boolean;
    // avatarUrl?: string; // 画像があれば
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
                // ★★★ 1. 実際のAPI通信を実行 ★★★
                const response = await fetch(`${API_BASE_URL}/api/users/me`, {
                    method: 'GET',
                    credentials: 'include', // セッション維持に必須
                });

               
               
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                
                // ★★★ 2. 取得したデータをセット ★★★
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
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">読み込み中...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">
            {/* ① ヘッダー */}
            <header className="bg-white px-4 py-3 flex items-center border-b border-gray-200 sticky top-0 z-10">
                <button onClick={handleBack} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="ml-2 text-lg font-bold text-gray-800">設定</h1>
            </header>

            <main className="p-4 max-w-md mx-auto space-y-6">
                {error && <div className="bg-red-50 text-red-500 p-3 rounded">{error}</div>}

                {/* ユーザー情報カード */}
                <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 flex items-center space-x-4">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                            {userInfo?.name ? userInfo.name.charAt(0) : 'U'}
                        </div>
                        {/* カメラアイコンバッジ */}
                        <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1 border-2 border-white text-white">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                <circle cx="12" cy="13" r="4"></circle>
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{userInfo?.name || 'ゲストユーザー'}</h2>
                        <p className="text-sm text-gray-500">{userInfo?.email || ''}</p>
                    </div>   
                        
                </section>

                {/* アカウントセクション */}
                <section>
                    <h3 className="text-xs font-bold text-gray-500 mb-2 ml-1">アカウント</h3>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* ② 本人確認 */}
                        <button 
                            onClick={handleIdentityClick}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-50 p-2 rounded-full text-green-600">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                    </svg>
                                </div>
                                <span className="font-medium text-gray-700">本人確認</span>
                            </div>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                </section>

                {/* その他セクション */}
                <section>
                    <h3 className="text-xs font-bold text-gray-500 mb-2 ml-1">その他</h3>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden divide-y divide-gray-100">
                        {/* ③ 通知設定 */}
                        <button 
                            onClick={handleNotificationsClick}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="bg-yellow-50 p-2 rounded-full text-yellow-600">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                    </svg>
                                </div>
                                <span className="font-medium text-gray-700">通知設定</span>
                            </div>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>

                        {/* ④ 決済情報 */}
                        <button 
                            onClick={handlePaymentClick}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="bg-pink-50 p-2 rounded-full text-pink-500">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                        <line x1="1" y1="10" x2="23" y2="10"></line>
                                    </svg>
                                </div>
                                <span className="font-medium text-gray-700">決済情報</span>
                            </div>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                </section>

                {/* ⑤ ログアウトボタン */}
                <button 
                    onClick={handleLogoutClick}
                    className="w-full bg-white border border-red-200 text-red-600 font-bold p-4 rounded-2xl shadow-sm hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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