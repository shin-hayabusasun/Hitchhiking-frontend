import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, MessageCircle, Calendar, Users, Info, Car, DollarSign, ShieldCheck, Navigation } from 'lucide-react';

export default function DriveDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const [drive, setDrive] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchDriveDetail = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/drives/${id}`);
                const data = await response.json();
                if (response.ok) setDrive(data.drive);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDriveDetail();
    }, [id]);

    // ★追加：申請ボタンを押した時の処理
    const handleApply = async () => {
        if (!id) return;
        setApplying(true);
        try {
            const response = await fetch(`http://localhost:8000/api/drives/apply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recruitment_id: Number(id),
                    user_id: 1, // 本来はログイン中のユーザーID
                }),
            });
            if (response.ok) {
                alert("申請が完了しました！");
                router.push('/home'); // ホーム画面へ遷移
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
            {/* スマホ外枠 */}
            <div className="w-full max-w-[390px] aspect-[9/19] bg-[#F3F4F6] shadow-2xl flex flex-col border-[8px] border-white relative overflow-hidden rounded-[3rem]">
                
                {/* ヘッダー */}
                <div className="bg-white p-4 flex items-center border-b pt-10 sticky top-0 z-30">
                    <button onClick={() => router.back()} className="mr-3 p-1">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-base font-bold text-gray-800">ドライブ詳細</h1>
                </div>

                {/* スクロールエリア */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32 scrollbar-hide">
                    
                    {/* マッチング度バナー */}
                    <div className="bg-gradient-to-r from-[#F43F5E] to-[#A855F7] rounded-2xl p-3 flex items-center justify-center shadow-sm">
                        <div className="text-white font-bold text-xs flex items-center">
                            <span className="mr-2">❤️</span> マッチング度 95%
                        </div>
                    </div>

                    {/* ドライバーカード */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Driver</p>
                        <div className="flex items-start space-x-3">
                            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 text-xl font-bold border border-blue-100 shadow-sm">
                                {drive.driverName[0]}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <h2 className="text-base font-bold text-gray-800">{drive.driverName}</h2>
                                    <span className="bg-green-50 text-green-600 text-[9px] px-2 py-0.5 rounded-full flex items-center font-bold border border-green-100">
                                        <ShieldCheck className="w-3 h-3 mr-0.5" /> 認証済
                                    </span>
                                </div>
                                <div className="flex items-center text-xs mt-0.5">
                                    <span className="text-yellow-400 mr-1">★</span>
                                    <span className="font-bold text-gray-700">{drive.driverProfile.rating}</span>
                                    <span className="text-gray-400 ml-1">({drive.driverProfile.reviewCount}回)</span>
                                </div>
                                <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">{drive.driverProfile.bio}</p>
                            </div>
                        </div>
                        <button className="w-full py-2 rounded-xl border border-gray-100 text-[11px] font-bold text-gray-600 flex items-center justify-center space-x-1">
                            <MessageCircle className="w-4 h-4" /> <span>メッセージ</span>
                        </button>
                    </div>

                    {/* ルートカード */}
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
                        <div className="mt-5 h-40 bg-blue-50/50 rounded-2xl flex items-center justify-center relative border border-blue-50">
                            <div className="text-center">
                                <Navigation className="w-6 h-6 text-blue-200 mx-auto mb-1" />
                                <span className="text-[9px] text-blue-200 font-bold uppercase tracking-widest">Navigation View</span>
                            </div>
                        </div>
                    </div>

                    {/* 詳細情報 */}
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

                    {/* 車両詳細・ルール */}
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
                        <div className="flex flex-wrap gap-2 mt-4">
                            {drive.vehicleRules.noSmoking && <span className="bg-gray-100 text-gray-500 text-[9px] px-2.5 py-1 rounded-md font-bold">禁煙</span>}
                            {!drive.vehicleRules.petAllowed && <span className="bg-gray-100 text-gray-500 text-[9px] px-2.5 py-1 rounded-md font-bold">ペット不可</span>}
                            {drive.vehicleRules.musicAllowed && <span className="bg-gray-100 text-gray-500 text-[9px] px-2.5 py-1 rounded-md font-bold">音楽OK</span>}
                        </div>
                    </div>
                </div>

                {/* ★固定フッター */}
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t px-6 py-5 flex items-center justify-between z-40">
                    <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">Total Price</p>
                        <p className="text-lg font-black text-green-600">¥{drive.fee}</p>
                    </div>
                    {/* ★onClickを変更 */}
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