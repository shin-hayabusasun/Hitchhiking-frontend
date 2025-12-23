// % Start(AI Assistant)
// 募集検索画面。条件を指定して同乗者の募集を検索する。

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
	matchingScore: number;
}

export function DriverSearchPage() {
	const router = useRouter();
	const [requests, setRequests] = useState<PassengerRequest[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [filters, setFilters] = useState({
		from: '',
		to: '',
		date: '',
		minBudget: '',
		maxBudget: '',
	});

	async function handleSearch() {
		setLoading(true);
		setError('');

		try {
			const query = new URLSearchParams();
			Object.entries(filters).forEach(([key, value]) => {
				if (value) {
					query.append(key, value);
				}
			});

			const response = await fetch(`/api/passenger-requests?${query.toString()}`, {
				method: 'GET',
				credentials: 'include',
			});
			const data = await response.json();
			if (response.ok && data.requests) {
				setRequests(data.requests);
			}
		} catch (err) {
			setError('検索に失敗しました');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<DriverHeader />
			<main className="p-8">
				<h2 className="text-2xl font-bold mb-6 text-center">募集を検索</h2>

				<div className="bg-white p-6 rounded-lg shadow-md mb-6">
					<h3 className="text-lg font-bold mb-4">検索条件</h3>
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-gray-700 text-sm font-bold mb-2">
									出発地エリア
								</label>
								<input
									type="text"
									className="shadow border rounded w-full py-2 px-3"
									value={filters.from}
									onChange={(e) =>
										setFilters({ ...filters, from: e.target.value })
									}
									placeholder="例: 東京"
								/>
							</div>
							<div>
								<label className="block text-gray-700 text-sm font-bold mb-2">
									目的地エリア
								</label>
								<input
									type="text"
									className="shadow border rounded w-full py-2 px-3"
									value={filters.to}
									onChange={(e) =>
										setFilters({ ...filters, to: e.target.value })
									}
									placeholder="例: 横浜"
								/>
							</div>
						</div>

						<div>
							<label className="block text-gray-700 text-sm font-bold mb-2">
								希望日
							</label>
							<input
								type="date"
								className="shadow border rounded w-full py-2 px-3"
								value={filters.date}
								onChange={(e) =>
									setFilters({ ...filters, date: e.target.value })
								}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-gray-700 text-sm font-bold mb-2">
									予算（下限）
								</label>
								<input
									type="number"
									className="shadow border rounded w-full py-2 px-3"
									value={filters.minBudget}
									onChange={(e) =>
										setFilters({ ...filters, minBudget: e.target.value })
									}
									placeholder="円"
									min="0"
								/>
							</div>
							<div>
								<label className="block text-gray-700 text-sm font-bold mb-2">
									予算（上限）
								</label>
								<input
									type="number"
									className="shadow border rounded w-full py-2 px-3"
									value={filters.maxBudget}
									onChange={(e) =>
										setFilters({ ...filters, maxBudget: e.target.value })
									}
									placeholder="円"
									min="0"
								/>
							</div>
						</div>
					</div>

					<div className="mt-6 flex justify-end">
						<button
							onClick={handleSearch}
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
							disabled={loading}
						>
							{loading ? '検索中...' : '検索'}
						</button>
					</div>
				</div>

				{error && <p className="text-red-500 text-center mb-4">{error}</p>}

				{requests.length > 0 && (
					<div className="bg-white p-6 rounded-lg shadow-md">
						<h3 className="text-lg font-bold mb-4">
							検索結果 ({requests.length}件)
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{requests.map((request) => (
								<div
									key={request.id}
									className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
									onClick={() => router.push(`/driver/search/${request.id}`)}
								>
									<div className="flex justify-between items-start mb-2">
										<h4 className="font-bold">
											{request.departure} → {request.destination}
										</h4>
										<span className="text-sm text-green-600 font-semibold">
											{request.matchingScore}%
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
					</div>
				)}
			</main>
		</div>
	);
}

export default DriverSearchPage;

// % End

