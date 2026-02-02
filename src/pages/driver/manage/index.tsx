import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DriverHeader } from '@/components/driver/DriverHeader';

interface Drive {
    id: string;
    departure: string;
    destination: string;
    departureTime: string;
    status: 'scheduled' | 'active' | 'completed';
    passengers: number;
    capacity: number;
}

export function DriveManagePage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<
        'scheduled' | 'active' | 'completed'
    >('scheduled');
    const [drives, setDrives] = useState<Drive[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDrives();
    }, [activeTab]);

    async function fetchDrives() {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(
                `/api/driver/drives?status=${activeTab}`,
                {
                    method: 'GET',
                    credentials: 'include',
                }
            );
            const data = await response.json();
            if (response.ok && data.drives) {
                setDrives(data.drives);
            }
        } catch (err) {
            setError('ドライブ情報の取得に失敗しました');
        } finally {
            setLoading(false);
        }
    }

    async function handleComplete(driveId: string) {
        if (!confirm('このドライブを完了しますか？')) {
            return;
        }

        try {
            const response = await fetch(`/api/drives/${driveId}/complete`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                alert('ドライブが完了しました');
                router.push('/driver/complete');
            } else {
                alert('完了処理に失敗しました');
            }
        } catch (err) {
            alert('完了処理に失敗しました');
        }
    }

    async function handleCancel(driveId: string) {
        if (!confirm('このドライブをキャンセルしますか？')) {
            return;
        }

        try {
            const response = await fetch(`/api/drives/${driveId}/cancel`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                alert('ドライブをキャンセルしました');
                fetchDrives();
            } else {
                alert('キャンセルに失敗しました');
            }
        } catch (err) {
            alert('キャンセルに失敗しました');
        }
    }

    return (
        /* ★ 背景を w-full で画面一杯に広げ、中央寄せを適用 */
        <div className="w-full min-h-screen bg-gradient-to-b from-sky-200 to-white flex flex-col items-center">
            
            {/* ★ コンテンツを max-w-2xl に制限。既存のシャドウと背景色を維持 */}
            <div className="w-full max-w-2xl min-h-screen bg-white shadow-2xl flex flex-col relative overflow-y-auto border-x border-gray-100">
                
                {/* ヘッダー（そのまま維持） */}
                <div className="w-full sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100">
                    <DriverHeader />
                </div>

                <main className="w-full flex-1 p-5 pb-10">
                    <h2 className="text-xl font-extrabold mb-6 text-center text-[#10B981]">ドライブ管理</h2>

                    {/* タブ切り替え（デザイン・サイズを維持） */}
                    <div className="w-full mb-6 flex justify-center space-x-2 bg-white/50 p-1 rounded-2xl backdrop-blur-sm shadow-sm border border-slate-100">
                        <button
                            onClick={() => setActiveTab('scheduled')}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                                activeTab === 'scheduled'
                                    ? 'bg-[#10B981] text-white shadow-md'
                                    : 'text-slate-500 hover:bg-white/50'
                            }`}
                        >
                            予定中
                        </button>
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                                activeTab === 'active'
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'text-slate-500 hover:bg-white/50'
                            }`}
                        >
                            進行中
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                                activeTab === 'completed'
                                    ? 'bg-slate-500 text-white shadow-md'
                                    : 'text-slate-500 hover:bg-white/50'
                            }`}
                        >
                            完了
                        </button>
                    </div>

                    {loading ? (
                        <div className="w-full flex justify-center py-20 text-emerald-500 font-bold">読み込み中...</div>
                    ) : error ? (
                        <div className="w-full text-center text-red-500 font-bold">{error}</div>
                    ) : drives.length === 0 ? (
                        <div className="w-full text-center py-20 text-slate-500 bg-white/50 rounded-3xl">
                            <p className="font-bold">
                                {activeTab === 'scheduled' && '予定中のドライブはありません'}
                                {activeTab === 'active' && '進行中のドライブはありません'}
                                {activeTab === 'completed' && '完了したドライブはありません'}
                            </p>
                        </div>
                    ) : (
                        /* ★ カードリスト：max-w-2xl 内で最適な grid 配置を維持 */
                        <div className="w-full grid grid-cols-1 gap-5">
                            {drives.map((drive) => (
                                <div key={drive.id} className="w-full bg-white rounded-3xl shadow-sm border border-slate-50 p-6 flex flex-col transition-all hover:shadow-md">
                                    <h3 className="font-black text-lg mb-2 text-slate-800">
                                        {drive.departure} → {drive.destination}
                                    </h3>
                                    <p className="text-sm text-slate-500 mb-1 flex items-center gap-2">
                                        <span className="font-bold">📅 出発:</span> {drive.departureTime}
                                    </p>
                                    <p className="text-sm text-slate-500 mb-6 flex items-center gap-2">
                                        <span className="font-bold">👥 同乗者:</span> {drive.passengers}/{drive.capacity}名
                                    </p>

                                    <div className="mt-auto flex flex-col space-y-3">
                                        {activeTab === 'scheduled' && (
                                            <>
                                                <button
                                                    onClick={() => router.push(`/driver/requests?driveId=${drive.id}`)}
                                                    className="w-full bg-emerald-50 text-[#10B981] font-black py-3 rounded-2xl text-sm hover:bg-emerald-100 transition-colors"
                                                >
                                                    承認待ち確認
                                                </button>
                                                <button
                                                    onClick={() => router.push(`/driver/drives/edit/${drive.id}`)}
                                                    className="w-full bg-blue-50 text-blue-600 font-black py-3 rounded-2xl text-sm hover:bg-blue-100 transition-colors"
                                                >
                                                    編集
                                                </button>
                                                <button
                                                    onClick={() => handleCancel(drive.id)}
                                                    className="w-full bg-red-50 text-red-500 font-black py-3 rounded-2xl text-sm hover:bg-red-100 transition-colors"
                                                >
                                                    キャンセル
                                                </button>
                                            </>
                                        )}
                                        {activeTab === 'active' && (
                                            <>
                                                <button
                                                    onClick={() => router.push(`/chat/${drive.id}`)}
                                                    className="w-full bg-blue-500 text-white font-black py-3 rounded-2xl text-sm shadow-md hover:bg-blue-600 transition-all"
                                                >
                                                    💬 チャットを開く
                                                </button>
                                                <button
                                                    onClick={() => handleComplete(drive.id)}
                                                    className="w-full bg-[#10B981] text-white font-black py-3 rounded-2xl text-sm shadow-md hover:bg-emerald-600 transition-all"
                                                >
                                                    完了する
                                                </button>
                                            </>
                                        )}
                                        {activeTab === 'completed' && (
                                            <button
                                                onClick={() => router.push(`/driver/review/${drive.id}`)}
                                                className="w-full bg-slate-100 text-slate-600 font-black py-3 rounded-2xl text-sm hover:bg-slate-200 transition-colors"
                                            >
                                                評価を見る
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default DriveManagePage;