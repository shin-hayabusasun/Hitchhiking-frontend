// % Start(AI Assistant)
// 同乗者側募集詳細画面。募集に応答する。

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader';

interface RequestDetail {
	id: string;
	passengerName: string;
	departure: string;
	destination: string;
	date: string;
	time: string;
	budget: number;
	details: string;
	matchingScore: number;
}

export function RequestDetailPage() {
	const router = useRouter();
	const { requestId } = router.query;
	const [request, setRequest] = useState<RequestDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		if (requestId) {
			fetchRequestDetail();
		}
	}, [requestId]);

	async function fetchRequestDetail() {
		try {
			const response = await fetch(`/api/passenger-requests/${requestId}`, {
				method: 'GET',
				credentials: 'include',
			});
			const data = await response.json();
			if (response.ok && data.request) {
				setRequest(data.request);
			}
		} catch (err) {
			setError('募集情報の取得に失敗しました');
		} finally {
			setLoading(false);
		}
	}

	async function handleRespond() {
		if (!confirm('この募集に応答しますか？')) {
			return;
		}

		try {
			const response = await fetch('/api/applications', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({
					targetid: requestId,
					type: 'requests',
				}),
			});

			const data = await response.json();
			if (response.ok) {
				alert('募集に応答しました');
				router.push('/driver/drives');
			} else {
				alert(data.message || '応答に失敗しました');
			}
		} catch (err) {
			alert('応答に失敗しました');
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100">
				<TitleHeader title="募集詳細" backPath="/driver/search" />
				<main className="p-8 text-center">
					<p>読み込み中...</p>
				</main>
			</div>
		);
	}

	if (error || !request) {
		return (
			<div className="min-h-screen bg-gray-100">
				<TitleHeader title="募集詳細" backPath="/driver/search" />
				<main className="p-8 text-center">
					<p className="text-red-500">{error || '募集が見つかりませんでした'}</p>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<TitleHeader title="募集詳細" backPath="/driver/search" />
			<main className="p-8">
				<div className="bg-white p-6 rounded-lg shadow-md">
					<div className="mb-6">
						<div className="flex justify-between items-start mb-4">
							<h2 className="text-2xl font-bold">
								{request.departure} → {request.destination}
							</h2>
							<span className="bg-green-100 text-green-600 px-3 py-1 rounded-full font-semibold">
								マッチング度: {request.matchingScore}%
							</span>
						</div>
					</div>

					<div className="space-y-4 mb-6">
						<div className="flex items-center">
							<span className="font-semibold w-32">同乗者:</span>
							<span>{request.passengerName}</span>
						</div>
						<div className="flex items-center">
							<span className="font-semibold w-32">希望日時:</span>
							<span>
								{request.date} {request.time}
							</span>
						</div>
						<div className="flex items-center">
							<span className="font-semibold w-32">予算:</span>
							<span className="text-blue-600 font-bold text-lg">
								{request.budget.toLocaleString()}円
							</span>
						</div>
						<div>
							<span className="font-semibold block mb-2">詳細情報:</span>
							<p className="text-gray-700 bg-gray-50 p-4 rounded">
								{request.details || '特になし'}
							</p>
						</div>
					</div>

					<div className="flex justify-end space-x-4">
						<button
							onClick={() => router.back()}
							className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded"
						>
							戻る
						</button>
						<button
							onClick={handleRespond}
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
						>
							この募集に応答する
						</button>
					</div>
				</div>
			</main>
		</div>
	);
}

export default RequestDetailPage;

// % End

