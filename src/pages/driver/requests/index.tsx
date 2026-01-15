// % Start(小松暉)
// 申請確認画面: 同乗者からのリクエストを一覧表示し、承認/拒否を行う

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { applicationApi } from '@/lib/api';
import { DriverHeader } from '@/components/driver/DriverHeader';
import { RequestCard } from '@/components/driver/RequestCard';
import { Plus } from 'lucide-react';

interface Request {
	id: number;
    passengerName: string;
    matchingRate: number;
    rating: number;
    reviewCount: number;
    departure: string;
    destination: string;
    departureTime: string;
    createdAt: string;
}

export function DriverRequestsPage() {
	const router = useRouter();

	const currentPath = router.pathname; // 現在のURLを取得

	// どのページがどのパスに対応するか定義
	const tabs = [
		{ name: 'マイドライブ', path: '/driver/drives' },
		{ name: '申請確認', path: '/driver/requests' },
		{ name: '近くの募集', path: '/driver/nearby' },
		{ name: '募集検索', path: '/driver/search' },
	];


	const [requests, setRequests] = useState<Request[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');



	// 申請一覧取得
	useEffect(() => {
        async function fetchRequests() {
            try {
                const response = await fetch('http://localhost:8000/api/driver/requests', {
                    method: 'GET',
                    credentials: 'include', // セッション情報を含める
                });
                const data = await response.json();
                
                // APIが { requests: [...] } の形式で返すことを想定
                setRequests(data.requests || []);
            } catch (err) {
                setError('申請情報の取得に失敗しました');
            } finally {
                setLoading(false);
            }
        }

        fetchRequests();
    }, []);

	// async function handleApprove(id: string) {
	// 	if (!confirm('この申請を承認しますか？')) {
	// 		return;
	// 	}

	// 	try {
	// 		await applicationApi.approveApplication(id);
	// 		setRequests(requests.filter((req) => req.id !== id));
	// 		alert('承認しました');
	// 	} catch (err) {
	// 		alert('承認に失敗しました');
	// 	}
	// }

	// async function handleReject(id: string) {
	// 	if (!confirm('この申請を拒否しますか？')) {
	// 		return;
	// 	}

	// 	try {
	// 		await applicationApi.rejectApplication(id);
	// 		setRequests(requests.filter((req) => req.id !== id));
	// 		alert('拒否しました');
	// 	} catch (err) {
	// 		alert('拒否に失敗しました');
	// 	}
	// }

	async function handleApprove(id: number) {
        if (!confirm('この申請を承認しますか？')) return;
        try {
            await fetch('http://localhost:8000/api/applications/${id}/approve', {
                method: 'POST',
                credentials: 'include',
            });
            setRequests(requests.filter((req) => req.id !== id));
            alert('承認しました');
        } catch (err) {
            alert('承認に失敗しました');
        }
    }

    // 拒否処理
    async function handleReject(id: number) {
        if (!confirm('この申請を拒否しますか？')) return;
        try {
            await fetch('http://localhost:8000/api/applications/${id}/reject', {
                method: 'POST',
                credentials: 'include',
            });
            setRequests(requests.filter((req) => req.id !== id));
            alert('拒否しました');
        } catch (err) {
            alert('拒否に失敗しました');
        }
    }

	function handleCreateClick() {
		router.push('/driver/drives/create');
	}

	// function handleTabClick(tab: string) {
	// 	if (tab === 'drives') {
	// 		router.push('/driver/drives');
	// 	} else if (tab === 'nearby') {
	// 		router.push('/driver/nearby');
	// 	} else if (tab === 'search') {
	// 		router.push('/driver/search');
	// 	}
	// }

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			<div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">
				<div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
					<DriverHeader title="申請確認" />
				</div>

				<main className="flex-1 p-4 pb-10">

					{/* タブメニュー（スマホ用にフォントサイズ調整） */}
					<div className="grid grid-cols-4 gap-1 bg-gray-200/50 p-1 rounded-xl mb-6 backdrop-blur-sm">
						{tabs.map((tab) => {
							const isActive = currentPath === tab.path;
							return (
								<button
									key={tab.id}
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
                        <div className="flex justify-center py-10">
                            <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
                        </div>
                    )}

                    {error && <div className="text-red-500 text-center text-sm font-bold p-4 bg-white rounded-xl mb-4">{error}</div>}

                    {/* ★ map関数によるカードの展開表示部分 */}
                    {!loading && !error && (
                        <div className="space-y-4">
                            {requests.length > 0 ? (
                                requests.map((request) => (
                                    <RequestCard
                                        key={request.id}
                                        id={request.id}
                                        passengerName={request.passengerName}
                                        matchingRate={request.matchingRate}
                                        rating={request.rating}
                                        reviewCount={request.reviewCount}
                                        departure={request.departure}
                                        destination={request.destination}
                                        departureTime={request.departureTime}
                                        createdAt={request.createdAt}
                                        onApprove={handleApprove}
                                        onReject={handleReject}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-20 text-gray-500 text-sm font-bold bg-white/50 rounded-3xl backdrop-blur-sm">
                                    <p>現在、申請はありません</p>
                                </div>
                            )}
                        </div>
                    )}
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

export default DriverRequestsPage;

// % End

