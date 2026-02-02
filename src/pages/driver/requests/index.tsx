import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DriverHeader } from '@/components/driver/DriverHeader';
import { RequestCard } from '@/components/driver/RequestCard';
import { Plus } from 'lucide-react';
import { getApiUrl } from '@/config/api';

interface Request {
    id: number;
    passengerName: string;
    matchingRate: number;
    rating: number;
    reviewCount: number;
    departure: string;
    destination: string;
    departureTime: string;
    createdAt: string;
}

export default function DriverRequestsPage() {
    const router = useRouter();
    const currentPath = router.pathname; 

    const tabs = [
        { name: 'マイドライブ', path: '/driver/drives' },
        { name: '申請確認', path: '/driver/requests' },
        { name: '近くの募集', path: '/driver/nearby' },
        { name: '募集検索', path: '/driver/search' },
    ];

    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 申請一覧取得
    useEffect(() => {
        async function fetchRequests() {
            try {
                const response = await fetch(getApiUrl('/api/driver/requests'), {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                setRequests(data.requests || []);
            } catch (err) {
                setError('申請情報の取得に失敗しました');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchRequests();
    }, []);

    // 承認処理
    async function handleApprove(id: number) {
        if (!confirm('この申請を承認しますか？')) return;
        try {
            await fetch(getApiUrl(`/api/applications/${id}/approve`), {
                method: 'POST',
                credentials: 'include',
            });
            setRequests(requests.filter((req) => req.id !== id));
            alert('承認しました');
        } catch (err) {
            alert('承認に失敗しました');
        }
    }

    // 拒否処理
    async function handleReject(id: number) {
        if (!confirm('この申請を拒否しますか？')) return;
        try {
            await fetch(getApiUrl(`/api/applications/${id}/reject`), {
                method: 'POST',
                credentials: 'include',
            });
            setRequests(requests.filter((req) => req.id !== id));
            alert('拒否しました');
        } catch (err) {
            alert('拒否に失敗しました');
        }
    }

    // チャット処理
    function handleChat(id: number) {
        router.push(`/chat/${id}`);
    }

    function handleCreateClick() {
        router.push('/driver/regist_drive');
    }

    return (
        /* 背景を w-full で全幅に広げ、中央寄せを適用 */
        <div className="w-full min-h-screen bg-gradient-to-b from-sky-200 to-white flex flex-col items-center">
            
            {/* コンテンツを max-w-2xl に制限。既存のシャドウと背景色を維持 */}
            <div className="w-full max-w-2xl min-h-screen bg-white shadow-2xl flex flex-col relative overflow-y-auto border-x border-gray-100">
                
                {/* ヘッダー */}
                <div className="w-full sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100">
                    <DriverHeader title="申請確認" backPath="/"/>
                </div>

                <main className="w-full flex-1 p-5 pb-32 scrollbar-hide">

                    {/* タブメニュー */}
                    <div className="w-full grid grid-cols-4 gap-1 bg-slate-200/50 p-1 rounded-2xl mb-8 backdrop-blur-sm border border-white/50 shadow-inner">
                        {tabs.map((tab) => {
                            const isActive = currentPath === tab.path;
                            return (
                                <button
                                    key={tab.path}
                                    type="button"
                                    className={`py-3 text-[11px] font-black rounded-xl transition-all duration-300 ${
                                        isActive
                                            ? 'bg-white text-slate-800 shadow-md transform scale-[1.02]'
                                            : 'text-slate-500 hover:text-slate-700 hover:bg-white/30'
                                    }`}
                                    onClick={() => router.push(tab.path)}
                                >
                                    {tab.name}
                                </button>
                            );
                        })}
                    </div>

                    {loading && (
                        <div className="w-full flex flex-col items-center justify-center py-20">
                            {/* スピナーの色を更新した緑に変更 */}
                            <div className="animate-spin h-10 w-10 border-4 border-[#00B049] border-t-transparent rounded-full mb-4"></div>
                            <p className="text-slate-400 font-bold text-sm">申請を確認中...</p>
                        </div>
                    )}

                    {error && (
                        <div className="w-full bg-red-50 border border-red-100 p-5 rounded-3xl mb-6 shadow-sm">
                            <p className="text-red-500 text-center text-sm font-black">{error}</p>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="w-full space-y-5">
                            {requests.length > 0 ? (
                                requests.map((request) => (
                                    <RequestCard
                                        key={request.id}
                                        id={request.id}
                                        passengerName={request.passengerName}
                                        matchingRate={request.matchingRate}
                                        rating={request.rating}
                                        reviewCount={request.reviewCount}
                                        departure={request.departure}
                                        destination={request.destination}
                                        departureTime={request.departureTime}
                                        createdAt={request.createdAt}
                                        onApprove={handleApprove}
                                        onReject={handleReject}
                                        onChat={handleChat}
                                    />
                                ))
                            ) : (
                                <div className="w-full bg-white/60 backdrop-blur-sm rounded-[2rem] py-20 px-8 text-center border border-white/80 shadow-sm">
                                    <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                                        <Plus className="text-slate-300 rotate-45" size={32} />
                                    </div>
                                    <p className="text-slate-600 font-black text-lg">現在、申請はありません</p>
                                    <p className="text-slate-400 text-xs mt-2 font-bold leading-relaxed">
                                        乗客からの新しいドライブ申請が<br />届くまでお待ちください
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </main>
                
                {/* フフローティングボタンエリア：色を画像の緑（#00B049）に更新 */}
                <div className="sticky bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white via-white/95 to-transparent z-30">
                    <button
                        type="button"
                        className="w-full py-4 bg-[#00B049] hover:bg-[#009940] text-white rounded-2xl font-black shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        onClick={handleCreateClick}
                    >
                        <Plus size={22} strokeWidth={3} /> ドライブを作成
                    </button>
                </div>
            </div>
        </div>
    );
}