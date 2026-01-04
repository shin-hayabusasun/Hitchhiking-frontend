// % Start(AI Assistant)
// 近くの募集表示画面。現在地周辺の同乗者リクエストを表示。

import { useEffect, useState } from 'react';
import { DriverHeader } from '@/components/driver/DriverHeader';
import { useRouter } from 'next/router';
import { Plus, ArrowLeft} from 'lucide-react';

interface PassengerRequest {
	id: string;
	passengerName: string;
	departure: string;
	destination: string;
	date: string;
	time: string;
	budget: number;
	distance: number;
}

export function DriverNearbyPage() {
	const router = useRouter();
	const currentPath = router.pathname; // 現在のURLを取得

	// どのページがどのパスに対応するか定義
	const tabs = [
		{ name: 'マイドライブ', path: '/driver/drives' },
		{ name: '申請確認', path: '/driver/requests' },
		{ name: '近くの募集', path: '/driver/nearby' },
		{ name: '募集検索', path: '/driver/search' },
	];


	const [requests, setRequests] = useState<PassengerRequest[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [location, setLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);

	useEffect(() => {
		getLocation();
	}, []);

	useEffect(() => {
		if (location) {
			fetchNearbyRequests();
		}
	}, [location]);

	function getLocation() {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setLocation({
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					});
				},
				(error) => {
					setError('位置情報の取得に失敗しました');
					setLoading(false);
				}
			);
		} else {
			setError('このブラウザは位置情報をサポートしていません');
			setLoading(false);
		}
	}

	function handleCreateClick() {
		router.push('/driver/drives/create');
	}

	async function fetchNearbyRequests() {
		if (!location) return;

		try {
			const response = await fetch(
				`/api/passenger-requests/nearby?lat=${location.lat}&lng=${location.lng}&radius=10`,
				{
					method: 'GET',
					credentials: 'include',
				}
			);
			const data = await response.json();
			if (response.ok && data.requests) {
				setRequests(data.requests);
			}
		} catch (err) {
			setError('募集情報の取得に失敗しました');
		} finally {
			setLoading(false);
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

				<div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">

					{/* 読み込み中でもヘッダーだけは見せておく */}
					<div className="bg-white shadow-sm p-4 flex items-center gap-3 border-b border-gray-100">
						<button onClick={() => router.push('/driver/drives')} className="text-gray-600 p-1">
							<ArrowLeft className="w-5 h-5" />
						</button>
						<h1 className="text-green-600 font-bold text-lg">近くの募集</h1>
					</div>

					{/* フレームの中央にローディングを表示 */}
					<div className="flex-1 flex flex-col items-center justify-center space-y-3">
						<p className="text-sm font-bold text-gray-400">読み込み中</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			<div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">
				<div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
					<DriverHeader title="近くの募集" />
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
					{error && <p className="text-red-500 text-center mb-4">{error}</p>}

					{requests.length === 0 ? (
						<p className="text-center text-gray-600">
							近くに募集はありません
						</p>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{requests.map((request) => (
								<div
									key={request.id}
									className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
									onClick={() => router.push(`/driver/search/${request.id}`)}
								>
									<div className="flex justify-between items-start mb-2">
										<h3 className="font-bold text-lg">
											{request.departure} → {request.destination}
										</h3>
										<span className="text-sm text-gray-600">
											{request.distance.toFixed(1)}km
										</span>
									</div>
									<p className="text-sm text-gray-600 mb-2">
										{request.date} {request.time}
									</p>
									<p className="text-sm text-gray-600 mb-2">
										同乗者: {request.passengerName}
									</p>
									<p className="text-blue-600 font-bold">
										予算: {request.budget.toLocaleString()}円
									</p>
								</div>
							))}
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

export default DriverNearbyPage;

// % End

