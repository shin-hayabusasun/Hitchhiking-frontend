// % Start(AI Assistant)
// ドライブ終了後の評価入力・完了報告画面

import { useState } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader';

interface PassengerRating {
	passengerId: string;
	passengerName: string;
	rating: number;
	comment: string;
}

export function DriveCompletePage() {
	const router = useRouter();
	const { driveId } = router.query;
	const [passengers] = useState<PassengerRating[]>([
		{
			passengerId: '1',
			passengerName: '田中太郎',
			rating: 5,
			comment: '',
		},
	]);
	const [ratings, setRatings] = useState<PassengerRating[]>(passengers);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	function updateRating(index: number, field: 'rating' | 'comment', value: any) {
		const newRatings = [...ratings];
		newRatings[index] = {
			...newRatings[index],
			[field]: value,
		};
		setRatings(newRatings);
	}

	async function handleSubmit() {
		setError('');
		setLoading(true);

		// 全員の評価が入力されているかチェック
		const allRated = ratings.every((r) => r.rating > 0);
		if (!allRated) {
			setError('全ての同乗者に評価を入力してください');
			setLoading(false);
			return;
		}

		try {
			const response = await fetch('/api/driver/reviews', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({
					driveId,
					ratings,
				}),
			});

			if (response.ok) {
				alert('評価を送信しました');
				router.push('/driver/drives');
			} else {
				setError('評価の送信に失敗しました');
			}
		} catch (err) {
			setError('評価の送信に失敗しました');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<TitleHeader title="ドライブ完了" backPath="/driver/manage" />
			<main className="p-8">
				<div className="bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-2xl font-bold mb-6">同乗者を評価</h2>

					{error && <p className="text-red-500 mb-4">{error}</p>}

					<div className="space-y-6">
						{ratings.map((passenger, index) => (
							<div key={passenger.passengerId} className="border-b pb-6">
								<h3 className="font-bold text-lg mb-4">
									{passenger.passengerName}
								</h3>

								<div className="mb-4">
									<label className="block text-gray-700 text-sm font-bold mb-2">
										評価 (1〜5)
									</label>
									<div className="flex items-center space-x-2">
										{[1, 2, 3, 4, 5].map((star) => (
											<button
												key={star}
												onClick={() => updateRating(index, 'rating', star)}
												className={`text-3xl ${
													star <= passenger.rating
														? 'text-yellow-400'
														: 'text-gray-300'
												}`}
											>
												★
											</button>
										))}
										<span className="ml-4 text-lg">{passenger.rating} / 5</span>
									</div>
								</div>

								<div>
									<label className="block text-gray-700 text-sm font-bold mb-2">
										コメント
									</label>
									<textarea
										rows={4}
										className="shadow border rounded w-full py-2 px-3"
										value={passenger.comment}
										onChange={(e) =>
											updateRating(index, 'comment', e.target.value)
										}
										placeholder="同乗者への感想をお聞かせください（任意）"
									></textarea>
								</div>
							</div>
						))}
					</div>

					<div className="mt-8 flex justify-end space-x-4">
						<button
							onClick={() => router.back()}
							className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded"
							disabled={loading}
						>
							キャンセル
						</button>
						<button
							onClick={handleSubmit}
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
							disabled={loading}
						>
							{loading ? '送信中...' : '評価を送信'}
						</button>
					</div>
				</div>
			</main>
		</div>
	);
}

export default DriveCompletePage;

// % End

