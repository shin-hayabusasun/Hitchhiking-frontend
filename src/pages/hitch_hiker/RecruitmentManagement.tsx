// % Start(田所櫂人)

// 募集管理画面: 同乗者が投稿したヒッチハイク募集の一覧表示および管理を行う

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { TitleHeader } from '@/components/TitleHeader';

// 内部設計書 Table 4 (recruitments) に基づく型定義
interface Recruitment {
    id: string;               // recruitment_id
    origin: string;
    destination: string;
    date: string;
    time: string;
    // status: 1:募集中, 2:成立(マッチング済), 3:完了, 4:キャンセル
    status: number;
    applicantsCount: number;  // この募集に届いている申請数
    fee: number;              // fare (設計書 Table 4 参照)
}

/**
 * RecruitmentManagementPage コンポーネント
 * 同乗者が自身の「募集（リクエスト）」を管理する
 */
export const RecruitmentManagementPage: React.FC = () => {
    const router = useRouter();
    const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    // 初回レンダリング時に募集一覧を取得
    useEffect(() => {
        fetchRecruitments();
    }, []);

    /**
     * 自分が作成した募集一覧の取得
     */
    const fetchRecruitments = async () => {
        setLoading(true);
        setError('');
        
        try {
            // エンドポイントは同乗者(hitchhiker)専用の募集管理
            const response = await fetch('/api/hitchhiker/my-recruitments', {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();

            if (response.ok) {
                setRecruitments(data.data || data);
            } else {
                setError(data.error || '情報の取得に失敗しました。');
            }
        } catch (err) {
            setError('ネットワークエラーが発生しました。');
        } finally {
            setLoading(false);
        }
    };

    /**
     * 募集の削除（論理削除またはキャンセル）
     */
    const handleDeleteRecruitment = async (id: string) => {
        if (!confirm('この募集を削除してもよろしいですか？')) return;

        try {
            const response = await fetch(`/api/hitchhiker/recruitments/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                alert('募集を削除しました。');
                fetchRecruitments();
            } else {
                alert('削除に失敗しました。');
            }
        } catch (err) {
            alert('通信エラーが発生しました。');
        }
    };

    // ステータス表示制御
    const getStatusDisplay = (status: number) => {
        switch (status) {
            case 1: return { text: '募集中', color: 'bg-green-500' };
            case 2: return { text: 'マッチング済', color: 'bg-blue-500' };
            case 3: return { text: '完了', color: 'bg-gray-400' };
            case 4: return { text: 'キャンセル', color: 'bg-red-500' };
            default: return { text: '不明', color: 'bg-gray-300' };
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>募集管理 | G4 ヒッチハイク</title>
            </Head>

            <TitleHeader 
                title="募集管理" 
                onBack={() => router.push('/mypage')} 
            />

            {/* 新規作成フローへの誘導 */}
            <div className="p-4">
                <button
                    onClick={() => router.push('/hitch_hiker/passenger/CreateDrivePassenger')}
                    className="w-full py-3 bg-green-600 text-white rounded-xl font-bold shadow-md hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                >
                    <span className="text-xl">+</span> 新しい募集を作成する
                </button>
            </div>

            <main className="p-4 pb-20">
                {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 text-sm text-center">{error}</div>}

                {loading ? (
                    <div className="flex justify-center p-10 text-gray-400">読み込み中...</div>
                ) : recruitments.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400">現在、公開中の募集はありません。</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recruitments.map((item) => {
                            const statusInfo = getStatusDisplay(item.status);
                            return (
                                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    {/* カードヘッダー */}
                                    <div className="p-4 flex justify-between items-center border-b border-gray-50 bg-gray-50/30">
                                        <span className={`${statusInfo.color} text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm`}>
                                            {statusInfo.text}
                                        </span>
                                        {item.applicantsCount > 0 && (
                                            <span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full font-bold animate-pulse">
                                                申請が {item.applicantsCount} 件届いています
                                            </span>
                                        )}
                                    </div>

                                    {/* ルート情報 */}
                                    <div className="p-4">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-2.5 h-2.5 rounded-full border-2 border-green-500 bg-white"></div>
                                                <div className="w-0.5 h-6 bg-gray-200"></div>
                                                <div className="w-2.5 h-2.5 rounded-full border-2 border-red-500 bg-white"></div>
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <div className="text-sm font-bold text-gray-800">{item.origin}</div>
                                                <div className="text-sm font-bold text-gray-800">{item.destination}</div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded-xl text-xs text-gray-600 grid grid-cols-2 gap-y-1">
                                            <p><strong>出発予定:</strong> {item.date} {item.time}</p>
                                            <p><strong>希望料金:</strong> ¥{item.fee.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* アクションボタン */}
                                    <div className="p-4 pt-0 flex gap-2">
                                        {item.status === 1 && (
                                            <>
                                                <button
                                                    onClick={() => router.push(`/hitch_hiker/passenger/EditDrivePassenger?id=${item.id}`)}
                                                    className="flex-1 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                                >
                                                    内容編集
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteRecruitment(item.id)}
                                                    className="flex-1 py-2 text-sm font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                                >
                                                    削除
                                                </button>
                                            </>
                                        )}
                                        
                                        {item.applicantsCount > 0 && (
                                            <button
                                                onClick={() => router.push(`/hitch_hiker/recruitment/${item.id}/applicants`)}
                                                className="flex-[2] py-2 text-sm font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 shadow-md transition-all"
                                            >
                                                運転者からの申請を確認
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


export default RecruitmentManagementPage;

// % End