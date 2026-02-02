import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DriverHeader } from '@/components/driver/DriverHeader';
import { getApiUrl } from '@/config/api';
import { 
    Calendar, Users, DollarSign, 
    Star, ShieldCheck, MessageCircle, Navigation, Heart, Check
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { MarkerData } from '@/components/Map';

// Mapコンポーネントを動的インポート（SSR対策）
const Map = dynamic(() => import('@/components/Map'), { ssr: false });

interface RequestDetail {
    request: {
        id: number;
        origin: string;
        destination: string;
        date: string;
        time: string;
        budget: number;
        passengerCount: number;
        message: string;
        status: string;
        originLatitude?: number;
        originLongitude?: number;
        origin_latitude?: number;
        origin_longitude?: number;
        originLat?: number;
        originLng?: number;
        destinationLatitude?: number;
        destinationLongitude?: number;
        destination_latitude?: number;
        destination_longitude?: number;
        destinationLat?: number;
        destinationLng?: number;
    };
    passenger: {
        id: number;
        name: string;
        age: number;
        gender: number;
        rating: number;
        reviewCount: number;
        profileImage: string;
        bio: string;
    };
    driver?: {
        departure: string;
        destination: string;
        departureLatitude?: number;
        departureLongitude?: number;
        departure_latitude?: number;
        departure_longitude?: number;
        departureLat?: number;
        departureLng?: number;
        destinationLatitude?: number;
        destinationLongitude?: number;
        destination_latitude?: number;
        destination_longitude?: number;
        destinationLat?: number;
        destinationLng?: number;
    };
    matchingScore: number;
}

export default function RequestDetailPage() {
    const router = useRouter();
    const { requestId } = router.query; 
    
    const [data, setData] = useState<RequestDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);
    const [markers, setMarkers] = useState<MarkerData[]>([]);

    useEffect(() => {
        if (!router.isReady) return;

        if (!requestId) {
            setError('IDが取得できませんでした');
            setLoading(false);
            return;
        }

        fetchRequestDetail();
    }, [router.isReady, requestId]);

    async function fetchRequestDetail() {
        try {
            const response = await fetch(getApiUrl(`/api/driver/search/${requestId}`), {
                method: 'GET',
                credentials: 'include',
            });
            const resData = await response.json();
            
            if (response.ok && resData.success) {
                setData(resData.data);
                
                const newMarkers: MarkerData[] = [];
                const requestData = resData.data.request;
                const driverData = resData.data.driver;
                
                const passengerOriginLat = requestData.originLatitude || requestData.origin_latitude || requestData.originLat;
                const passengerOriginLng = requestData.originLongitude || requestData.origin_longitude || requestData.originLng;
                
                if (passengerOriginLat && passengerOriginLng) {
                    newMarkers.push({
                        latitude: passengerOriginLat,
                        longitude: passengerOriginLng,
                        label: `同乗者出発地: ${requestData.origin || '出発地'}`,
                        type: 'my-departure'
                    });
                }
                
                const passengerDestLat = requestData.destinationLatitude || requestData.destination_latitude || requestData.destinationLat;
                const passengerDestLng = requestData.destinationLongitude || requestData.destination_longitude || requestData.destinationLng;
                
                if (passengerDestLat && passengerDestLng) {
                    newMarkers.push({
                        latitude: passengerDestLat,
                        longitude: passengerDestLng,
                        label: `同乗者目的地: ${requestData.destination || '目的地'}`,
                        type: 'my-destination'
                    });
                }
                
                if (driverData) {
                    const driverDepLat = driverData.departureLatitude || driverData.departure_latitude || driverData.departureLat;
                    const driverDepLng = driverData.departureLongitude || driverData.departure_longitude || driverData.departureLng;
                    
                    if (driverDepLat && driverDepLng) {
                        newMarkers.push({
                            latitude: driverDepLat,
                            longitude: driverDepLng,
                            label: `あなたの出発地: ${driverData.departure || '出発地'}`,
                            type: 'driver-departure'
                        });
                    }
                    
                    const driverDestLat = driverData.destinationLatitude || driverData.destination_latitude || driverData.destinationLat;
                    const driverDestLng = driverData.destinationLongitude || driverData.destination_longitude || driverData.destinationLng;
                    
                    if (driverDestLat && driverDestLng) {
                        newMarkers.push({
                            latitude: driverDestLat,
                            longitude: driverDestLng,
                            label: `あなたの目的地: ${driverData.destination || '目的地'}`,
                            type: 'driver-destination'
                        });
                    }
                }
                
                setMarkers(newMarkers);
            } else {
                setError('データの取得に失敗しました');
            }
        } catch (err) {
            console.error(err);
            setError('通信エラーが発生しました');
        } finally {
            setLoading(false);
        }
    }

    async function handleRespond() {
        if (!confirm('この募集に応答して、同乗を受け入れますか？\n（即座にマッチングが確定します）')) return;

        setProcessing(true);
        try {
            const response = await fetch(getApiUrl('/api/driver/respond'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ recruitment_id: Number(requestId) }),
            });
            
            const resData = await response.json();
            
            if (response.ok && resData.success) {
                alert('マッチングが成立しました！\n予定管理画面へ移動します。');
                router.push('/driver/drives');
            } else {
                alert(resData.detail || '処理に失敗しました');
            }
        } catch (err) {
            console.error(err);
            alert('処理中にエラーが発生しました');
        } finally {
            setProcessing(false);
        }
    }

    const formatDate = (dateStr: string, timeStr: string) => {
        try {
            const d = new Date(dateStr);
            const day = d.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short' });
            const time = timeStr.length > 5 ? timeStr.substring(0, 5) : timeStr;
            return `${day} ${time}`;
        } catch {
            return `${dateStr} ${timeStr}`;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="text-center w-full">
                    <p className="text-red-500 font-bold mb-4">{error || 'データが見つかりません'}</p>
                    <button onClick={() => router.back()} className="text-gray-500 underline text-sm bg-white px-4 py-2 rounded-lg shadow-sm">
                        戻る
                    </button>
                </div>
            </div>
        );
    }

    const { request, passenger, matchingScore } = data;

    return (
        /* ★ 背景を w-full で全幅に広げ、中央寄せを適用 */
        <div className="w-full min-h-screen bg-gradient-to-b from-sky-200 to-white flex flex-col items-center">
            
            {/* ★ コンテンツを max-w-2xl に制限。デザインを維持 */}
            <div className="w-full max-w-2xl min-h-screen bg-white shadow-2xl flex flex-col relative border-x border-gray-100">
                
                {/* ヘッダー */}
                <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm w-full">
                    <DriverHeader title="募集詳細" showMyPage={false} showNotification={false}/>
                </div>

                <main className="w-full flex-1 p-5 space-y-6 pb-32 overflow-y-auto">
                    
                    {/* マッチング度（デザイン維持） */}
                    {matchingScore !== undefined && (
                        <div className="w-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-5 text-white text-center shadow-lg shadow-green-100">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <Heart size={20} fill="white" className="animate-pulse" />
                                <span className="text-xl font-black">マッチング度 {matchingScore}%</span>
                            </div>
                            <p className="text-[10px] opacity-90 font-bold">あなたの条件・ルートと相性が良いです</p>
                        </div>
                    )}

                    {/* 同乗者情報 */}
                    <div className="w-full bg-white rounded-3xl p-6 shadow-sm space-y-5 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Passenger</p>
                            {passenger?.id && (
                                <span className="bg-green-100 text-green-700 text-[9px] px-2 py-0.5 rounded-full flex items-center font-bold">
                                    <ShieldCheck className="w-3 h-3 mr-0.5" /> 本人確認済
                                </span>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold border-2 border-white shadow-sm">
                                {passenger?.name?.[0] || 'P'}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-black text-gray-800">{passenger?.name || '同乗者'}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center text-yellow-400">
                                        <Star size={16} fill="currentColor" />
                                        <span className="ml-1 text-sm font-bold text-gray-700">
                                            {passenger?.rating?.toFixed(1) || '5.0'}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-400 font-bold">
                                        ({passenger?.reviewCount || 0}回の乗車)
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1.5 font-medium">
                                    {passenger?.age && passenger.age > 0 ? `${passenger.age}歳` : ''} 
                                    {passenger?.gender === 1 ? ' 男性' : passenger?.gender === 2 ? ' 女性' : ''}
                                </p>
                            </div>
                        </div>
                        
                        {request?.message && (
                            <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-600 leading-relaxed font-medium border border-gray-100">
                                <div className="flex items-center gap-1 mb-1.5 text-green-600 font-bold">
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span className="text-[10px] uppercase tracking-wide">Message</span>
                                </div>
                                {request.message}
                            </div>
                        )}
                    </div>

                    {/* ルート情報 */}
                    <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 mb-5 uppercase tracking-widest">Request Route</p>
                        <div className="relative pl-4 space-y-8">
                            <div className="absolute left-[22px] top-3 bottom-3 w-0.5 bg-gray-100 rounded-full"></div>
                            
                            <div className="relative flex items-start gap-4">
                                <div className="w-4 h-4 bg-green-500 rounded-full ring-4 ring-white shadow-sm mt-1 z-10 shrink-0"></div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold mb-0.5">出発地</p>
                                    <p className="text-base font-bold text-gray-800 leading-tight">{request?.origin || '未設定'}</p>
                                </div>
                            </div>
                            
                            <div className="relative flex items-start gap-4">
                                <div className="w-4 h-4 bg-red-500 rounded-full ring-4 ring-white shadow-sm mt-1 z-10 shrink-0"></div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold mb-0.5">目的地</p>
                                    <p className="text-base font-bold text-gray-800 leading-tight">{request?.destination || '未設定'}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* 地図表示（z-indexを考慮し、max-w-2xl内で正しく表示） */}
                        <div className="mt-6 h-80 bg-gray-50 rounded-2xl overflow-hidden relative border border-gray-100 shadow-inner z-0 w-full">
                            {markers.length > 0 ? (
                                <div className="h-full w-full relative z-0">
                                    <Map markers={markers} />
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <Navigation className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                        <span className="text-xs text-gray-400 font-bold">地図を読み込み中...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 条件詳細 */}
                    <div className="w-full bg-white rounded-3xl p-6 shadow-sm space-y-5 border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Details</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-50">
                                <div className="flex items-center gap-1.5 text-gray-400 mb-1.5">
                                    <Calendar size={14} />
                                    <span className="text-[10px] font-bold">日時</span>
                                </div>
                                <p className="text-sm font-black text-gray-800">{formatDate(request.date, request.time)}</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                                <div className="flex items-center gap-1.5 text-green-600 mb-1.5">
                                    <DollarSign size={14} />
                                    <span className="text-[10px] font-bold">希望予算</span>
                                </div>
                                <p className="text-base font-black text-green-700">¥{(request.budget || 0).toLocaleString()}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl md:col-span-2 flex items-center justify-between border border-gray-50">
                                <div className="flex items-center gap-1.5 text-gray-400">
                                    <Users size={14} />
                                    <span className="text-[10px] font-bold">希望人数</span>
                                </div>
                                <p className="text-sm font-black text-gray-800">{request.passengerCount}名</p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* 固定アクションボタン（stickyでmax-w-2xl内に配置） */}
                <div className="sticky bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/95 to-transparent z-50">
                    <button 
                        onClick={handleRespond}
                        disabled={processing}
                        className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98] ${
                            processing 
                            ? 'bg-gray-400 text-white cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-700 text-white shadow-green-200'
                        }`}
                    >
                        {processing ? (
                            '処理中...'
                        ) : (
                            <>
                                <Check size={20} strokeWidth={3} /> この同乗を受け入れる
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}