import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, MessageCircle, Phone, MapPin, Calendar, Users, DollarSign, ShieldCheck, Navigation, Loader2 } from 'lucide-react';

interface DriveDetail {
    id: number;
    driverName: string;
    driverProfile: {
        rating: number;
        reviewCount: number;
    };
    departure: string;
    destination: string;
    departureTime: string;
    capacity: number;
    fee: number;
    message: string;
    vehicleRules: {
        noSmoking: boolean;
        petAllowed: boolean;
        musicAllowed: boolean;
        foodAllowed: boolean;
    };
}

export default function DriveDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const [drive, setDrive] = useState<DriveDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchDriveDetail = async () => {
            try {
                const response = await fetch(`/api/drives/${id}`);
                const data = await response.json();
                if (response.ok) {
                    const d = data.drive;
                    setDrive({
                        id: d.id,
                        driverName: d.driverName,
                        driverProfile: { rating: 4.8, reviewCount: 24 }, // 本来はAPIから取得
                        departure: d.departure,
                        destination: d.destination,
                        departureTime: d.departureTime,
                        capacity: d.capacity,
                        fee: d.fee,
                        message: d.message || "安全運転で目的地までお送りします。",
                        vehicleRules: d.vehicleRules
                    });
                }
            } catch (err) { 
                console.error(err); 
            } finally { 
                setLoading(false); 
            }
        };
        fetchDriveDetail();
    }, [id]);

    // ★追加: 申請処理
    const handleApply = async () => {
        if (!drive) return;
        if (!confirm(`${drive.departure} から ${drive.destination} への相乗りを申請しますか？`)) return;

        setApplying(true);
        try {
            const response = await fetch(`/api/drives/${drive.id}/apply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (response.ok && data.ok) {
                alert("相乗り申請を送信しました！");
                router.push('/hitch_hiker_home'); // 完了後の遷移先
            } else {
                alert(`エラー: ${data.detail || "申請に失敗しました"}`);
            }
        } catch (err) {
            alert("通信エラーが発生しました。");
        } finally {
            setApplying(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-blue-500 font-bold gap-2">
            <Loader2 className="animate-spin" /> 読み込み中...
        </div>
    );
    
    if (!drive) return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-500">データが見つかりません</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-[390px] aspect-[9/19] bg-[#F8FAFC] shadow-2xl flex flex-col border-[8px] border-white relative overflow-hidden rounded-[3rem]">
                
                {/* ヘッダー */}
                <div className="bg-white p-4 flex items-center justify-between border-b pt-10 sticky top-0 z-10">
                    <button onClick={() => router.back()} className="p-1 hover:bg-gray-50 rounded-full transition"><ArrowLeft className="w-6 h-6 text-gray-700" /></button>
                    <h1 className="font-black text-gray-800 tracking-tighter">ドライブ詳細</h1>
                    <div className="w-6"></div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28 scrollbar-hide">
                    
                    {/* マッチング度 */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-[1px] shadow-lg shadow-blue-100">
                        <div className="bg-white/10 backdrop-blur-sm rounded-[15px] py-3 px-4 flex items-center justify-center text-white font-bold text-sm">
                            <span className="mr-2">✨</span> おすすめのマッチ
                        </div>
                    </div>

                    {/* ドライバー情報 */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                        <p className="text-[10px] text-gray-400 mb-3 font-bold uppercase tracking-widest text-center">Driver Info</p>
                        <div className="flex flex-col items-center mb-4">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 text-2xl font-black border-4 border-white shadow-md mb-2">
                                {drive.driverName[0]}
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center space-x-2">
                                    <h2 className="text-lg font-black text-gray-800">{drive.driverName}</h2>
                                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                                </div>
                                <div className="flex items-center justify-center text-yellow-500 text-xs mt-1">
                                    ★ <span className="font-bold ml-1 text-gray-700">{drive.driverProfile.rating}</span>
                                    <span className="text-gray-400 ml-1">({drive.driverProfile.reviewCount} reviews)</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="flex items-center justify-center space-x-1 py-2.5 rounded-xl bg-gray-50 text-gray-600 font-bold text-[11px] hover:bg-gray-100 transition">
                                <MessageCircle className="w-4 h-4" /> <span>チャット</span>
                            </button>
                            <button className="flex items-center justify-center space-x-1 py-2.5 rounded-xl bg-gray-50 text-gray-600 font-bold text-[11px] hover:bg-gray-100 transition">
                                <Phone className="w-4 h-4" /> <span>通話</span>
                            </button>
                        </div>
                    </div>

                    {/* ルート表示 */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                        <p className="text-[10px] text-gray-400 mb-4 font-bold uppercase tracking-widest text-center">Route</p>
                        <div className="relative pl-6 space-y-6">
                            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-dashed border-l-2 border-gray-100"></div>
                            <div className="relative">
                                <div className="absolute -left-[20px] top-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Departure</p>
                                <p className="text-sm font-black text-gray-800">{drive.departure}</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[20px] top-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Destination</p>
                                <p className="text-sm font-black text-gray-800">{drive.destination}</p>
                            </div>
                        </div>
                        
                        <div className="mt-5 h-24 bg-blue-50 rounded-2xl relative flex items-center justify-center overflow-hidden">
                            <Navigation className="absolute w-12 h-12 text-blue-100 rotate-12" />
                            <button className="relative bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm text-[11px] font-black text-blue-600 flex items-center border border-white hover:bg-white transition">
                                <Navigation className="w-3 h-3 mr-2" /> Googleマップで確認
                            </button>
                        </div>
                    </div>

                    {/* スケジュール詳細 */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4">
                        <div className="flex items-center justify-between text-sm py-1 border-b border-gray-50">
                            <div className="flex items-center space-x-2 text-gray-400 font-bold text-[11px] uppercase"><Calendar className="w-4 h-4" /><span>Date</span></div>
                            <div className="text-right font-black text-gray-800">{drive.departureTime.replace('T', ' ')}</div>
                        </div>
                        <div className="flex items-center justify-between text-sm py-1 border-b border-gray-50">
                            <div className="flex items-center space-x-2 text-gray-400 font-bold text-[11px] uppercase"><Users className="w-4 h-4" /><span>Seats</span></div>
                            <p className="font-black text-gray-800">{drive.capacity}名まで</p>
                        </div>
                        <div className="flex items-center justify-between text-sm py-1">
                            <div className="flex items-center space-x-2 text-gray-400 font-bold text-[11px] uppercase"><DollarSign className="w-4 h-4" /><span>Price</span></div>
                            <p className="font-black text-blue-600">¥{drive.fee} /人</p>
                        </div>
                    </div>

                    {/* 車内ルール */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                        <p className="text-[10px] text-gray-400 mb-3 font-bold uppercase tracking-widest text-center">Rules</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            <span className={`text-[10px] px-3 py-1.5 rounded-xl font-bold border ${drive.vehicleRules.noSmoking ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>禁煙</span>
                            <span className={`text-[10px] px-3 py-1.5 rounded-xl font-bold border ${drive.vehicleRules.petAllowed ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>ペット可</span>
                            <span className={`text-[10px] px-3 py-1.5 rounded-xl font-bold border ${drive.vehicleRules.musicAllowed ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>音楽OK</span>
                        </div>
                    </div>

                    {/* メッセージ */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                        <p className="text-[10px] text-gray-400 mb-2 font-bold uppercase tracking-widest text-center">Driver Message</p>
                        <p className="text-[11px] text-gray-700 leading-relaxed font-bold bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">"{drive.message}"</p>
                    </div>
                </div>

                {/* フッターアクション */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-6 flex items-center justify-between z-20">
                    <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider text-center">Total Price</p>
                        <p className="text-xl font-black text-blue-600">¥{drive.fee}</p>
                    </div>
                    <button 
                        onClick={handleApply}
                        disabled={applying}
                        className={`px-10 py-4 rounded-2xl font-black shadow-xl transition-all active:scale-95 ${
                            applying ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white shadow-blue-200'
                        }`}
                    >
                        {applying ? <Loader2 className="animate-spin w-5 h-5" /> : '相乗りを申請'}
                    </button>
                </div>
            </div>
        </div>
    );
}