// % Start(田所櫂人)
// マイページ画面: ユーザーの基本情報、評価、各種メニュー（プロフィール編集、マイリクエスト、設定等）を表示する

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader';

// 設計書 Table 1, 2 等に基づいたユーザー情報の型定義
interface UserInfo {
    name: string;
    email: string;
    isVerified: boolean;
    introduction?: string; // 自己紹介
    rating?: number;       // 評価（外部設計書のマッチング機能に関連）
    isDriver: boolean;     // 運転者か同乗者か
}

export function MyPage() {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 1. ユーザー情報取得処理
    useEffect(() => {
        async function fetchUserInfo() {
            try {
                // credentials: 'include' によりセッションCookieを送信
                const response = await fetch('/api/user/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('セッションが切れたか、情報が見つかりません');
                }

                const data = await response.json();
                setUserInfo(data);
            } catch (err) {
                setError('ユーザー情報の取得に失敗しました。再度ログインしてください。');
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchUserInfo();
    }, []);

    // --- ハンドラー関数 ---

    // プロフィール編集（外部設計書 3.2.1）
    const handleEditClick = () => {
        router.push('/settings/profile');
    };

    // マイリクエスト / マイドライブ（同乗者・運転者で出し分け）
    const handleActivityClick = () => {
        if (userInfo?.isDriver) {
            router.push('/driver/drives'); // 5.3 マイドライブ情報取得画面へ
        } else {
            router.push('/hitch_hiker/MyRequest'); // 4.1.6 マイリクエスト画面へ
        }
    };

    // 設定画面へ（外部設計書 4.6）
    const handleSettingsClick = () => {
        router.push('/settings');
    };

    // 戻るボタン（ホームまたは検索画面へ）
    const handleBack = () => {
        router.push('/home');
    };

    // --- レンダリング条件分岐 ---

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
        );
    }

    if (error || !userInfo) {
        return (
            <div className="p-4 text-center">
                <p className="text-red-500 mb-4">{error || 'ユーザー情報が見つかりません'}</p>
                <button 
                    onClick={() => router.push('/login')}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    ログイン画面へ
                </button>
            </div>
        );
    }

    return (
        <div className="mypage-page bg-gray-50 min-h-screen">
            <TitleHeader title="マイページ" onBack={handleBack} />

            <div className="mypage-container max-w-md mx-auto p-4">
                {/* ユーザー基本情報カード */}
                <div className="user-info-card bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="user-avatar bg-gray-200 rounded-full p-3">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <div className="user-info">
                            <h2 className="text-xl font-bold text-gray-800">{userInfo.name}</h2>
                            <p className="text-sm text-gray-500">{userInfo.email}</p>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {userInfo.isVerified ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                ✓ 本人確認済み
                            </span>
                        ) : (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                                未本人確認
                            </span>
                        )}
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                            {userInfo.isDriver ? '運転者' : '同乗者'}
                        </span>
                    </div>
                </div>

                {/* メニューリスト */}
                <div className="mypage-menu bg-white rounded-xl shadow-sm overflow-hidden">
                    <MenuButton label="プロフィール編集" onClick={handleEditClick} />
                    <MenuButton 
                        label={userInfo.isDriver ? "マイドライブ履歴" : "マイリクエスト"} 
                        onClick={handleActivityClick} 
                    />
                    <MenuButton label="アプリ設定" onClick={handleSettingsClick} />
                    <MenuButton label="ヘルプ・お問い合わせ" onClick={() => router.push('/help')} />
                </div>

                {/* ログアウトボタン（任意追加） */}
                <button 
                    className="w-full mt-8 py-3 text-red-500 font-medium border border-red-200 rounded-xl hover:bg-red-50"
                    onClick={() => { /* ログアウト処理 */ }}
                >
                    ログアウト
                </button>
            </div>
        </div>
    );
}

// サブコンポーネント: メニュー項目
function MenuButton({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button
            type="button"
            className="w-full flex justify-between items-center p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            onClick={onClick}
        >
            <span className="text-gray-700 font-medium">{label}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="lightgray" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
            </svg>
        </button>
    );
}

export default MyPage;
// % End