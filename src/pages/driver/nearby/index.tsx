import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DriverHeader } from '@/components/driver/DriverHeader';
import { getApiUrl } from '@/config/api';
import { RecruitmentCard } from '@/components/driver/RecruitmentCard';
import { Plus, ArrowLeft } from 'lucide-react';

interface PassengerRequest {
    id: number;
    passengerName: string;
    departure: string;
    destination: string;
    date: string;
    time: string;
    budget: number;
    distance: number;
    rating?: number;
    reviewCount?: number;
    matchingScore?: number;
    startsIn?: number;
}

export function DriverNearbyPage() {
    const router = useRouter();
    const currentPath = router.pathname; 

    const tabs = [
        { name: 'マイドライブ', path: '/driver/drives' },
        { name: '申請確認', path: '/driver/requests' },
        { name: '近くの募集', path: '/driver/nearby' },
        { name: '募集検索', path: '/driver/search' },
    ];

    const [requests, setRequests] = useState<PassengerRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [location, setLocation] = useState<{ lat: number; lng: number; } | null>(null);

    // 位置情報取得
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (err) => {
                    console.error(err);
                    setError('位置情報の取得に失敗しました');
                    setLoading(false);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 20000,
                    maximumAge: 0
                }
            );
        } else {
            setError('このブラウザは位置情報をサポートしていません');
            setLoading(false);
        }
    }, []);

    // APIコール
    useEffect(() => {
        if (location) {
            fetchNearbyRequests();
        }
    }, [location]);

    async function fetchNearbyRequests() {
        if (!location) return;

        try {
            const response = await fetch(
                getApiUrl(`/api/driver/nearby?lat=${location.lat}&lng=${location.lng}&radius=10`),
                {
                    method: 'GET',
                    credentials: 'include',
                }
            );
            const data = await response.json();
            if (response.ok && data.requests) {
                setRequests(data.requests);
            } else {
                setError('募集情報の取得に失敗しました');
            }
        } catch (err) {
            setError('サーバー通信エラー');
        } finally {
            setLoading(false);
        }
    }

    function handleCreateClick() {
        router.push('/driver/drives/create');
    }

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-b from-sky-200 to-white flex flex-col items-center">
                <div className="w-full max-w-2xl min-h-screen bg-white shadow-2xl flex flex-col border-x border-gray-100">
                    <div className="w-full bg-white/95 backdrop-blur-md shadow-sm p-4 flex items-center gap-3 border-b border-slate-100">
                        <button onClick={() => router.push('/driver/drives')} className="text-slate-600 p-1 hover:bg-slate-50 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        {/* テキストカラーも調整が必要な場合はここも変更可能ですが、指示に基づきロゴ的な色は維持しています */}
                        <h1 className="text-[#00B049] font-black text-lg">近くの募集</h1>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                        {/* スピナーの色を #00B049 に変更 */}
                        <div className="animate-spin h-10 w-10 border-4 border-[#00B049] border-t-transparent rounded-full"></div>
                        <p className="text-slate-400 font-bold text-sm animate-pulse">近くの募集を探しています...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        /* 背景を w-full で全幅に広げ、中央寄せを適用 */
        <div className="w-full min-h-screen bg-gradient-to-b from-sky-200 to-white flex flex-col items-center">
            
            {/* コンテンツを max-w-2xl に制限 */}
            <div className="w-full max-w-2xl min-h-screen bg-white shadow-2xl flex flex-col relative overflow-y-auto border-x border-gray-100">
                
                {/* ヘッダー */}
                <div className="w-full sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100">
                    <DriverHeader title="近くの募集" backPath="/"/>
                </div>

                <main className="w-full flex-1 p-5 pb-32">
                    {/* タブメニュー */}
                    <div className="w-full grid grid-cols-4 gap-1 bg-slate-200/50 p-1 rounded-2xl mb-8 backdrop-blur-sm border border-white/50">
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

                    {error && (
                        <div className="w-full bg-red-50 border border-red-100 p-4 rounded-2xl mb-6">
                            <p className="text-red-500 text-center text-sm font-bold">{error}</p>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="w-full space-y-5">
                            {requests.length > 0 ? (
                                requests.map((request) => (
                                    <RecruitmentCard
                                        key={request.id}
                                        id={request.id.toString()}
                                        passengerName={request.passengerName}
                                        rating={request.rating}
                                        reviewCount={request.reviewCount}
                                        departure={request.departure}
                                        destination={request.destination}
                                        date={request.date}
                                        budget={request.budget}
                                        distance={request.distance}
                                        matchingScore={request.matchingScore}
                                        startsIn={request.startsIn}
                                        onClick={() => router.push(`/driver/search/${request.id}`)}
                                    />
                                ))
                            ) : (
                                <div className="w-full bg-white/60 backdrop-blur-sm rounded-3xl py-20 px-6 text-center border border-white/80 shadow-sm">
                                    <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Plus className="text-slate-300 rotate-45" size={32} />
                                    </div>
                                    <p className="text-slate-600 font-black text-base">条件に合う募集はありません</p>
                                    <p className="text-slate-400 text-xs mt-2 font-bold leading-relaxed">
                                        10km以内・2時間以内の<br />新しい募集をお待ちください
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </main>
                
                {/* フローティングボタンエリア：色を #00B049 に更新 */}
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

export default DriverNearbyPage;