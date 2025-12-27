// % Start(田所櫂人)
<<<<<<< HEAD
import React, { useState } from 'react';
=======
// マイリクエスト画面: 同乗者が申請したドライブの一覧と状況を確認・管理する

import React, { useState, useEffect } from 'react';
>>>>>>> 77e0e92 (a)
import { useRouter } from 'next/router';
import Head from 'next/head';
import { TitleHeader } from '@/components/TitleHeader'; // 共通コンポーネントを使用

<<<<<<< HEAD
interface RequestItem {
    id: string;
    driverName: string;
    rating: number;
    reviewCount: number;
    departure: string;
    destination: string;
    departureTime: string;
    fee: number;
    status: '承認待ち' | '承認済み' | '完了';
    appliedDate: string;
=======
// 設計書 Table 6 (applications) および Table 4 (recruitments) に基づく型定義
interface Request {
    id: string;          // application_id
    driveId: string;     // recruitment_id
    driverName: string;
    origin: string;
    destination: string;
    date: string;
    time: string;
    status: number;      // 1: 申請中, 2: 承認, 3: 否認, 4: 完了 (独自拡張)
    fee: number;         // fare
>>>>>>> 77e0e92 (a)
}

export const MyRequestPage: React.FC = () => {
    const router = useRouter();
<<<<<<< HEAD
    const [activeTab, setActiveTab] = useState<'申請中' | '承認済み' | '完了'>('申請中');

    // UIイメージに基づいたダミーデータ
    const requests: RequestItem[] = [
        {
            id: 'REQ-2025-1101',
            driverName: '工宋 太原',
            rating: 4.8,
            reviewCount: 46,
            departure: '東京駅',
            destination: '埠浜駅',
            departureTime: '2025-11-06 08:00',
            fee: 880,
            status: '承認待ち',
            appliedDate: '2025-11-01'
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans">
            <Head>
                <title>マイリクエスト</title>
            </Head>

            {/* ヘッダー */}
            <header className="bg-white px-4 py-4 flex items-center sticky top-0 z-50">
                <button onClick={() => router.back()} className="text-slate-600 text-xl mr-4">←</button>
                <h1 className="text-[17px] font-bold text-slate-800">マイリクエスト</h1>
            </header>

            {/* タブ切り替え */}
            <div className="px-4 py-3">
                <div className="bg-[#E9ECEF] p-1 rounded-full flex gap-1">
                    {(['申請中', '承認済み', '完了'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${
                                activeTab === tab ? 'bg-black text-white shadow-sm' : 'text-slate-500'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <main className="px-4 pb-8 space-y-4">
                {requests.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 mt-10">
                        <p className="text-slate-400 text-sm">該当するリクエストはありません</p>
                    </div>
                ) : (
                    requests.map((req) => (
                        <div key={req.id} className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-50">
                            {/* ステータスと申請日 */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full">
                                    <span className="text-xs">🕒</span>
                                    <span className="text-[11px] font-bold">{req.status}</span>
                                </div>
                                <span className="text-[11px] text-slate-400 font-medium">申請日: {req.appliedDate}</span>
                            </div>

                            {/* 運転手プロフィール */}
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-12 h-12 bg-[#D1E3FF] rounded-full flex items-center justify-center text-[#4285F4] font-bold text-lg">
                                    {req.driverName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-[15px]">{req.driverName}</h3>
                                    <p className="text-[11px] text-slate-400">
                                        <span className="text-yellow-400">★</span> {req.rating} ({req.reviewCount}回)
                                    </p>
                                </div>
                            </div>

                            {/* 詳細情報 */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-green-500 text-lg">📍</span>
                                    <span className="text-sm font-bold text-slate-700">{req.departure}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-red-500 text-lg">📍</span>
                                    <span className="text-sm font-bold text-slate-700">{req.destination}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-slate-400 text-lg">📅</span>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-slate-600">{req.departureTime}</span>
                                        <div className="flex items-center gap-1">
                                            <span className="text-green-500 text-sm font-bold">＄</span>
                                            <span className="text-sm font-black text-green-500">¥{req.fee.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* アクションボタン */}
                            <div className="space-y-2">
                                <button 
                                    onClick={() => router.push(`/hitch_hiker/RequestDetail/${req.id}`)}
                                    className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:bg-slate-50 transition-all"
                                >
                                    <span>👁️</span> 詳細を見る
                                </button>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl text-sm font-bold active:bg-slate-50 transition-all">
                                        取り消し
                                    </button>
                                    <button className="flex-[1.5] py-3 bg-[#1A73E8] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:opacity-90 transition-all">
                                        <span>💬</span> チャット
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
=======
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [activeTab, setActiveTab] = useState<number>(1); // デフォルトは「申請中(1)」

    // タブ切り替え時にデータを再取得
    useEffect(() => {
        fetchMyRequests();
    }, [activeTab]);

    /**
     * 申請一覧取得処理
     */
    const fetchMyRequests = async () => {
        setLoading(true);
        setError('');
        
        try {
            // クエリパラメータでステータスをフィルタリング
            const response = await fetch(`/api/hitchhiker/requests?status=${activeTab}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            
            if (!response.ok) throw new Error('データ取得に失敗しました');
            
            const data = await response.json();
            // APIレスポンスが直接配列で来るか、successプロパティを持つかに対応
            setRequests(data.data || data);
        } catch (err) {
            setError('リクエスト情報の取得に失敗しました。');
        } finally {
            setLoading(false);
        }
    };

    /**
     * 申請キャンセル処理
     */
    const handleCancelRequest = async (requestId: string) => {
        if (!confirm('この申請をキャンセルしますか？')) return;

        try {
            const response = await fetch(`/api/hitchhiker/requests/${requestId}`, {
                method: 'DELETE', // 一般的な削除メソッド
                credentials: 'include',
            });

            if (response.ok) {
                alert('申請をキャンセルしました。');
                fetchMyRequests();
            } else {
                alert('キャンセルに失敗しました。');
            }
        } catch (err) {
            alert('ネットワークエラーが発生しました。');
        }
    };

    // --- ヘルパー関数 ---

    const getStatusDisplay = (status: number) => {
        switch (status) {
            case 1: return { text: '承認待ち', color: '#FFA500' };
            case 2: return { text: '承認済み', color: '#4CAF50' };
            case 3: return { text: '否認', color: '#F44336' };
            case 4: return { text: '完了', color: '#2196F3' };
            default: return { text: '不明', color: '#999' };
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Head>
                <title>マイリクエスト | G4 ヒッチハイク</title>
            </Head>

            {/* 共通ヘッダーコンポーネントがある場合 */}
            <TitleHeader title="マイリクエスト" onBack={() => router.push('/home')} />

            {/* タブナビゲーション */}
            <div className="flex bg-white border-b sticky top-0 z-10">
                {[
                    { id: 1, label: '承認待ち' },
                    { id: 2, label: '承認済み' },
                    { id: 4, label: '完了' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-4 text-sm font-bold transition-colors ${
                            activeTab === tab.id 
                            ? 'text-green-600 border-b-2 border-green-600' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <main className="p-4">
                {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">{error}</div>}

                {loading ? (
                    <div className="flex justify-center p-10 text-gray-400">読み込み中...</div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p>該当するリクエストはありません。</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((request) => {
                            const statusInfo = getStatusDisplay(request.status);
                            return (
                                <div key={request.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                                    <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
                                        <span 
                                            className="text-white text-xs px-3 py-1 rounded-full font-bold"
                                            style={{ backgroundColor: statusInfo.color }}
                                        >
                                            {statusInfo.text}
                                        </span>
                                        <span className="text-gray-400 text-xs">{request.date}</span>
                                    </div>

                                    <div className="p-4">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                <div className="w-0.5 h-6 bg-gray-200 my-1"></div>
                                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                            </div>
                                            <div className="flex-1 text-sm font-medium space-y-4">
                                                <p>{request.origin}</p>
                                                <p>{request.destination}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                                            <p><strong>運転者:</strong> {request.driverName}</p>
                                            <p><strong>出発:</strong> {request.time}</p>
                                            <p className="col-span-2"><strong>料金:</strong> ¥{request.fee.toLocaleString()}</p>
                                        </div>
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
>>>>>>> 77e0e92 (a)
                )}
            </main>
        </div>
    );
};

export default MyRequestPage;
// % End