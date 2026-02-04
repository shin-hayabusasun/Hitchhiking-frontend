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
            <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
                <div className="w-full min-h-screen flex flex-col relative">
                    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                        <div className="max-w-2xl mx-auto w-full px-4 py-1">
                            <DriverHeader title="近くの募集" backPath="/driver/drives"/>
                        </div>
                    </header>
                    <main className="flex-1 bg-white border-x border-gray-100 max-w-2xl mx-auto w-full flex flex-col items-center justify-center space-y-3">
                        <div className="animate-spin h-10 w-10 border-4 border-[#00B049] border-t-transparent rounded-full"></div>
                        <p className="text-gray-400 font-bold text-sm animate-pulse">近くの募集を探しています...</p>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
            <div className="w-full min-h-screen flex flex-col relative">
                
                {/* Header: 背景白・全幅 / 中身 max-w-2xl */}
                <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                    <div className="max-w-2xl mx-auto w-full px-4 py-1">
                        <DriverHeader title="近くの募集" backPath="/"/>
                    </div>
                </header>

                {/* Main Content: max-w-2xl / 白ベタ塗り / 両端ボーダー */}
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

                        {error && (
                            <div className="w-full bg-red-50 border border-red-100 p-4 rounded-2xl mb-6">
                                <p className="text-red-500 text-center text-sm font-bold">{error}</p>
                            </div>
                        )}

                        {!loading && !error && (
                            <div className="space-y-4 pt-2">
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
                                    <div className="w-full bg-gray-50 rounded-[2rem] py-20 px-6 text-center border border-gray-100">
                                        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                            <Plus className="text-gray-300 rotate-45" size={32} />
                                        </div>
                                        <p className="text-gray-600 font-black text-base">条件に合う募集はありません</p>
                                        <p className="text-gray-400 text-xs mt-2 font-bold leading-relaxed">
                                            10km以内・2時間以内の<br />新しい募集をお待ちください
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 下部固定ボタンエリア：デザイン維持 */}
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

export default DriverNearbyPage;