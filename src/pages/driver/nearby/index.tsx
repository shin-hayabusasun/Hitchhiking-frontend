// % Start(AI Assistant)
// 近くの募集表示画面。現在地周辺の同乗者リクエストを表示。

import { useEffect, useState } from 'react';
import { DriverHeader } from '@/components/driver/DriverHeader';
import { useRouter } from 'next/router';

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
			<div className="min-h-screen bg-gray-100">
				<DriverHeader />
				<main className="p-8 text-center">
					<p>位置情報を取得中...</p>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<DriverHeader />
			<main className="p-8">
				<h2 className="text-2xl font-bold mb-6 text-center">近くの募集</h2>

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
		</div>
	);
}

export default DriverNearbyPage;

// % End

