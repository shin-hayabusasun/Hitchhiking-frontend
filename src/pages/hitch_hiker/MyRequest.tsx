// % Start(田所櫂人)
<<<<<<< HEAD



// マイリクエスト画面: 同乗者が申請したドライブの一覧と状況を確認・管理する

import React, { useState, useEffect } from 'react';

=======
// マイリクエスト画面: セッションエラーハンドリングの強化とUI表示ロジックの適正化

import React, { useState, useEffect, useCallback } from 'react';
>>>>>>> 2676871 (a)
import { useRouter } from 'next/router';
import Head from 'next/head';
import { TitleHeader } from '@/components/TitleHeader';

<<<<<<< HEAD

// 設計書 Table 6 (applications) および Table 4 (recruitments) に基づく型定義
=======
>>>>>>> 2676871 (a)
interface Request {
    id: string;
    driveId: string;
    driverName: string;
    origin: string;
    destination: string;
    date: string;
    time: string;
<<<<<<< HEAD
    status: number;      // 1: 申請中, 2: 承認, 3: 否認, 4: 完了 (独自拡張)
    fee: number;         // fare

=======
    status: number;
    fee: number;
>>>>>>> 2676871 (a)
}

export const MyRequestPage: React.FC = () => {
    const router = useRouter();

    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [activeTab, setActiveTab] = useState<number>(1);

    const fetchMyRequests = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`/api/hitchhiker/requests?status=${activeTab}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // セッション維持に必須
            });

            // セッション切れのハンドリング
            if (response.status === 401) {
                router.push('/login?callback=/hitch_hiker/MyRequest');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || '取得失敗');
            }

            const data = await response.json();
            // レスポンスが { data: [...] } か [...] かを判定
            const result = Array.isArray(data) ? data : (data.data || []);
            setRequests(result);
        } catch (err) {
            console.error(err);
            setError('リクエスト情報の取得に失敗しました。再ログインをお試しください。');
        } finally {
            setLoading(false);
        }
    }, [activeTab, router]);

    useEffect(() => {
        fetchMyRequests();
    }, [fetchMyRequests]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-900">
            <Head>
                <title>マイリクエスト | G4</title>
            </Head>

            <TitleHeader title="マイリクエスト" onBack={() => router.push('/home')} />

            {/* タブナビゲーション */}
            <div className="sticky top-0 z-30 bg-[#F8FAFC]/80 backdrop-blur-md px-6 py-4">
                <nav className="flex p-1 bg-slate-200/50 rounded-[1.5rem]">
                    {[
                        { id: 1, label: '承認待ち' },
                        { id: 2, label: '進行中' },
                        { id: 4, label: '履歴' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 text-xs font-black rounded-[1.2rem] transition-all duration-300 ${
                                activeTab === tab.id 
                                ? 'bg-white text-slate-900 shadow-sm' 
                                : 'text-slate-500'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <main className="max-w-md mx-auto px-6">
                {/* 1. ローディング中 */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="animate-spin h-8 w-8 border-[3px] border-slate-900 rounded-full border-t-transparent mb-4"></div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading</p>
                    </div>
                ) : (
                    <>
                        {/* 2. エラー発生時のみ表示 */}
                        {error ? (
                            <div className="mt-4 bg-red-50 text-red-500 p-5 rounded-[2rem] text-xs font-bold border border-red-100 flex items-center gap-3">
                                <span>⚠️</span> {error}
                            </div>
                        ) : (
                            <>
                                {/* 3. データが空の場合 */}
                                {requests.length === 0 ? (
                                    <div className="text-center py-40">
                                        <span className="text-5xl block mb-6 grayscale opacity-50">📂</span>
                                        <p className="text-slate-400 text-sm font-bold tracking-tight">該当するリクエストはありません</p>
                                    </div>
                                ) : (
                                    /* 4. データがある場合 */
                                    <div className="space-y-8 mt-4">
                                        {requests.map((request) => (
                                            <div key={request.id} className="bg-white rounded-[3rem] shadow-[0_15px_45px_rgba(0,0,0,0.03)] border border-white overflow-hidden">
                                                {/* ...カードの中身（前回の実装と同じ）... */}
                                                <div className="p-8">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <span className="text-[10px] font-black px-3 py-1 bg-slate-100 rounded-full text-slate-500 uppercase tracking-widest">Request ID: {request.id.slice(0,8)}</span>
                                                        <p className="text-[11px] font-bold text-slate-300">{request.date}</p>
                                                    </div>
                                                    <div className="flex gap-4 items-center">
                                                        <div className="flex-1">
                                                            <p className="text-lg font-black text-slate-800">{request.origin} → {request.destination}</p>
                                                            <p className="text-xs font-bold text-slate-400 mt-1">Driver: {request.driverName}</p>
                                                        </div>
                                                        <div className="text-right text-blue-600 font-black">
                                                            ¥{request.fee.toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => router.push(`/hitch_hiker/DriveDetail/${request.driveId}`)}
                                                        className="w-full mt-6 py-4 bg-slate-900 text-white rounded-[1.5rem] text-[11px] font-black shadow-lg shadow-slate-200"
                                                    >
                                                        詳細を確認
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>


                                    <div className="p-4 bg-white flex gap-2">
                                        <button
                                            onClick={() => router.push(`/hitch_hiker/DriveDetail/${request.driveId}`)}
                                            className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors"
                                        >
                                            詳細を表示
                                        </button>
                                        
                                        {request.status === 1 && (
                                            <button
                                                onClick={() => handleCancelRequest(request.id)}
                                                className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100"
                                            >
                                                キャンセル
                                            </button>
                                        )}
                                        
                                        {request.status === 4 && (
                                            <button
                                                onClick={() => router.push(`/hitch_hiker/review/${request.driveId}`)}
                                                className="flex-1 py-2 bg-orange-50 text-orange-600 rounded-lg text-sm font-bold hover:bg-orange-100"
                                            >
                                                レビュー
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>


                )}
            </main>
        </div>
    );
};

export default MyRequestPage;
// % End