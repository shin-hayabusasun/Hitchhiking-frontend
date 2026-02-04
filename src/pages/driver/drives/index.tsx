// % Start(小松暉)
// マイドライブ画面: 運転者として登録したドライブ予定の一覧を表示・管理する

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DriverHeader } from '@/components/driver/DriverHeader';
import { MyDriveCard } from '@/components/driver/MyDriveCard';
import { Plus } from 'lucide-react';
import { getApiUrl } from '@/config/api';

interface Passenger {
    userId: number;
    name: string;
    passengerCount: number;
}

interface Drive {
    id: number;
    departure: string;
    destination: string;
    departureTime: string;
    fee: number;
    capacity: number;
    currentPassengers: number;
    status: string;
    approvedPassengers: Passenger[];
}

export default function DriverDrivesPage() {
    const router = useRouter();
    const currentPath = router.pathname;

    const tabs = [
        { name: 'マイドライブ', path: '/driver/drives' },
        { name: '申請確認', path: '/driver/requests' },
        { name: '近くの募集', path: '/driver/nearby' },
        { name: '募集検索', path: '/driver/search' },
    ];

    const [drives, setDrives] = useState<Drive[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchDrives() {
            try {
                const response = await fetch(getApiUrl('/api/driver/drives'), {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();

                // キャンセル済みのドライブを除外してステートに保存
                const filteredDrives = (data.drives || []).filter(
                    (drive: Drive) => drive.status !== 'cancelled'
                );
                
                setDrives(filteredDrives);
            } catch (err) {
                setError('ドライブ情報の取得に失敗しました');
            } finally {
                setLoading(false);
            }
        }

        fetchDrives();
    }, []);

    const handleCreateClick = () => {
        router.push('/driver/drives/create');
    };

    async function handleDelete(id: number) {
        if (!confirm('本当に削除しますか？')) return;

        try {
            await fetch(`/api/drives/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            setDrives(drives.filter((drive) => drive.id !== id));
            alert('削除しました');
        } catch (err) {
            alert('削除に失敗しました');
        }
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
            <div className="w-full flex flex-col">
                
                {/* ヘッダー：白背景は横いっぱい、中身は max-w-2xl 中央寄せ */}
                <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                    <div className="max-w-2xl mx-auto w-full px-4 py-1">
                        <DriverHeader title="マイドライブ" backPath="/"/>
                    </div>
                </header>

                {/* メインエリア：中央寄せ */}
                <main className="w-full max-w-2xl mx-auto px-5 pt-6 pb-32 flex-1 min-h-screen relative">
                    
                    {/* タブメニュー */}
                    <div className="w-full grid grid-cols-4 gap-1 bg-gray-200/50 p-1 rounded-2xl mb-8">
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

                    {loading && (
                        <div className="w-full flex justify-center items-center py-10">
                            <div className="animate-spin h-8 w-8 border-4 border-[#00B049] rounded-full border-t-transparent"></div>
                        </div>
                    )}

                    {error && (
                        <div className="w-full bg-red-50 border border-red-100 p-4 rounded-2xl mb-6">
                            <p className="text-red-500 text-center text-sm font-bold">{error}</p>
                        </div>
                    )}

                    {!loading && !error && drives.length === 0 && (
                        <div className="w-full bg-white rounded-[2rem] py-20 px-6 text-center border border-gray-100 shadow-sm">
                            <p className="text-gray-600 font-black text-base">ドライブがありません</p>
                            <p className="text-gray-400 text-xs mt-2 font-bold leading-relaxed">
                                新しいドライブを作成しましょう
                            </p>
                        </div>
                    )}

                    {!loading && !error && drives.length > 0 && (
                        <div className="w-full space-y-4">
                            {drives.map((drive) => (
                                <MyDriveCard
                                    key={drive.id}
                                    id={drive.id}
                                    departure={drive.departure}
                                    destination={drive.destination}
                                    departureTime={drive.departureTime}
                                    fee={drive.fee}
                                    capacity={drive.capacity}
                                    currentPassengers={drive.currentPassengers}
                                    status={drive.status}
                                    approvedPassengers={drive.approvedPassengers}
                                    onDelete={() => handleDelete(drive.id)}
                                />
                            ))}
                        </div>
                    )}

                    {/* 下部固定ボタン：max-w-2xl 内で中央配置 */}
                    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl p-5 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/95 to-transparent z-30">
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