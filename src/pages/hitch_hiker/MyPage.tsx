// % Start(田所櫂人)


// マイページ画面: 外部設計書 4.3.5 に基づくUI刷新とセッション管理の統合
 d61e1f7 (a)

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface UserProfile {
    name: string;
    avatarLabel: string; // 名前の一文字目など
    isVerified: boolean;
    useCount: number;
    rating: number;
    registrationDate: string;
    bio: string;
    hobby: string;
    purpose: string;
}

export const MyPage: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/user/profile', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.status === 401) {
                router.push('/login?callback=/mypage');
                return;
            }

            const data = await response.json();
            // 設計書のイメージに合わせたデータ構造に変換
            setUser(data.data || data);
        } catch (err) {
            console.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    if (loading) return null;

    return (

        <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-700">
 d61e1f7 (a)
            <Head>
                <title>マイページ | G4</title>
            </Head>


            {/* ヘッダー: 設計書 ①、② に対応 */}
            <header className="bg-white px-4 py-4 flex items-center justify-between border-b border-slate-100 sticky top-0 z-50">
                <button onClick={() => router.back()} className="p-2 text-slate-500">
                    <span className="text-xl">←</span>
                </button>
                <h1 className="text-lg font-bold">マイページ</h1>
 d61e1f7 (a)
                <button 
                    onClick={() => router.push('/settings/profile')}
                    className="text-sm font-medium text-slate-600 px-2"
                >

                    編集
                </button>
            </header>

            <main className="max-w-md mx-auto p-5 space-y-4">
                
                {/* メインプロフィールカード */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-50 flex flex-col items-center">
                    <div className="w-24 h-24 bg-[#E8F0FE] rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 mb-4">
                        {user?.avatarLabel || user?.name?.charAt(0) || '山'}
                    </div>
                    
                    <h2 className="text-xl font-bold mb-2">{user?.name || '山田 太郎'}</h2>
                    
                    {/* 本人確認バッジ */}
                    <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full mb-8">
                        <span className="text-blue-500 text-xs">🛡️</span>
                        <span className="text-[10px] font-bold text-blue-500 tracking-wider">本人確認済み</span>
                    </div>

                    {/* 利用統計 */}
                    <div className="w-full grid grid-cols-3 gap-4 border-t border-slate-50 pt-6">
                        <div className="text-center">
                            <p className="text-lg font-bold">{user?.useCount || 0}</p>
                            <p className="text-[10px] text-slate-400">利用回数</p>
                        </div>
                        <div className="text-center border-l border-r border-slate-50">
                            <p className="text-lg font-bold flex items-center justify-center gap-1">
                                <span className="text-yellow-400 text-sm">★</span> {user?.rating || '0.0'}
                            </p>
                            <p className="text-[10px] text-slate-400">評価</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold whitespace-nowrap">{user?.registrationDate || '2024-01〜'}</p>
                            <p className="text-[10px] text-slate-400">登録日</p>
                        </div>
                    </div>
                </div>

                {/* マイリクエストへのリンク: 設計書 ③ に対応 */}
                <button 
                    onClick={() => router.push('/hitch_hiker/MyRequest')}
                    className="w-full bg-white p-5 rounded-2xl shadow-sm border border-slate-50 flex items-center justify-between group active:bg-slate-50 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                            📍
                        </div>
                        <span className="font-bold text-slate-700">マイリクエスト</span>
                    </div>
                    <span className="text-slate-300 group-hover:translate-x-1 transition-transform">›</span>
                </button>

                {/* 詳細情報セクション: 設計書 ④ に対応 */}
                <div className="space-y-3">
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50">
                        <h3 className="text-xs font-black text-slate-400 mb-3 uppercase tracking-widest">自己紹介</h3>
                        <p className="text-[14px] leading-relaxed text-slate-600">
                            {user?.bio || 'よろしくお願いします！'}
                        </p>
                    </section>

                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50">
                        <h3 className="text-xs font-black text-slate-400 mb-3 uppercase tracking-widest">趣味</h3>
                        <p className="text-[14px] text-slate-600">
                            {user?.hobby || '旅行、写真、カフェ巡り'}
                        </p>
                    </section>

                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50">
                        <h3 className="text-xs font-black text-slate-400 mb-3 uppercase tracking-widest">主な利用目的</h3>
                        <p className="text-[14px] text-slate-600">
                            {user?.purpose || '通勤・出張'}
                        </p>
                    </section>
                </div>

                {/* ログアウトボタン (フッター付近) */}
                <button 
                    onClick={() => { if(confirm('ログアウトしますか？')) router.push('/login'); }}
                    className="w-full py-8 text-slate-300 text-[10px] font-bold tracking-[0.2em] uppercase hover:text-red-300 transition-colors"
                >
                    Sign out from account
 d61e1f7 (a)
                </button>
            </main>
        </div>
    );

};

export default MyPage;
 2fa6a17 (a)
// % End