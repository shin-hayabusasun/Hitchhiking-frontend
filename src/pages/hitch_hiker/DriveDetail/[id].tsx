import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, MessageCircle, Phone, MapPin, Calendar, Users, DollarSign, ShieldCheck, Navigation } from 'lucide-react';

// APIのレスポンス構造
interface DriveDetail {
    id: string;
    driverName: string;
    driverProfile: {
        rating: number;
        reviewCount: number;
        verificationStatus: string;
    };
    departure: string;    // ここに緯度経度が入る想定
    destination: string;  // ここに緯度経度が入る想定
    departureTime: string;
    capacity: number;
    fee: number;
    message: string;
    vehicleRules: {
        noSmoking: boolean;
        petAllowed: boolean;
        musicAllowed: boolean;
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
                const response = await fetch(`http://localhost:8000/api/drives/${id}`);
                const data = await response.json();
                if (response.ok) setDrive(data.drive);
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        fetchDriveDetail();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100 font-bold text-gray-400">Loading...</div>;
    if (!drive) return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-500">Data not found.</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-[390px] aspect-[9/19] bg-[#F8FAFC] shadow-2xl flex flex-col border-[8px] border-white relative overflow-hidden rounded-[3rem]">
                
                {/* ヘッダー */}
                <div className="bg-white p-4 flex items-center justify-between border-b pt-10 sticky top-0 z-10">
                    <button onClick={() => router.back()} className="p-1"><ArrowLeft className="w-6 h-6 text-gray-700" /></button>
                    <h1 className="font-black text-gray-800">ドライブ詳細</h1>
                    <div className="w-6"></div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28 scrollbar-hide">
                    
                    {/* マッチング度（固定） */}
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-[1px]">
                        <div className="bg-white/10 backdrop-blur-sm rounded-[15px] py-3 px-4 flex items-center justify-center text-white font-bold text-sm">
                            <span className="mr-2">❤️</span> マッチング度 95%
                        </div>
                    </div>

                    {/* ドライバー情報（APIデータ反映） */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                        <p className="text-[10px] text-gray-400 mb-3 font-bold uppercase tracking-wider">Driver</p>
                        <div className="flex items-start space-x-3 mb-4">
                            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 text-xl font-bold border-2 border-white shadow-sm">
                                {drive.driverName[0]}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <h2 className="text-lg font-black text-gray-800">{drive.driverName}</h2>
                                    <span className="bg-green-100 text-green-600 text-[9px] px-2 py-0.5 rounded-full flex items-center font-bold">
                                        <ShieldCheck className="w-3 h-3 mr-0.5" /> 認証済
                                    </span>
                                </div>
                                <div className="flex items-center text-yellow-500 text-xs mt-0.5">
                                    ★ <span className="font-bold ml-1 text-gray-700">{drive.driverProfile.rating}</span>
                                    <span className="text-gray-400 ml-1">({drive.driverProfile.reviewCount}回)</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="flex items-center justify-center space-x-1 py-2 rounded-xl border border-gray-100 text-gray-600 font-bold text-[11px]">
                                <MessageCircle className="w-4 h-4" /> <span>メッセージ</span>
                            </button>
                            <button className="flex items-center justify-center space-x-1 py-2 rounded-xl border border-gray-100 text-gray-600 font-bold text-[11px]">
                                <Phone className="w-4 h-4" /> <span>電話</span>
                            </button>
                        </div>
                    </div>

                    {/* ルート表示（★出発地・目的地をAPIからの緯度経度に修正） */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                        <p className="text-[10px] text-gray-400 mb-4 font-bold uppercase tracking-wider">Route</p>
                        <div className="relative pl-6 space-y-5">
                            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-50"></div>
                            <div className="relative">
                                <div className="absolute -left-[20px] top-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                                <p className="text-[9px] text-gray-400 font-bold">出発地 (緯度, 経度)</p>
                                <p className="text-sm font-mono font-bold text-gray-800">{drive.departure}</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[20px] top-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
                                <p className="text-[9px] text-gray-400 font-bold">目的地 (緯度, 経度)</p>
                                <p className="text-sm font-mono font-bold text-gray-800">{drive.destination}</p>
                            </div>
                        </div>
                        {/* ナビ起動エリア */}
                        <div className="mt-5 h-40 bg-blue-50 rounded-2xl relative flex items-center justify-center border border-blue-50">
                            <div className="text-center">
                                <Navigation className="w-6 h-6 text-blue-300 mx-auto mb-1" />
                                <span className="text-[10px] text-blue-300 font-bold uppercase tracking-tighter">Navigation View</span>
                            </div>
                            <button className="absolute bottom-2 right-2 bg-white px-3 py-1.5 rounded-lg shadow-sm text-[10px] font-bold text-blue-500 flex items-center border border-blue-50">
                                <Navigation className="w-3 h-3 mr-1" /> ナビ起動
                            </button>
                        </div>
                    </div>

                    {/* 詳細情報（固定） */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Details</p>
                        <div className="flex items-center justify-between text-sm py-1 border-b border-gray-50">
                            <div className="flex items-center space-x-2 text-gray-400"><Calendar className="w-4 h-4" /><span>日時</span></div>
                            <div className="text-right font-bold text-gray-800">2025-11-05 <span className="text-gray-400 font-medium ml-1 text-xs">09:00</span></div>
                        </div>
                        <div className="flex items-center justify-between text-sm py-1 border-b border-gray-50">
                            <div className="flex items-center space-x-2 text-gray-400"><Users className="w-4 h-4" /><span>同乗可能人数</span></div>
                            <p className="font-bold text-gray-800">2名</p>
                        </div>
                        <div className="flex items-center justify-between text-sm py-1">
                            <div className="flex items-center space-x-2 text-gray-400"><DollarSign className="w-4 h-4" /><span>料金</span></div>
                            <p className="font-bold text-green-600">¥800 /人</p>
                        </div>
                    </div>

                    {/* ルール・メッセージ（APIデータ反映） */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                        <p className="text-[10px] text-gray-400 mb-3 font-bold uppercase tracking-wider">Rules</p>
                        <div className="flex flex-wrap gap-1.5">
                            <span className="bg-gray-100 text-gray-500 text-[9px] px-2.5 py-1 rounded-md font-black">
                                {drive.vehicleRules.noSmoking ? '禁煙' : '喫煙可'}
                            </span>
                            <span className="bg-gray-100 text-gray-500 text-[9px] px-2.5 py-1 rounded-md font-black">
                                {drive.vehicleRules.petAllowed ? 'ペットOK' : 'ペット不可'}
                            </span>
                            {drive.vehicleRules.musicAllowed && (
                                <span className="bg-gray-100 text-gray-500 text-[9px] px-2.5 py-1 rounded-md font-black">音楽OK</span>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                        <p className="text-[10px] text-gray-400 mb-2 font-bold uppercase tracking-wider">Message</p>
                        <p className="text-[11px] text-gray-700 leading-relaxed font-bold">{drive.message}</p>
                    </div>
                </div>

                {/* フッター */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t px-6 py-5 flex items-center justify-between z-20">
                    <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">Price / Person</p>
                        <p className="text-lg font-black text-green-600">¥800</p>
                    </div>
                    <button 
                        onClick={() => setApplying(true)}
                        className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg"
                    >
                        {applying ? 'Applying...' : '申請する'}
                    </button>
                </div>
            </div>
        </div>
    );
}