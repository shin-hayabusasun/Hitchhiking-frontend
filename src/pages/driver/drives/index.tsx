// % Start(小松暉)
// マイドライブ画面: 運転者として登録したドライブ予定の一覧を表示・管理する

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DriverHeader } from '@/components/driver/DriverHeader';
import { MyDriveCard } from '@/components/driver/MyDriveCard';
import { Plus } from 'lucide-react';

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

export function DriverDrivesPage() {
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
                const response = await fetch('http://54.165.126.189:8000/api/driver/drives', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();

                // ★修正: キャンセル済みのドライブを除外してステートに保存
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

    function handleCreateClick() {
        router.push('/driver/drives/create');
    }

    async function handleDelete(id: number) {
        if (!confirm('本当に削除しますか？')) {
            return;
        }

        try {
            await fetch(`/api/drives/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            // 削除後も画面から即座に消す
            setDrives(drives.filter((drive) => drive.id !== id));
            alert('削除しました');
        } catch (err) {
            alert('削除に失敗しました');
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">
                <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
                    <DriverHeader title="マイドライブ" backPath="/"/>
                </div>

                <main className="flex-1 p-4 pb-10">
                    <div className="grid grid-cols-4 gap-1 bg-gray-200/50 p-1 rounded-xl mb-6 backdrop-blur-sm">
                        {tabs.map((tab) => {
                            const isActive = currentPath === tab.path;
                            return (
                                <button
                                    key={tab.path}
                                    type="button"
                                    className={`py-2 text-[10px] font-bold rounded-lg transition-all duration-200 ${isActive
                                        ? 'bg-white text-black shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    onClick={() => router.push(tab.path)}
                                >
                                    {tab.name}
                                </button>
                            );
                        })}
                    </div>

                    {loading && (
                        <div className="flex justify-center items-center py-10">
                            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                        </div>
                    )}

                    {error && <div className="text-red-500 text-center font-bold">{error}</div>}

                    {!loading && !error && drives.length === 0 && (
                        <div className="text-center py-20 text-gray-500">
                            <p className="font-bold">ドライブがありません</p>
                            <p className="text-sm">新しいドライブを作成しましょう</p>
                        </div>
                    )}

                    {!loading && !error && drives.length > 0 && (
                        <div className="space-y-4">
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
                    <div className="h-20" />
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

export default DriverDrivesPage;