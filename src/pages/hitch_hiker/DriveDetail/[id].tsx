import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, MessageCircle, Calendar, Users, Info, Car, DollarSign, ShieldCheck, Navigation } from 'lucide-react';
import { getApiUrl } from '@/config/api';
import dynamic from 'next/dynamic';
import { SearchFilters } from '../../_app';
import { MarkerData } from '@/components/Map';

// Mapコンポーネントを動的インポート（SSR対策）
const Map = dynamic(() => import('@/components/Map'), { ssr: false });

// 住所から緯度経度を取得する関数
async function geocodeAddress(address: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=jp&limit=1`,
            {
                headers: {
                    'User-Agent': 'HitchhikingApp/1.0'
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
                if (response.ok) {
                    setDrive(data.drive);
                    const newMarkers: MarkerData[] = [];
                    const driveData = data.drive;
                    
                    const driverDepartureLat = driveData.departureLatitude || driveData.departure_latitude || driveData.departureLat;
                    const driverDepartureLng = driveData.departureLongitude || driveData.departure_longitude || driveData.departureLng;
                    if (driverDepartureLat && driverDepartureLng) {
                        newMarkers.push({
                            latitude: driverDepartureLat,
                            longitude: driverDepartureLng,
                            label: `ドライバー出発地: ${driveData.departure || '出発地'}`,
                            type: 'driver-departure'
                        });
                    }
                    
                    const driverDestinationLat = driveData.destinationLatitude || driveData.destination_latitude || driveData.destinationLat;
                    const driverDestinationLng = driveData.destinationLongitude || driveData.destination_longitude || driveData.destinationLng;
                    if (driverDestinationLat && driverDestinationLng) {
                        newMarkers.push({
                            latitude: driverDestinationLat,
                            longitude: driverDestinationLng,
                            label: `ドライバー目的地: ${driveData.destination || '目的地'}`,
                            type: 'driver-destination'
                        });
                    }
                    
                    if (filter?.departure) {
                        const myDepartureCoords = await geocodeAddress(filter.departure);
                        if (myDepartureCoords) {
                            newMarkers.push({
                                ...myDepartureCoords,
                                label: `あなたの出発地: ${filter.departure}`,
                                type: 'my-departure'
                            });
                        }
                    }
                    
                    if (filter?.destination) {
                        const myDestinationCoords = await geocodeAddress(filter.destination);
                        if (myDestinationCoords) {
                            newMarkers.push({
                                ...myDestinationCoords,
                                label: `あなたの目的地: ${filter.destination}`,
                                type: 'my-destination'
                            });
                        }
                    }
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

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white font-bold text-gray-400">Loading...</div>;
    if (!drive) return <div className="min-h-screen flex items-center justify-center bg-white text-gray-500">Data not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="w-full min-h-screen flex flex-col relative overflow-hidden">
                
                <header className="bg-white px-4 py-3 pt-8 flex items-center border-b sticky top-0 z-50 shadow-sm">
                    <button onClick={() => router.back()} className="mr-3 p-1.5 border border-gray-100 rounded-xl active:bg-gray-50">
                        <ArrowLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <h1 className="text-sm font-bold text-gray-800">ドライブ詳細</h1>
                </header>

                <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-32 scrollbar-hide">
                    
                    <div className="bg-gradient-to-r from-[#F43F5E] to-[#A855F7] rounded-full py-2 px-4 flex items-center justify-center shadow-sm">
                        <div className="text-white font-bold text-[10px] flex items-center">
                            <span className="mr-1.5">❤️</span> マッチング度 95%
                        </div>
                    </div>

                    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm space-y-4 border border-gray-100">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Driver</p>
                        <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 text-lg font-bold border border-blue-100">
                                {drive.driverName?.[0] || 'D'}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <h2 className="text-sm font-bold text-gray-800">{drive.driverName || 'ドライバー'}</h2>
                                    {drive.isVerified && (
                                        <span className="bg-green-50 text-green-600 text-[8px] px-2 py-0.5 rounded-full flex items-center font-bold border border-green-100">
                                            <ShieldCheck className="w-2.5 h-2.5 mr-0.5" /> 認証済
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center text-[10px] mt-0.5">
                                    <span className="text-yellow-400 mr-1">★</span>
                                    <span className="font-bold text-gray-700">
                                        {drive.driverProfile?.rating || drive.rating || '5.0'}
                                    </span>
                                    <span className="text-gray-400 ml-1">
                                        ({drive.driverProfile?.reviewCount || drive.reviewCount || 0}回)
                                    </span>
                                </div>
                                
                                {(drive.driverProfile?.bio || drive.message || drive.driverMessage) && (
                                    <div className="mt-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                                        <p className="text-[10px] text-gray-600 leading-relaxed whitespace-pre-wrap">
                                            {drive.driverProfile?.bio || drive.message || drive.driverMessage}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button className="w-full py-2 rounded-xl border border-gray-100 text-[10px] font-bold text-gray-600 flex items-center justify-center space-x-1 hover:bg-gray-50 transition-colors">
                            <MessageCircle className="w-3.5 h-3.5" /> <span>メッセージを送る</span>
                        </button>
                    </div>

                    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-4">Route</p>
                        <div className="relative pl-6 space-y-5">
                            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-50"></div>
                            <div className="relative">
                                <div className="absolute -left-[20px] top-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                                <p className="text-[8px] text-gray-400 font-bold uppercase">Departure</p>
                                <p className="text-sm font-bold text-gray-800">{drive.departure}</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[20px] top-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
                                <p className="text-[8px] text-gray-400 font-bold uppercase">Destination</p>
                                <p className="text-sm font-bold text-gray-800">{drive.destination}</p>
                            </div>
                        </div>
                        <div className="mt-5 h-56 bg-gray-50 rounded-2xl overflow-hidden relative border border-gray-100 z-0">
                            {markers.length > 0 ? (
                                <div className="h-full w-full relative z-0">
                                    <Map markers={markers} />
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <Navigation className="w-5 h-5 text-gray-300 mx-auto mb-1" />
                                        <span className="text-[8px] text-gray-400 font-bold">地図を読み込み中...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {markers.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 gap-y-2 gap-x-4 text-[9px] font-bold">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 border border-white"></div>
                                    <span className="text-gray-500">ドライバー出発</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 border border-white"></div>
                                    <span className="text-gray-500">ドライバー目的</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white"></div>
                                    <span className="text-gray-500">あなたの出発</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-purple-500 border border-white"></div>
                                    <span className="text-gray-500">あなたの目的地</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm space-y-4 border border-gray-100">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Details</p>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between pb-3 border-b border-gray-50 text-[11px]">
                                <div className="flex items-center space-x-3 text-gray-400 font-bold uppercase tracking-tighter"><Calendar className="w-4 h-4" /><span>Date</span></div>
                                <span className="font-bold text-gray-800">{drive.departureTime}</span>
                            </div>
                            <div className="flex items-center justify-between pb-3 border-b border-gray-50 text-[11px]">
                                <div className="flex items-center space-x-3 text-gray-400 font-bold uppercase tracking-tighter"><Users className="w-4 h-4" /><span>Capacity</span></div>
                                <span className="font-bold text-gray-800">{drive.capacity}名</span>
                            </div>
                            <div className="flex items-center justify-between pb-3 border-b border-gray-50 text-[11px]">
                                <div className="flex items-center space-x-3 text-gray-400 font-bold uppercase tracking-tighter"><Info className="w-4 h-4" /><span>Status</span></div>
                                <span className="bg-blue-50 text-blue-600 text-[9px] px-2.5 py-0.5 rounded-full font-bold border border-blue-100">{drive.status}</span>
                            </div>
                            <div className="flex items-center justify-between pb-3 border-b border-gray-50 text-[11px]">
                                <div className="flex items-center space-x-3 text-gray-400 font-bold uppercase tracking-tighter"><DollarSign className="w-4 h-4" /><span>Fee</span></div>
                                <span className="font-bold text-green-600">¥{drive.fee} /人</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm space-y-4 border border-gray-100">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Vehicle Details</p>
                        <div className="space-y-2.5">
                            {[
                                ["車種", drive.vehicle.model],
                                ["色", drive.vehicle.color],
                                ["年式", drive.vehicle.year],
                                ["車両番号", drive.vehicle.number]
                            ].map(([label, value]) => (
                                <div key={label} className="flex justify-between text-[11px] border-b border-gray-50 pb-2 last:border-0">
                                    <span className="text-gray-400 font-bold">{label}</span>
                                    <span className="font-bold text-gray-800">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {drive.vehicleRules && (
                        <div className="bg-white rounded-[1.5rem] p-5 shadow-sm space-y-3 border border-gray-100">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">車両ルール</p>
                            <div className="grid grid-cols-2 gap-3">
                                {drive.vehicleRules.noSmoking !== undefined && (
                                    <div className="flex items-center gap-2 text-[10px] font-bold">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${drive.vehicleRules.noSmoking ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {drive.vehicleRules.noSmoking ? '✓' : '✗'}
                                        </div>
                                        <span className="text-gray-700">禁煙</span>
                                    </div>
                                )}
                                {drive.vehicleRules.petAllowed !== undefined && (
                                    <div className="flex items-center gap-2 text-[10px] font-bold">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${drive.vehicleRules.petAllowed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {drive.vehicleRules.petAllowed ? '✓' : '✗'}
                                        </div>
                                        <span className="text-gray-700">ペット可</span>
                                    </div>
                                )}
                                {drive.vehicleRules.musicAllowed !== undefined && (
                                    <div className="flex items-center gap-2 text-[10px] font-bold">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${drive.vehicleRules.musicAllowed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {drive.vehicleRules.musicAllowed ? '✓' : '✗'}
                                        </div>
                                        <span className="text-gray-700">音楽OK</span>
                                    </div>
                                )}
                                {drive.vehicleRules.conversation && (
                                    <div className="col-span-2 flex items-center gap-2 text-[10px] font-bold">
                                        <div className="w-5 h-5 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                                            💬
                                        </div>
                                        <span className="text-gray-700">{drive.vehicleRules.conversation}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>

                <footer className="absolute bottom-0 left-0 right-0 bg-white border-t px-6 py-4 flex items-center justify-between z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                    <div>
                        <p className="text-[8px] text-gray-400 font-bold uppercase">Total Price</p>
                        <p className="text-base font-black text-green-600">¥{drive.fee}</p>
                    </div>
                    <button 
                        onClick={handleApply}
                        disabled={applying}
                        className="bg-blue-600 text-white px-8 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-blue-100 active:scale-95 transition-all disabled:bg-gray-300"
                    >
                        {applying ? '送信中...' : '申請する'}
                    </button>
                </footer>
            </div>
        </div>
    );
}