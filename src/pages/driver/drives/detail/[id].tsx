// % Start(DriverDriveDetailPage)
// ドライブ詳細画面

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DriverHeader } from '@/components/driver/DriverHeader';
import { getApiUrl } from '@/config/api';
import {
    ArrowLeft, MapPin, Calendar, Clock, Users,
    DollarSign, Car, Check, Music, Dog, Utensils, Edit
} from 'lucide-react';

// ★修正: IDを number に、Status定義を文字列に統一
interface Passenger {
    id: number;
    name: string;
    status: string;
}

interface DriveDetail {
    id: number;
    driverId: number;
    driverName: string;
    departure: string;
    destination: string;
    departureTime: string;
    capacity: number;
    currentPassengers: number;
    fee: number;
    message?: string;
    vehicleRules?: {
        noSmoking?: boolean;
        petAllowed?: boolean;
        musicAllowed?: boolean;
        foodAllowed?: boolean; // ★修正: 型定義を修正
    };
    status: string;
    passengers?: Passenger[];
}

export function DriverDriveDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const [drive, setDrive] = useState<DriveDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        async function fetchDriveDetail() {
            try {
                const response = await fetch(getApiUrl(`/api/driver/drives/${id}`), {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });
                const data = await response.json();

                if (response.ok && data.drive) {
                    setDrive(data.drive);
                } else {
                    setError('ドライブ情報の取得に失敗しました');
                }
            } catch (err) {
                setError('サーバーエラーが発生しました');
            } finally {
                setLoading(false);
            }
        }

        fetchDriveDetail();
    }, [id]);

    function handleBackClick() {
        router.push('/driver/drives');
    }

    function handleEditClick() {
        router.push(`/driver/drives/edit/${id}`);
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (error || !drive) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
                <p className="text-red-500 font-bold mb-4">{error || 'ドライブ情報が見つかりません'}</p>
                <button onClick={handleBackClick} className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-bold">
                    戻る
                </button>
            </div>
        );
    }

    const formattedDate = new Date(drive.departureTime).toLocaleString('ja-JP', {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
    });

    // ステータス表示用マップ
    const statusLabels: Record<string, { label: string, color: string }> = {
        recruiting: { label: '募集中', color: 'bg-blue-100 text-blue-700' },
        matched: { label: '確定済み', color: 'bg-green-100 text-green-700' },
        completed: { label: '完了', color: 'bg-gray-100 text-gray-700' },
        cancelled: { label: '中止', color: 'bg-red-100 text-red-700' },
    };
    const currentStatus = statusLabels[drive.status] || { label: drive.status, color: 'bg-gray-100 text-gray-600' };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
            
            {/* ヘッダー: 背景は全幅、中身は max-w-2xl 中央寄せ */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 w-full shadow-sm">
                <div className="max-w-2xl mx-auto w-full px-5 py-4 flex items-center justify-between relative">
                    {/* 左側: 戻る */}
                    <button 
                        onClick={handleBackClick} 
                        className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-500 z-10"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    
                    {/* 中央: タイトル */}
                    <h1 className="absolute left-1/2 -translate-x-1/2 text-[17px] font-black text-gray-700 whitespace-nowrap">
                        ドライブ詳細
                    </h1>
                    
                    {/* 右側: 編集 */}
                    <button 
                        onClick={handleEditClick} 
                        className="p-2 hover:bg-emerald-50 rounded-full transition-colors text-emerald-600 z-10"
                    >
                        <Edit size={24} />
                    </button>
                </div>
            </header>

            {/* メインコンテンツ */}
            <main className="max-w-2xl mx-auto w-full p-5 space-y-5 pb-20">
                
                {/* ルート情報カード */}
                <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 space-y-6">
                    <div className="flex justify-between items-center">
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Route Info</p>
                        <span className={`text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-tighter ${currentStatus.color}`}>
                            {currentStatus.label}
                        </span>
                    </div>
                    
                    <div className="space-y-6 relative pl-2">
                        {/* 経路の線 */}
                        <div className="absolute left-[9px] top-[12px] bottom-[32px] w-[2px] bg-gray-50 border-l border-dashed border-gray-200" />
                        
                        <div className="flex items-start gap-5 z-10 relative">
                            <div className="w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm flex-shrink-0 mt-1" />
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-300 uppercase">Departure</p>
                                <p className="text-base font-black text-gray-700 leading-tight">{drive.departure}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-5 z-10 relative">
                            <div className="w-4 h-4 rounded-full bg-rose-500 border-4 border-white shadow-sm flex-shrink-0 mt-1" />
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-300 uppercase">Destination</p>
                                <p className="text-base font-black text-gray-700 leading-tight">{drive.destination}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 日時・料金・定員 グリッド */}
                <div className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-100">
                    <div className="grid grid-cols-2 gap-y-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-300 uppercase flex items-center gap-1.5">
                                <Calendar size={14} className="text-gray-300" /> Departure Time
                            </p>
                            <p className="text-[15px] font-black text-gray-700">{formattedDate}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-300 uppercase flex items-center gap-1.5">
                                <DollarSign size={14} className="text-gray-300" /> Fee
                            </p>
                            <p className="text-[15px] font-black text-emerald-600">
                                ¥{drive.fee.toLocaleString()}
                                <span className="text-[10px] text-gray-300 font-bold ml-1">/ PER PERSON</span>
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-300 uppercase flex items-center gap-1.5">
                                <Users size={14} className="text-gray-300" /> Capacity
                            </p>
                            <div className="flex items-end gap-2">
                                <p className="text-xl font-black text-gray-700">{drive.currentPassengers}</p>
                                <p className="text-[13px] font-black text-gray-300 pb-0.5">/ {drive.capacity} SEATS</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 車両ルール */}
                {drive.vehicleRules && (
                    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 space-y-4">
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Vehicle Rules</p>
                        <div className="grid grid-cols-2 gap-3">
                            <RuleBadge icon={<Car size={16} />} label="禁煙" active={drive.vehicleRules.noSmoking} />
                            <RuleBadge icon={<Dog size={16} />} label="ペット可" active={drive.vehicleRules.petAllowed} />
                            <RuleBadge icon={<Music size={16} />} label="音楽OK" active={drive.vehicleRules.musicAllowed} />
                            <RuleBadge icon={<Utensils size={16} />} label="飲食OK" active={drive.vehicleRules.foodAllowed} />
                        </div>
                    </div>
                )}

                {/* メッセージ */}
                {drive.message && (
                    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 space-y-3">
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Driver Message</p>
                        <div className="bg-gray-50/50 rounded-3xl p-5 border border-gray-50">
                            <p className="text-[14px] font-bold text-gray-600 leading-relaxed italic">
                                "{drive.message}"
                            </p>
                        </div>
                    </div>
                )}

                {/* 同乗者リスト */}
                {drive.passengers && drive.passengers.length > 0 && (
                    <div className="space-y-4 pt-2">
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Passenger List</p>
                        <div className="grid gap-3">
                            {drive.passengers.map((passenger) => (
                                <div key={passenger.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group transition-all hover:border-emerald-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 font-black text-lg border border-gray-100 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                                            {passenger.name.charAt(0)}
                                        </div>
                                        <span className="text-[15px] font-black text-gray-700">{passenger.name}</span>
                                    </div>
                                    <span className={`text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-tight ${
                                        passenger.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                                        passenger.status === 'rejected' ? 'bg-rose-50 text-rose-600' :
                                        'bg-amber-50 text-amber-600'
                                    }`}>
                                        {passenger.status === 'approved' ? '承認済み' : 
                                         passenger.status === 'rejected' ? '却下' : '承認待ち'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

// ルール表示用サブコンポーネント
function RuleBadge({ icon, label, active }: { icon: any, label: string, active?: boolean }) {
    return (
        <div className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
            active 
                ? 'bg-emerald-50/50 border-emerald-100 text-emerald-600' 
                : 'bg-gray-50 border-transparent text-gray-300'
        }`}>
            <div className={`${active ? 'text-emerald-500' : 'text-gray-300'}`}>
                {icon}
            </div>
            <span className="text-[13px] font-black">{label}</span>
            {!active && <span className="text-[10px] ml-auto font-black opacity-40">NG</span>}
        </div>
    );
}

export default DriverDriveDetailPage;
// % End