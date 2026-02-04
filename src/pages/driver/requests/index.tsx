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
                
                // APIが { requests: [...] } の形式で返すことを想定
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
            // ★修正: バッククォート ( ` ) を使用
            await fetch(getApiUrl(`/api/applications/${id}/approve`), {
                method: 'POST',
                credentials: 'include',
            });
            // 成功したらリストから削除
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
            // ★修正: バッククォート ( ` ) を使用
            await fetch(getApiUrl(`/api/applications/${id}/reject`), {
                method: 'POST',
                credentials: 'include',
            });
            // 成功したらリストから削除
            setRequests(requests.filter((req) => req.id !== id));
            alert('拒否しました');
        } catch (err) {
            alert('拒否に失敗しました');
        }
    }

    // チャット処理
    function handleChat(id: number) {
        // チャット画面に遷移（申請IDをchatidとして使用）
        router.push(`/chat/${id}`);
    }

    function handleCreateClick() {
        router.push('/driver/drives/create');
    }


    return (
        /* 全体背景：指定の薄グレー */
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
            <div className="w-full min-h-screen flex flex-col relative">
                
                {/* Header: 背景は白で全幅、中身は max-w-2xl */}
                <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                    <div className="max-w-2xl mx-auto w-full px-4 py-1">
                        <DriverHeader title="申請確認" backPath="/"/>
                    </div>
                </header>

                {/* Main Content: max-w-2xl で中央寄せ、白ベタ塗り、左右ボーダー */}
                <main className="flex-1 overflow-y-auto bg-[#F8FAFC] max-w-2xl mx-auto w-full min-h-screen relative">
                    <div className="p-5 space-y-4 pb-32">

                        {/* 統一タブメニュー */}
                        <div className="w-full grid grid-cols-4 gap-1 bg-gray-100/80 p-1 rounded-2xl mb-8 border border-gray-200/50">
                            {tabs.map((tab) => {
                                const isActive = currentPath === tab.path;
                                return (
                                    <button
                                        key={tab.path}
                                        type="button"
                                        className={`py-3 text-[11px] font-black rounded-xl transition-all duration-300 ${
                                            isActive
                                                ? 'bg-white text-gray-800 shadow-sm transform scale-[1.02]'
                                                : 'text-gray-400 hover:text-gray-600'
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
                                <div className="animate-spin h-10 w-10 border-4 border-[#00B049] border-t-transparent rounded-full mb-4"></div>
                                <p className="text-gray-400 font-bold text-sm">申請を確認中...</p>
                            </div>
                        )}

                        {error && (
                            <div className="w-full bg-red-50 border border-red-100 p-5 rounded-3xl mb-6 shadow-sm">
                                <p className="text-red-500 text-center text-sm font-black">{error}</p>
                            </div>
                        )}

                        {!loading && !error && (
                            <div className="w-full space-y-4">
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
                                    <div className="w-full bg-gray-50 rounded-[2rem] py-20 px-8 text-center border border-gray-100">
                                        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
                                            <Plus className="text-gray-300 rotate-45" size={32} />
                                        </div>
                                        <p className="text-gray-600 font-black text-lg">現在、申請はありません</p>
                                        <p className="text-gray-400 text-xs mt-2 font-bold leading-relaxed">
                                            乗客からの新しいドライブ申請が<br />届くまでお待ちください
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 下部固定ボタンエリア: ボタンデザイン・色は完全維持 */}
                    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl p-5 bg-gradient-to-t from-white via-white/95 to-transparent z-30">
                        <button
                            type="button"
                            className="w-full py-4 bg-[#00B049] hover:bg-[#009940] text-white rounded-2xl font-black shadow-xl shadow-emerald-100/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                            onClick={handleCreateClick}
                        >
                            <Plus size={22} strokeWidth={3} /> ドライブを作成
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}