// % Start(田所櫂人)


// 外部設計書 4.3.5 マイページ画面のUI再現


// マイページ: セッション維持の安定化と、外部設計書 4.2.1 に基づくプロフィールUIの刷新

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { TitleHeader } from '@/components/TitleHeader';



export default function MyPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    // セッション有効性を確認しながらデータを取得する関数
    const fetchUserProfile = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/user/profile', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Cookie（セッション）を送信
            });

            if (response.status === 401) {
                // セッションが切れている場合はログイン画面へ強制遷移
                console.warn('Session expired. Redirecting to login...');
                router.push('/login?callback=/mypage');
                return;
            }

            if (!response.ok) throw new Error('Profile fetch failed');

            const data = await response.json();
            setUser(data.data || data);
        } catch (err) {
            setError('プロフィールの読み込みに失敗しました。再ログインをお試しください。');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
                <div className="animate-spin h-10 w-10 border-[3px] border-slate-900 rounded-full border-t-transparent mb-4"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Authenticating...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-32 font-sans text-slate-900">
 2fa6a17 (a)
            <Head>
                <title>マイページ | G4</title>
            </Head>


            <TitleHeader title="マイページ" onBack={() => router.push('/home')} />

            <main className="max-w-md mx-auto px-6 pt-8">
                {/* プロフィールカード */}
                <div className="bg-white rounded-[3.5rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-white mb-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-50 to-white -z-10"></div>
                    
                    <div className="w-28 h-28 bg-slate-100 rounded-[2.5rem] mx-auto mb-6 border-4 border-white shadow-sm flex items-center justify-center text-4xl overflow-hidden">
                        {user?.avatarUrl ? <img src={user.avatarUrl} alt="avatar" /> : '👤'}
                    </div>

                    <h2 className="text-2xl font-black text-slate-800 mb-1">{user?.name || 'Guest User'}</h2>
                    <p className="text-xs font-bold text-slate-400 mb-6">{user?.email}</p>

                    <div className="flex justify-center gap-4">
                        <button 
                            onClick={() => router.push('/settings/profile')}
                            className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-[11px] font-black shadow-lg shadow-slate-200 active:scale-95 transition-all"
                        >
                            編集する
                        </button>
                    </div>
                </div>

                {/* ポイント・統計セクション */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="bg-blue-600 rounded-[2.5rem] p-6 text-white shadow-xl shadow-blue-100">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-1">Current Points</p>
                        <p className="text-2xl font-black">{user?.points?.toLocaleString() || 0} <span className="text-xs uppercase">pt</span></p>
                    </div>
                    <button 
                        onClick={() => router.push('/points/history')}
                        className="bg-white rounded-[2.5rem] p-6 border border-slate-100 flex flex-col justify-center active:scale-95 transition-all shadow-sm"
                    >
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">History</p>
                        <p className="text-sm font-black text-slate-700">ポイント履歴 →</p>
                    </button>
                </div>

                {/* メニューリスト */}
                <div className="space-y-3">
                    {[
                        { label: '募集管理', icon: '📋', path: '/hitch_hiker/RecruitmentManagement' },
                        { label: 'マイリクエスト', icon: '✉️', path: '/hitch_hiker/MyRequest' },
                        { label: 'ポイント交換', icon: '🎁', path: '/points/exchange' },
                        { label: '設定・ヘルプ', icon: '⚙️', path: '/settings' },
                    ].map((item) => (
                        <button
                            key={item.label}
                            onClick={() => router.push(item.path)}
                            className="w-full bg-white p-6 rounded-[2rem] flex items-center justify-between group active:bg-slate-50 transition-all border border-transparent hover:border-slate-100 shadow-sm"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-xl">{item.icon}</span>
                                <span className="text-[14px] font-bold text-slate-700">{item.label}</span>
                            </div>
                            <span className="text-slate-300 group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    ))}
                </div>

                {/* ログアウト */}
                <button 
                    onClick={async () => {
                        if(confirm('ログアウトしますか？')) {
                            await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
                            router.push('/login');
                        }
                    }}
                    className="w-full mt-12 py-5 text-red-400 text-[12px] font-black tracking-widest uppercase hover:text-red-600 transition-colors"
                >
                    Sign Out
 2fa6a17 (a)
                </button>
            </main>
        </div>
    );


// メニュー項目のサブコンポーネント
function MenuItem({ label, icon, isLast = false }: { label: string; icon: string; isLast?: boolean }) {
    return (
        <button className={`w-full flex items-center justify-between px-8 py-6 hover:bg-slate-50 transition-colors ${!isLast ? 'border-b border-slate-50' : ''}`}>
            <span className="text-[15px] font-bold text-slate-700">{label}</span>
            <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
        </button>
    );
}


// % End