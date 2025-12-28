// % Start(田所櫂人)

// マイリクエスト画面: 同乗者が申請したドライブの一覧と状況を確認・管理する

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { TitleHeader } from '@/components/TitleHeader';

interface Request {
    id: string;
    driveId: string;
    driverName: string;
    origin: string;
    destination: string;
    date: string;
    status: number;
    fee: number;
}

const MyRequestPage: React.FC = () => {
    const router = useRouter();
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [activeTab, setActiveTab] = useState<number>(1);

    const fetchMyRequests = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/hitchhiker/requests?status=${activeTab}`, { credentials: 'include' });
            if (res.status === 401) {
                router.push('/login?callback=/hitch_hiker/MyRequest');
                return;
            }
            if (!res.ok) throw new Error('取得失敗');
            const data = await res.json().catch(() => ({}));
            const list = Array.isArray(data) ? data : data.data || [];
            setRequests(list);
        } catch (e) {
            console.error(e);
            setError('リクエスト情報の取得に失敗しました');
        } finally {
            setLoading(false);
        }
    }, [activeTab, router]);

    useEffect(() => { fetchMyRequests(); }, [fetchMyRequests]);

    const handleCancelRequest = useCallback(async (id: string) => {
        if (!confirm('本当にキャンセルしますか？')) return;
        try {
            const res = await fetch(`/api/hitchhiker/requests/${id}`, { method: 'DELETE', credentials: 'include' });
            if (!res.ok) throw new Error('キャンセル失敗');
            await fetchMyRequests();
        } catch (e) {
            console.error(e);
            alert('キャンセルに失敗しました');
        }
    }, [fetchMyRequests]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-900">
            <Head>
                <title>マイリクエスト | G4</title>
            </Head>

            <TitleHeader title="マイリクエスト" onBack={() => router.push('/home')} />

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
                                activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                            }`}
                        >{tab.label}</button>
                    ))}
                </nav>
            </div>

            <main className="max-w-md mx-auto px-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="animate-spin h-8 w-8 border-[3px] border-slate-900 rounded-full border-t-transparent mb-4"></div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading</p>
                    </div>
                ) : (
                    <>
                        {error ? (
                            <div className="mt-4 bg-red-50 text-red-500 p-5 rounded-[2rem] text-xs font-bold border border-red-100 flex items-center gap-3">
                                <span>⚠️</span> {error}
                            </div>
                        ) : (
                            <>
                                {requests.length === 0 ? (
                                    <div className="text-center py-40">
                                        <span className="text-5xl block mb-6 grayscale opacity-50">📂</span>
                                        <p className="text-slate-400 text-sm font-bold tracking-tight">該当するリクエストはありません</p>
                                    </div>
                                ) : (
                                    <div className="space-y-8 mt-4">
                                        {requests.map((request) => (
                                            <div key={request.id} className="bg-white rounded-[3rem] shadow-[0_15px_45px_rgba(0,0,0,0.03)] border border-white overflow-hidden">
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
                                                        <div className="text-right text-blue-600 font-black">¥{request.fee.toLocaleString()}</div>
                                                    </div>
                                                    <button onClick={() => router.push(`/hitch_hiker/DriveDetail/${request.driveId}`)} className="w-full mt-6 py-4 bg-slate-900 text-white rounded-[1.5rem] text-[11px] font-black shadow-lg shadow-slate-200">詳細を確認</button>
                                                </div>

                                                <div className="p-4 bg-white flex gap-2">
                                                    <button onClick={() => router.push(`/hitch_hiker/DriveDetail/${request.driveId}`)} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">詳細を表示</button>

                                                    {request.status === 1 && (
                                                        <button onClick={() => handleCancelRequest(request.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100">キャンセル</button>
                                                    )}

                                                    {request.status === 4 && (
                                                        <button onClick={() => router.push(`/hitch_hiker/review/${request.driveId}`)} className="flex-1 py-2 bg-orange-50 text-orange-600 rounded-lg text-sm font-bold hover:bg-orange-100">レビュー</button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default MyRequestPage;

// % End
// % Start(田所櫂人)
