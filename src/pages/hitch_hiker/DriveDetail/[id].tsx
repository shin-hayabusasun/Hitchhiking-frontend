import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, MessageCircle, Calendar, Users, Info, Car, DollarSign, ShieldCheck, Navigation } from 'lucide-react';
import { getApiUrl } from '@/config/api';
import dynamic from 'next/dynamic';
import { SearchFilters } from '../../_app';
import { MarkerData } from '@/components/Map';

// Mapコンポーネントを動的インポート（SSR対策）
const Map = dynamic(() => import('@/components/Map'), { ssr: false });

// 住所から緯度経度を取得する関数（OpenStreetMap Nominatim API使用）
async function geocodeAddress(address: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=jp&limit=1`,
            {
                headers: {
                    'User-Agent': 'HitchhikingApp/1.0' // Nominatimの利用規約により必須
                }
            }
        );
        const data = await response.json();
        if (data && data.length > 0) {
            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon)
            };
        }
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

interface DriveDetailPageProps {
    filter?: SearchFilters;
}

export default function DriveDetailPage({ filter }: DriveDetailPageProps) {
    const router = useRouter();
    const { id } = router.query;
    const [drive, setDrive] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [markers, setMarkers] = useState<MarkerData[]>([]);

    useEffect(() => {
        if (!id) return;
        const fetchDriveDetail = async () => {
            try {
                const response = await fetch(getApiUrl(`/api/drives/${id}`));
                const data = await response.json();
                console.log('📍 バックエンドレスポンス:', data); // デバッグ用
                if (response.ok) {
                    setDrive(data.drive);
                    console.log('🚗 ドライブ情報:', data.drive); // デバッグ用
                    
                    // 地図マーカーの作成
                    const newMarkers: MarkerData[] = [];
                    
                    // ドライバーの出発地・目的地の緯度経度（バックエンドから直接取得）
                    const driveData = data.drive;
                    
                    // ドライバー出発地（複数のフィールド名パターンに対応）
                    const driverDepartureLat = driveData.departureLatitude || driveData.departure_latitude || driveData.departureLat;
                    const driverDepartureLng = driveData.departureLongitude || driveData.departure_longitude || driveData.departureLng;
                    
                    if (driverDepartureLat && driverDepartureLng) {
                        newMarkers.push({
                            latitude: driverDepartureLat,
                            longitude: driverDepartureLng,
                            label: `ドライバー出発地: ${driveData.departure || '出発地'}`,
                            type: 'driver-departure'
                        });
                        console.log('✅ ドライバー出発地マーカー追加:', driverDepartureLat, driverDepartureLng);
                    } else {
                        console.warn('⚠️ ドライバー出発地の緯度経度がありません');
                    }
                    
                    // ドライバー目的地（複数のフィールド名パターンに対応）
                    const driverDestinationLat = driveData.destinationLatitude || driveData.destination_latitude || driveData.destinationLat;
                    const driverDestinationLng = driveData.destinationLongitude || driveData.destination_longitude || driveData.destinationLng;
                    
                    if (driverDestinationLat && driverDestinationLng) {
                        newMarkers.push({
                            latitude: driverDestinationLat,
                            longitude: driverDestinationLng,
                            label: `ドライバー目的地: ${driveData.destination || '目的地'}`,
                            type: 'driver-destination'
                        });
                        console.log('✅ ドライバー目的地マーカー追加:', driverDestinationLat, driverDestinationLng);
                    } else {
                        console.warn('⚠️ ドライバー目的地の緯度経度がありません');
                    }
                    
                    // 自分（同乗者）の出発地・目的地の緯度経度（ジオコーディングAPIで取得）
                    if (filter?.departure) {
                        console.log('🔍 同乗者の出発地をジオコーディング中:', filter.departure);
                        const myDepartureCoords = await geocodeAddress(filter.departure);
                        if (myDepartureCoords) {
                            newMarkers.push({
                                ...myDepartureCoords,
                                label: `あなたの出発地: ${filter.departure}`,
                                type: 'my-departure'
                            });
                            console.log('✅ 同乗者出発地マーカー追加:', myDepartureCoords);
                        }
                    }
                    
                    if (filter?.destination) {
                        console.log('🔍 同乗者の目的地をジオコーディング中:', filter.destination);
                        const myDestinationCoords = await geocodeAddress(filter.destination);
                        if (myDestinationCoords) {
                            newMarkers.push({
                                ...myDestinationCoords,
                                label: `あなたの目的地: ${filter.destination}`,
                                type: 'my-destination'
                            });
                            console.log('✅ 同乗者目的地マーカー追加:', myDestinationCoords);
                        }
                    }
                    
                    console.log('📍 全マーカー数:', newMarkers.length, newMarkers);
                    setMarkers(newMarkers);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDriveDetail();
    }, [id, filter]);

    const handleApply = async () => {
        if (!id) return;
        setApplying(true);
        try {
            const response = await fetch(getApiUrl(`/api/actions/apply`), {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recruitment_id: Number(id),
                    user_id: 1, 
                }),
            });
            if (response.ok) {
                alert("申請が完了しました！");
                router.push('/');
            } else {
                const errorData = await response.json();
                alert(errorData.detail || "申請に失敗しました");
            }
        } catch (err) {
            console.error(err);
            alert("通信エラーが発生しました");
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100 font-bold text-gray-400">Loading...</div>;
    if (!drive) return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-500">Data not found.</div>;

    return (
        <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-[390px] aspect-[9/19] bg-[#F3F4F6] shadow-2xl flex flex-col border-[8px] border-white relative overflow-hidden rounded-[3rem]">
                
                <div className="bg-white p-4 flex items-center border-b pt-10 sticky top-0 z-50 shadow-sm">
                    <button onClick={() => router.back()} className="mr-3 p-1">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-base font-bold text-gray-800">ドライブ詳細</h1>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32 scrollbar-hide">
                    
                    <div className="bg-gradient-to-r from-[#F43F5E] to-[#A855F7] rounded-2xl p-3 flex items-center justify-center shadow-sm">
                        <div className="text-white font-bold text-xs flex items-center">
                            <span className="mr-2">❤️</span> マッチング度 95%
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Driver</p>
                        <div className="flex items-start space-x-3">
                            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 text-xl font-bold border border-blue-100 shadow-sm">
                                {drive.driverName?.[0] || 'D'}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <h2 className="text-base font-bold text-gray-800">{drive.driverName || 'ドライバー'}</h2>
                                    {drive.isVerified && (
                                        <span className="bg-green-50 text-green-600 text-[9px] px-2 py-0.5 rounded-full flex items-center font-bold border border-green-100">
                                            <ShieldCheck className="w-3 h-3 mr-0.5" /> 認証済
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center text-xs mt-0.5">
                                    <span className="text-yellow-400 mr-1">★</span>
                                    <span className="font-bold text-gray-700">
                                        {drive.driverProfile?.rating || drive.rating || '5.0'}
                                    </span>
                                    <span className="text-gray-400 ml-1">
                                        ({drive.driverProfile?.reviewCount || drive.reviewCount || 0}回)
                                    </span>
                                </div>
                                
                                {/* ドライバーの自己紹介（バックエンドから取得） */}
                                {(drive.driverProfile?.bio || drive.message || drive.driverMessage) && (
                                    <div className="mt-3 bg-blue-50 rounded-xl p-3 border border-blue-100">
                                        <p className="text-[11px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {drive.driverProfile?.bio || drive.message || drive.driverMessage}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button className="w-full py-2 rounded-xl border border-gray-100 text-[11px] font-bold text-gray-600 flex items-center justify-center space-x-1 hover:bg-gray-50 transition-colors">
                            <MessageCircle className="w-4 h-4" /> <span>メッセージ</span>
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-4">Route</p>
                        <div className="relative pl-6 space-y-6">
                            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-50"></div>
                            <div className="relative">
                                <div className="absolute -left-[20px] top-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                                <p className="text-[9px] text-gray-400 font-bold">出発地</p>
                                <p className="text-sm font-bold text-gray-800">{drive.departure}</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[20px] top-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
                                <p className="text-[9px] text-gray-400 font-bold">目的地</p>
                                <p className="text-sm font-bold text-gray-800">{drive.destination}</p>
                            </div>
                        </div>
                        <div className="mt-5 h-64 bg-gray-50 rounded-2xl overflow-hidden relative border border-gray-100 shadow-inner z-0">
                            {markers.length > 0 ? (
                                <div className="h-full w-full relative z-0">
                                    <Map markers={markers} />
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <Navigation className="w-6 h-6 text-gray-300 mx-auto mb-1" />
                                        <span className="text-[9px] text-gray-400 font-bold">地図を読み込み中...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* 凡例 */}
                        {markers.length > 0 && (
                            <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                                    <span className="text-gray-600">ドライバー出発</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-sm"></div>
                                    <span className="text-gray-600">ドライバー目的地</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
                                    <span className="text-gray-600">あなたの出発</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-purple-500 border-2 border-white shadow-sm"></div>
                                    <span className="text-gray-600">あなたの目的地</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Details</p>
                        <div className="flex items-center justify-between pb-3 border-b border-gray-50 text-xs">
                            <div className="flex items-center space-x-3 text-gray-500 font-bold uppercase tracking-tighter"><Calendar className="w-4 h-4 text-gray-300" /><span>Date</span></div>
                            <span className="font-bold text-gray-800">{drive.departureTime}</span>
                        </div>
                        <div className="flex items-center justify-between pb-3 border-b border-gray-50 text-xs">
                            <div className="flex items-center space-x-3 text-gray-500 font-bold uppercase tracking-tighter"><Users className="w-4 h-4 text-gray-300" /><span>Capacity</span></div>
                            <span className="font-bold text-gray-800">{drive.capacity}名</span>
                        </div>
                        <div className="flex items-center justify-between pb-3 border-b border-gray-50 text-xs">
                            <div className="flex items-center space-x-3 text-gray-500 font-bold uppercase tracking-tighter"><Info className="w-4 h-4 text-gray-300" /><span>Status</span></div>
                            <span className="bg-blue-50 text-blue-600 text-[10px] px-3 py-0.5 rounded-full font-bold border border-blue-100">{drive.status}</span>
                        </div>
                        <div className="flex items-center justify-between pb-3 border-b border-gray-50 text-xs">
                            <div className="flex items-center space-x-3 text-gray-500 font-bold uppercase tracking-tighter"><DollarSign className="w-4 h-4 text-gray-300" /><span>Fee</span></div>
                            <span className="font-bold text-green-600 font-mono">¥{drive.fee} /人</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Car className="w-4 h-4 text-gray-300" />
                            <div className="flex-1">
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Vehicle</p>
                                <p className="text-xs font-bold text-gray-800">{drive.vehicle.model}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Vehicle Details</p>
                        <div className="space-y-3">
                            {[
                                ["車種", drive.vehicle.model],
                                ["色", drive.vehicle.color],
                                ["年式", drive.vehicle.year],
                                ["車両番号", drive.vehicle.number]
                            ].map(([label, value]) => (
                                <div key={label} className="flex justify-between text-xs border-b border-gray-50 pb-2">
                                    <span className="text-gray-400">{label}</span>
                                    <span className="font-bold text-gray-800">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 車両ルール・条件 */}
                    {drive.vehicleRules && (
                        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">車両ルール</p>
                            <div className="grid grid-cols-2 gap-3">
                                {drive.vehicleRules.noSmoking !== undefined && (
                                    <div className="flex items-center gap-2 text-xs">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${drive.vehicleRules.noSmoking ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {drive.vehicleRules.noSmoking ? '✓' : '✗'}
                                        </div>
                                        <span className="text-gray-700">禁煙</span>
                                    </div>
                                )}
                                {drive.vehicleRules.petAllowed !== undefined && (
                                    <div className="flex items-center gap-2 text-xs">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${drive.vehicleRules.petAllowed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {drive.vehicleRules.petAllowed ? '✓' : '✗'}
                                        </div>
                                        <span className="text-gray-700">ペット可</span>
                                    </div>
                                )}
                                {drive.vehicleRules.musicAllowed !== undefined && (
                                    <div className="flex items-center gap-2 text-xs">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${drive.vehicleRules.musicAllowed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {drive.vehicleRules.musicAllowed ? '✓' : '✗'}
                                        </div>
                                        <span className="text-gray-700">音楽</span>
                                    </div>
                                )}
                                {drive.vehicleRules.conversation && (
                                    <div className="col-span-2 flex items-center gap-2 text-xs">
                                        <div className="w-5 h-5 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                                            💬
                                        </div>
                                        <span className="text-gray-700">{drive.vehicleRules.conversation}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-white border-t px-6 py-5 flex items-center justify-between z-50 shadow-2xl">
                    <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">Total Price</p>
                        <p className="text-lg font-black text-green-600">¥{drive.fee}</p>
                    </div>
                    <button 
                        onClick={handleApply}
                        disabled={applying}
                        className="bg-blue-600 text-white px-10 py-3 rounded-xl font-black shadow-lg shadow-blue-100 active:scale-95 transition-transform disabled:bg-gray-400"
                    >
                        {applying ? '送信中...' : '申請する'}
                    </button>
                </div>
            </div>
        </div>
    );
}