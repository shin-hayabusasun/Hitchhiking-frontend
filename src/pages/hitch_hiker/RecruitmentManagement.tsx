// % Start(田所櫂人)


// 募集管理画面: 同乗者が投稿したヒッチハイク募集の一覧表示および管理を行う

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { TitleHeader } from '@/components/TitleHeader';

interface Recruitment {
    id: string;
    origin: string;
    destination: string;
    date: string;
    time: string;
    status: number;
    applicantsCount: number;
    fee: number;
}

/**
 * RecruitmentManagementPage コンポーネント
 * ユーザー（主に同乗者側）が作成した募集の管理および
 * 運転者からの申請（オファー）をチェックする画面
 */
export const RecruitmentManagementPage: React.FC = () => {
    const router = useRouter();
    const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        fetchRecruitments();
    }, []);

    const fetchRecruitments = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/hitchhiker/my-recruitments', {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setRecruitments(Array.isArray(data) ? data : data.data || []);
            } else {
                setError(data.error || '情報の取得に失敗しました。');
            }
        } catch (err) {
            setError('ネットワークエラーが発生しました。');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRecruitment = async (id: string) => {
        if (!confirm('この募集を削除してもよろしいですか？')) return;
        try {
            const response = await fetch(`/api/hitchhiker/recruitments/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (response.ok) {
                fetchRecruitments();
            }
        } catch (err) {
            alert('通信エラーが発生しました。');
        }
    };

    // ステータス別のテーマ定義
    const getStatusTheme = (status: number) => {
        switch (status) {
            case 1: return "bg-blue-50 text-blue-600 border-blue-100"; // 募集中
            case 2: return "bg-green-50 text-green-600 border-green-100"; // マッチング済
            case 4: return "bg-slate-50 text-slate-400 border-slate-100"; // キャンセル
            default: return "bg-slate-50 text-slate-500 border-slate-100";
        }
    };

    const getStatusText = (status: number) => {
        switch (status) {
            case 1: return "募集中";
            case 2: return "マッチング済";
            case 3: return "完了";
            case 4: return "キャンセル";
            default: return "不明";
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-900">
            <Head>
                <title>募集管理 | G4</title>
            </Head>

            <TitleHeader title="募集管理" onBack={() => router.push('/mypage')} />

            <main className="max-w-md mx-auto px-6 pt-4">
                
                {/* 新規作成セクション */}
                <div className="mb-10">
                    <button
                        onClick={() => router.push('/hitch_hiker/passenger/CreateDrivePassenger')}
                        className="group w-full py-6 bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 hover:border-slate-900 hover:bg-slate-50 transition-all duration-300"
                    >
                        <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center text-2xl font-light group-hover:scale-110 transition-transform">＋</div>
                        <span className="text-[13px] font-black text-slate-900 tracking-widest">新しい募集を投稿する</span>
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-5 rounded-[2rem] text-xs font-bold border border-red-100 mb-8 flex items-center gap-3">
                        <span>⚠️</span> {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center py-20">
                        <div className="animate-spin h-8 w-8 border-[3px] border-slate-900 rounded-full border-t-transparent mb-4"></div>
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Loading</p>
                    </div>
                ) : recruitments.length === 0 ? (
                    <div className="text-center py-24 bg-white/50 rounded-[3rem] border border-slate-100 border-dashed">
                        <div className="text-4xl mb-4 grayscale opacity-30">📋</div>
                        <p className="text-slate-400 text-sm font-bold">作成した募集はまだありません</p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {recruitments.map((item) => (
                            <div key={item.id} className="relative group">
                                {/* 申請あり通知バッジ - カード上部にフロート表示 */}
                                {item.applicantsCount > 0 && (
                                    <div className="absolute -top-4 left-6 right-6 z-10 bg-orange-500 text-white text-[10px] font-black px-4 py-3 rounded-2xl shadow-xl shadow-orange-200 flex justify-between items-center animate-bounce">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">🔔</span>
                                            <span>運転者から {item.applicantsCount} 件の申請があります</span>
                                        </div>
                                        <span className="bg-white/20 px-2 py-0.5 rounded-lg">Check</span>
                                    </div>
                                )}

                                <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white overflow-hidden transition-all duration-300 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)]">
                                    
                                    {/* ステータス & 日付 */}
                                    <div className="px-8 pt-8 pb-4 flex justify-between items-center">
                                        <span className={`text-[10px] font-black px-4 py-1.5 rounded-full border ${getStatusTheme(item.status)}`}>
                                            {getStatusText(item.status)}
                                        </span>
                                        <span className="text-[11px] font-bold text-slate-300 tracking-tight">{item.date}</span>
                                    </div>

                                    {/* ルート内容 */}
                                    <div className="px-8 py-6">
                                        <div className="flex gap-6">
                                            <div className="flex flex-col items-center py-1">
                                                <div className="w-3.5 h-3.5 rounded-full border-[3px] border-slate-900 bg-white shadow-sm"></div>
                                                <div className="w-[2px] flex-1 min-h-[45px] bg-slate-100 my-1"></div>
                                                <div className="w-3.5 h-3.5 rounded-full bg-slate-200"></div>
                                            </div>
                                            <div className="flex-1 space-y-6">
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Departure</p>
                                                    <p className="text-lg font-black text-slate-800 leading-tight">{item.origin}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Destination</p>
                                                    <p className="text-lg font-black text-slate-800 leading-tight">{item.destination}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 詳細データ */}
                                        <div className="mt-8 grid grid-cols-2 gap-3">
                                            <div className="bg-slate-50/80 p-4 rounded-[1.5rem] border border-slate-100/50">
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Time</p>
                                                <p className="text-[12px] font-bold text-slate-700">{item.time}</p>
                                            </div>
                                            <div className="bg-blue-50/50 p-4 rounded-[1.5rem] border border-blue-100/30">
                                                <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">Budget</p>
                                                <p className="text-[12px] font-black text-blue-600">¥{item.fee.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ボタンアクション */}
                                    <div className="px-6 pb-6 pt-2 flex flex-col gap-3">
                                        {item.applicantsCount > 0 ? (
                                            <button
                                                onClick={() => router.push(`/hitch_hiker/recruitment/${item.id}/applicants`)}
                                                className="w-full py-5 bg-slate-900 text-white rounded-[2rem] text-[12px] font-black shadow-xl shadow-slate-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                                            >
                                                <span>申請一覧を見る</span>
                                                <span className="bg-orange-500 text-[10px] w-5 h-5 flex items-center justify-center rounded-full">{item.applicantsCount}</span>
                                            </button>
                                        ) : (
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => router.push(`/hitch_hiker/passenger/EditDrivePassenger?id=${item.id}`)}
                                                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-[1.8rem] text-[11px] font-black hover:bg-slate-200 transition-all active:scale-95"
                                                >
                                                    募集を編集
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteRecruitment(item.id)}
                                                    className="px-6 py-4 bg-red-50 text-red-400 rounded-[1.8rem] text-[11px] font-black hover:bg-red-100 transition-all active:scale-95"
                                                >
                                                    削除
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </main>
        </div>
    );
};


export default RecruitmentManagementPage;

// % End