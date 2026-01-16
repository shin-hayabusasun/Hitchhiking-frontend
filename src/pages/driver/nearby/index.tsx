// % Start(DriverNearbyPage)
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DriverHeader } from '@/components/driver/DriverHeader';
import { RecruitmentCard } from '@/components/driver/RecruitmentCard';
import { Plus, ArrowLeft } from 'lucide-react';

interface PassengerRequest {
    id: number; // ★修正: string -> number
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
    startsIn?: number; // ★追加: 何分後か
}

export function DriverNearbyPage() {
    const router = useRouter();
    const currentPath = router.pathname; 

    // タブ定義
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
            // ★修正: APIエンドポイントを変更
            const response = await fetch(
                `http://localhost:8000/api/driver/nearby?lat=${location.lat}&lng=${location.lng}&radius=10`,
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
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">
                    <div className="bg-white shadow-sm p-4 flex items-center gap-3 border-b border-gray-100">
                        <button onClick={() => router.push('/driver/drives')} className="text-gray-600 p-1">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-green-600 font-bold text-lg">近くの募集</h1>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                        <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">
                <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
                    <DriverHeader title="近くの募集" backPath="/"/>
                </div>

                <main className="flex-1 p-4 pb-10">
                    <div className="grid grid-cols-4 gap-1 bg-gray-200/50 p-1 rounded-xl mb-6 backdrop-blur-sm">
                        {tabs.map((tab) => {
                            const isActive = currentPath === tab.path;
                            return (
                                <button
                                    key={tab.path}
                                    type="button"
                                    className={`py-2 text-[10px] font-bold rounded-lg transition-all duration-200 ${isActive ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => router.push(tab.path)}
                                >
                                    {tab.name}
                                </button>
                            );
                        })}
                    </div>

                    {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}

                    {!loading && !error && (
                        <div className="space-y-4">
                            {requests.length > 0 ? (
                                requests.map((request) => (
                                    <RecruitmentCard
                                        key={request.id}
                                        id={request.id.toString()} // Card側がstringなら変換
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
                                <div className="text-center py-20 text-gray-500 text-sm font-bold">
                                    <p>条件に合う募集はありません</p>
                                    <p className="text-xs mt-2 font-normal">（10km以内・2時間以内）</p>
                                </div>
                            )}
                        </div>
                    )}
                </main>
                
                <div className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/90 to-transparent z-30">
                    <button
                        type="button"
                        className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold shadow-lg shadow-green-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        onClick={handleCreateClick}
                    >
                        <Plus size={20} /> ドライブを作成
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DriverNearbyPage;
// % End