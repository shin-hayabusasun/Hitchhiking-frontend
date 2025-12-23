// % Start(AI Assistant)
// 同乗者募集検索のフィルタ画面

import { useState } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader';

export function SearchFilterPage() {
	const router = useRouter();
	const [filters, setFilters] = useState({
		departure: '',
		destination: '',
		date: '',
		minFee: '',
		maxFee: '',
		capacity: '',
	});

	function handleApplyFilter() {
		// フィルタ条件をクエリパラメータとして検索画面に戻る
		const query = new URLSearchParams();
		Object.entries(filters).forEach(([key, value]) => {
			if (value) {
				query.append(key, value);
			}
		});
		router.push(`/hitch_hiker/Search?${query.toString()}`);
	}

	function handleReset() {
		setFilters({
			departure: '',
			destination: '',
			date: '',
			minFee: '',
			maxFee: '',
			capacity: '',
		});
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<TitleHeader title="検索フィルタ" backPath="/hitch_hiker/Search" />
			<main className="p-8">
				<div className="bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-2xl font-bold mb-6">検索条件を設定</h2>

					<div className="space-y-4">
						<div>
							<label className="block text-gray-700 text-sm font-bold mb-2">
								出発地
							</label>
							<input
								type="text"
								className="shadow border rounded w-full py-2 px-3"
								value={filters.departure}
								onChange={(e) =>
									setFilters({ ...filters, departure: e.target.value })
								}
								placeholder="例: 東京駅"
							/>
						</div>

						<div>
							<label className="block text-gray-700 text-sm font-bold mb-2">
								目的地
							</label>
							<input
								type="text"
								className="shadow border rounded w-full py-2 px-3"
								value={filters.destination}
								onChange={(e) =>
									setFilters({ ...filters, destination: e.target.value })
								}
								placeholder="例: 横浜駅"
							/>
						</div>

						<div>
							<label className="block text-gray-700 text-sm font-bold mb-2">
								希望日
							</label>
							<input
								type="date"
								className="shadow border rounded w-full py-2 px-3"
								value={filters.date}
								onChange={(e) => setFilters({ ...filters, date: e.target.value })}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-gray-700 text-sm font-bold mb-2">
									料金（最小）
								</label>
								<input
									type="number"
									className="shadow border rounded w-full py-2 px-3"
									value={filters.minFee}
									onChange={(e) =>
										setFilters({ ...filters, minFee: e.target.value })
									}
									placeholder="円"
									min="0"
								/>
							</div>
							<div>
								<label className="block text-gray-700 text-sm font-bold mb-2">
									料金（最大）
								</label>
								<input
									type="number"
									className="shadow border rounded w-full py-2 px-3"
									value={filters.maxFee}
									onChange={(e) =>
										setFilters({ ...filters, maxFee: e.target.value })
									}
									placeholder="円"
									min="0"
								/>
							</div>
						</div>

						<div>
							<label className="block text-gray-700 text-sm font-bold mb-2">
								募集人数
							</label>
							<input
								type="number"
								className="shadow border rounded w-full py-2 px-3"
								value={filters.capacity}
								onChange={(e) =>
									setFilters({ ...filters, capacity: e.target.value })
								}
								placeholder="人数"
								min="1"
							/>
						</div>
					</div>

					<div className="mt-8 flex justify-end space-x-4">
						<button
							onClick={handleReset}
							className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded"
						>
							リセット
						</button>
						<button
							onClick={handleApplyFilter}
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
						>
							適用
						</button>
					</div>
				</div>
			</main>
		</div>
	);
}

export default SearchFilterPage;

// % End

