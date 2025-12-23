// % Start(AI Assistant)
// ポイント獲得・利用履歴の一覧表示画面

import { useEffect, useState } from 'react';
import { TitleHeader } from '@/components/TitleHeader';

interface PointTransaction {
	id: string;
	type: string;
	amount: number;
	description: string;
	date: string;
}

export function PointHistoryPage() {
	const [transactions, setTransactions] = useState<PointTransaction[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [filter, setFilter] = useState('all'); // all, earned, spent

	useEffect(() => {
		async function fetchHistory() {
			try {
				const response = await fetch('/api/point/history', {
					method: 'GET',
					credentials: 'include',
				});
				const data = await response.json();
				if (response.ok && data.transactions) {
					setTransactions(data.transactions);
				}
			} catch (err) {
				setError('履歴の取得に失敗しました');
			} finally {
				setLoading(false);
			}
		}
		fetchHistory();
	}, []);

	const filteredTransactions = transactions.filter((t) => {
		if (filter === 'all') return true;
		if (filter === 'earned') return t.type === 'earned';
		if (filter === 'spent') return t.type === 'spent';
		return true;
	});

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100">
				<TitleHeader title="ポイント履歴" backPath="/points" />
				<main className="p-8 text-center">
					<p>読み込み中...</p>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<TitleHeader title="ポイント履歴" backPath="/points" />
			<main className="p-8">
				<div className="bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-2xl font-bold mb-6">ポイント履歴</h2>

					<div className="mb-6 flex space-x-4">
						<button
							onClick={() => setFilter('all')}
							className={`px-4 py-2 rounded ${
								filter === 'all'
									? 'bg-blue-500 text-white'
									: 'bg-gray-200 text-gray-700'
							}`}
						>
							全て
						</button>
						<button
							onClick={() => setFilter('earned')}
							className={`px-4 py-2 rounded ${
								filter === 'earned'
									? 'bg-green-500 text-white'
									: 'bg-gray-200 text-gray-700'
							}`}
						>
							獲得
						</button>
						<button
							onClick={() => setFilter('spent')}
							className={`px-4 py-2 rounded ${
								filter === 'spent'
									? 'bg-red-500 text-white'
									: 'bg-gray-200 text-gray-700'
							}`}
						>
							利用
						</button>
					</div>

					{error && <p className="text-red-500 mb-4">{error}</p>}

					{filteredTransactions.length === 0 ? (
						<p className="text-center text-gray-600">履歴がありません</p>
					) : (
						<div className="space-y-4">
							{filteredTransactions.map((transaction) => (
								<div
									key={transaction.id}
									className="border-b pb-4 flex justify-between items-center"
								>
									<div>
										<p className="font-semibold">{transaction.description}</p>
										<p className="text-sm text-gray-600">{transaction.date}</p>
									</div>
									<div
										className={`text-lg font-bold ${
											transaction.type === 'earned'
												? 'text-green-600'
												: 'text-red-600'
										}`}
									>
										{transaction.type === 'earned' ? '+' : '-'}
										{transaction.amount.toLocaleString()}P
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</main>
		</div>
	);
}

export default PointHistoryPage;

// % End

