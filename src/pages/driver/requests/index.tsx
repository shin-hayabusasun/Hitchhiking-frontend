// % Start(小松暉)
// 申請確認画面: 同乗者からのリクエストを一覧表示し、承認/拒否を行う

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { applicationApi } from '@/lib/api';
import { DriverHeader } from '@/components/driver/DriverHeader';
import { Plus, ArrowLeft } from 'lucide-react';

interface Request {
	id: string;
	driveId: string;
	passengerId: string;
	passengerName: string;
	message?: string;
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
				const response = await applicationApi.getRequests('pending');
				setRequests(response.requests || []);
			} catch (err) {
				setError('申請情報の取得に失敗しました');
			} finally {
				setLoading(false);
			}
		}

		fetchRequests();
	}, []);

	async function handleApprove(id: string) {
		if (!confirm('この申請を承認しますか？')) {
			return;
		}

		try {
			await applicationApi.approveApplication(id);
			setRequests(requests.filter((req) => req.id !== id));
			alert('承認しました');
		} catch (err) {
			alert('承認に失敗しました');
		}
	}

	async function handleReject(id: string) {
		if (!confirm('この申請を拒否しますか？')) {
			return;
		}

		try {
			await applicationApi.rejectApplication(id);
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
						<div className="loading-container">
							<div className="loading-spinner"></div>
						</div>
					)}

					{error && <div className="error-message">{error}</div>}

					{!loading && !error && requests.length === 0 && (
						<div className="empty-state">
							<p>現在、申請はありません</p>
						</div>
					)}

					{!loading && !error && requests.length > 0 && (
						<div className="requests-list">
							{requests.map((request) => {
								return (
									<div key={request.id} className="request-card">
										<div className="request-header">
											<h3>{request.passengerName}</h3>
											<span className="request-date">
												{new Date(
													request.createdAt
												).toLocaleDateString('ja-JP')}
											</span>
										</div>
										{request.message && (
											<div className="request-message">
												<p>{request.message}</p>
											</div>
										)}
										<div className="request-actions">
											<button
												type="button"
												className="btn btn-danger"
												onClick={() => {
													handleReject(request.id);
												}}
											>
												拒否
											</button>
											<button
												type="button"
												className="btn btn-primary"
												onClick={() => {
													handleApprove(request.id);
												}}
											>
												承認
											</button>
										</div>
									</div>
								);
							})}
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

