// % Start(田所櫂人)
import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export const MyPage: React.FC = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans">
            <Head>
                <title>マイページ</title>
            </Head>

            {/* ヘッダー */}
            <header className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <button onClick={() => router.back()} className="text-slate-600 text-xl">←</button>
                <h1 className="text-[17px] font-medium text-slate-800">マイページ</h1>
                <button className="text-[15px] text-slate-600">編集</button>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-4">
                {/* プロフィールメインカード */}
                <div className="bg-white rounded-[32px] p-8 shadow-[0_2px_12px_rgba(0,0,0,0,04)] flex flex-col items-center">
                    <div className="w-24 h-24 bg-[#E8F0FE] rounded-full flex items-center justify-center text-[32px] font-bold text-[#4285F4] mb-4">
                        山
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">山田 太郎</h2>
                    <div className="flex items-center gap-1 bg-[#E8F0FE] px-3 py-1 rounded-full mb-8">
                        <span className="text-[#4285F4] text-xs">🛡️</span>
                        <span className="text-[11px] font-bold text-[#4285F4]">本人確認済み</span>
                    </div>

                    <div className="w-full grid grid-cols-3 pt-6 border-t border-slate-100">
                        <div className="text-center">
                            <p className="text-[17px] font-bold text-slate-800">12</p>
                            <p className="text-[11px] text-slate-400 mt-1">利用回数</p>
                        </div>
                        <div className="text-center border-x border-slate-100">
                            <p className="text-[17px] font-bold text-slate-800">★ 4.7</p>
                            <p className="text-[11px] text-slate-400 mt-1">評価</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[17px] font-bold text-slate-800">2024-01〜</p>
                            <p className="text-[11px] text-slate-400 mt-1">登録日</p>
                        </div>
                    </div>
                </div>

                {/* マイリクエストボタン */}
                <button 
                    onClick={() => router.push('/hitch_hiker/MyRequest')}
                    className="w-full bg-white p-5 rounded-[24px] shadow-[0_2px_8px_rgba(0,0,0,0,03)] flex items-center justify-between group active:scale-[0.98] transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#E8F0FE] rounded-full flex items-center justify-center text-[#4285F4]">📍</div>
                        <span className="font-bold text-slate-700">マイリクエスト</span>
                    </div>
                    <span className="text-slate-300 text-xl">›</span>
                </button>

                {/* 詳細セクション */}
                <div className="space-y-3">
                    {['自己紹介', '趣味', '主な利用目的'].map((title, i) => (
                        <div key={i} className="bg-white p-6 rounded-[24px] shadow-[0_2px_8px_rgba(0,0,0,0,03)]">
                            <h3 className="text-[13px] font-bold text-slate-400 mb-3">{title}</h3>
                            <p className="text-[15px] text-slate-600">
                                {title === '自己紹介' && 'よろしくお願いします！'}
                                {title === '趣味' && '旅行、写真、カフェ巡り'}
                                {title === '主な利用目的' && '通勤・出張'}
                            </p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};
export default MyPage;
// % End