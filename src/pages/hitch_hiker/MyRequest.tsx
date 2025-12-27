// % Start(田所櫂人)
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

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
}

export const MyRequestPage: React.FC = () => {
    const router = useRouter();
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
                )}
            </main>
        </div>
    );
};

export default MyRequestPage;
// % End