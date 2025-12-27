// % Start(田所櫂人)
// マイリクエスト画面: 自分の投稿したリクエスト一覧を表示する

import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// 以前作成した検索カードコンポーネントを再利用、または同様のスタイルで実装
interface RequestItem {
    id: string;
    departure: string;
    destination: string;
    departureTime: string;
    fee: number;
    status: '回答待ち' | '承認済み' | '完了';
}

export const MyRequestPage: React.FC = () => {
    const router = useRouter();

    // ダミーデータ: 本来はAPIから取得
    const requests: RequestItem[] = [
        {
            id: 'req_001',
            departure: '松山市駅',
            destination: '道後温泉',
            departureTime: '2025/12/30 14:00',
            fee: 500,
            status: '回答待ち'
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans">
            <Head>
                <title>マイリクエスト</title>
            </Head>

            {/* ヘッダー: マイページと統一 */}
            <header className="bg-white px-6 py-4 flex items-center border-b border-slate-100 sticky top-0 z-50">
                <button onClick={() => router.back()} className="text-slate-600 text-xl mr-4">←</button>
                <h1 className="text-[17px] font-bold text-slate-800">マイリクエスト</h1>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-4">
                {requests.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 text-sm">
                        投稿したリクエストはありません
                    </div>
                ) : (
                    requests.map((req) => (
                        <div key={req.id} className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-50">
                            <div className="flex justify-between items-center mb-4">
                                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                                    req.status === '承認済み' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                }`}>
                                    {req.status}
                                </span>
                                <span className="text-[11px] text-slate-300 font-bold">{req.id}</span>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex flex-col items-center">
                                    <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-900"></div>
                                    <div className="w-[1px] h-8 bg-slate-100 my-1"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-800">{req.departure}</p>
                                    <div className="h-4"></div>
                                    <p className="text-sm font-bold text-slate-800">{req.destination}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                                <div>
                                    <p className="text-[9px] text-slate-400 font-black uppercase">Departure Time</p>
                                    <p className="text-xs font-bold text-slate-600">{req.departureTime}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] text-slate-400 font-black uppercase">Offer Fee</p>
                                    <p className="text-xs font-black text-blue-600">¥{req.fee.toLocaleString()}</p>
                                </div>
                            </div>

                            <button 
                                onClick={() => router.push(`/hitch_hiker/RequestDetail/${req.id}`)}
                                className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold active:scale-[0.98] transition-all"
                            >
                                詳細を確認する
                            </button>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
};

export default MyRequestPage;
// % End