// src/pages/driver/drives/[id].tsx (または DriverDriveDetailPage)

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getApiUrl } from '@/config/api';
import {
    ArrowLeft, MapPin, Calendar, Clock, Users,
    DollarSign, Car, Check, Music, Dog, Utensils, Edit
} from 'lucide-react';

// 型定義
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
        foodAllowed?: boolean;
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

    const statusLabels: Record<string, { label: string, color: string }> = {
        recruiting: { label: '募集中', color: 'bg-blue-100 text-blue-700' },
        matched: { label: '確定済み', color: 'bg-green-100 text-green-700' },
        completed: { label: '完了', color: 'bg-gray-100 text-gray-700' },
        cancelled: { label: '中止', color: 'bg-red-100 text-red-700' },
    };
    const currentStatus = statusLabels[drive.status] || { label: drive.status, color: 'bg-gray-100 text-gray-600' };

    return (
        /* ★ 背景を w-full で画面一杯に広げ、中央寄せを適用 */
        <div className="w-full min-h-screen bg-gradient-to-b from-sky-200 to-white flex flex-col items-center">
            
            {/* ★ コンテンツを max-w-2xl に変更し、枠組みを維持 */}
            <div className="w-full max-w-2xl min-h-screen bg-white shadow-2xl flex flex-col relative overflow-y-auto border-x border-gray-100">
                
                {/* ヘッダー（元のデザインを維持） */}
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 p-4 border-b border-gray-100 flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <button onClick={handleBackClick} className="text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-gray-800 font-bold text-lg">ドライブ詳細</h1>
                    </div>
                    <button onClick={handleEditClick} className="text-green-600 p-1 hover:bg-green-50 rounded-full transition-colors">
                        <Edit className="w-5 h-5" />
                    </button>
                </header>

                <main className="w-full flex-1 p-4 space-y-4 pb-10">
                    
                    {/* ルート情報カード（元のレイアウトを維持） */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4 border border-gray-50 w-full">
                        <div className="flex justify-between items-center">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">ルート情報</p>
                            <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${currentStatus.color}`}>
                                {currentStatus.label}
                            </span>
                        </div>
                        <div className="space-y-4 relative pl-2">
                            <div className="absolute left-[9px] top-[8px] bottom-[28px] w-[2px] bg-gray-100" />
                            <div className="flex items-start gap-4 z-10 relative">
                                <div className="w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white shadow-sm flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-[10px] text-gray-400 mb-0.5">出発地</p>
                                    <p className="text-sm font-bold text-gray-800 leading-tight">{drive.departure}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 z-10 relative">
                                <div className="w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white shadow-sm flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-[10px] text-gray-400 mb-0.5">目的地</p>
                                    <p className="text-sm font-bold text-gray-800 leading-tight">{drive.destination}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 日時・料金・定員（元のグリッドを維持） */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 w-full">
                        <div className="grid grid-cols-2 gap-y-6">
                            <div>
                                <p className="text-[10px] text-gray-400 mb-1 flex items-center gap-1"><Calendar size={12}/> 出発日時</p>
                                <p className="text-sm font-bold text-gray-800">{formattedDate}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 mb-1 flex items-center gap-1"><DollarSign size={12}/> 料金</p>
                                <p className="text-sm font-bold text-green-600">¥{drive.fee.toLocaleString()}<span className="text-[10px] text-gray-400 font-normal"> /人</span></p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 mb-1 flex items-center gap-1"><Users size={12}/> 定員</p>
                                <p className="text-sm font-bold text-gray-800">{drive.currentPassengers} / {drive.capacity}名</p>
                            </div>
                        </div>
                    </div>

                    {/* 車両ルール（Badgeのデザインを維持） */}
                    {drive.vehicleRules && (
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 space-y-3 w-full">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">車両ルール</p>
                            <div className="grid grid-cols-2 gap-3">
                                <RuleBadge icon={<Car size={14} />} label="禁煙" active={drive.vehicleRules.noSmoking} />
                                <RuleBadge icon={<Dog size={14} />} label="ペット可" active={drive.vehicleRules.petAllowed} />
                                <RuleBadge icon={<Music size={14} />} label="音楽OK" active={drive.vehicleRules.musicAllowed} />
                                <RuleBadge icon={<Utensils size={14} />} label="飲食OK" active={drive.vehicleRules.foodAllowed} />
                            </div>
                        </div>
                    )}

                    {/* メッセージ（元のスタイルを維持） */}
                    {drive.message && (
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 space-y-2 w-full">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">メッセージ</p>
                            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl">
                                {drive.message}
                            </p>
                        </div>
                    )}

                    {/* 同乗者リスト（Cardデザインを維持） */}
                    {drive.passengers && drive.passengers.length > 0 && (
                        <div className="space-y-3 w-full">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">申請・同乗者リスト</p>
                            {drive.passengers.map((passenger) => (
                                <div key={passenger.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-50 flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                                            {passenger.name.charAt(0)}
                                        </div>
                                        <span className="text-sm font-bold text-gray-700">{passenger.name}</span>
                                    </div>
                                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                                        passenger.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        passenger.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {passenger.status === 'approved' ? '承認済み' : 
                                         passenger.status === 'rejected' ? '却下' : '承認待ち'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
                
                <div className="h-10" />
            </div>
        </div>
    );
}

// ルール表示用サブコンポーネント (そのまま維持)
function RuleBadge({ icon, label, active }: { icon: any, label: string, active?: boolean }) {
    return (
        <div className={`flex items-center gap-2 p-2 rounded-xl border ${active ? 'bg-green-50 border-green-100 text-green-700' : 'bg-gray-50 border-transparent text-gray-400'}`}>
            {icon}
            <span className="text-xs font-bold">{label}</span>
            {!active && <span className="text-[10px] ml-auto opacity-50">NG</span>}
        </div>
    );
}

export default DriverDriveDetailPage;