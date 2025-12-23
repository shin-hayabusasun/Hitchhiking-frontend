// % Start(AI Assistant)
// ドライブ終了後のレビュー入力画面

import { useState } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader';

export function PassengerReviewPage() {
	const router = useRouter();
	const { driveId } = router.query;
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	async function handleSubmit() {
		setError('');
		setLoading(true);

		if (rating < 1 || rating > 5) {
			setError('評価は1〜5の範囲で選択してください');
			setLoading(false);
			return;
		}

		try {
			const response = await fetch(`/api/reviews`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({
					driveId,
					rating,
					comment,
				}),
			});

			if (response.ok) {
				alert('レビューを送信しました');
				router.push('/hitch_hiker/Search');
			} else {
				setError('レビューの送信に失敗しました');
			}
		} catch (err) {
			setError('レビューの送信に失敗しました');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<TitleHeader title="レビュー入力" backPath="/hitch_hiker/Search" />
			<main className="p-8">
				<div className="bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-2xl font-bold mb-6">ドライブの評価</h2>

					<div className="space-y-6">
						<div>
							<label className="block text-gray-700 text-sm font-bold mb-2">
								評価 (1〜5)
							</label>
							<div className="flex items-center space-x-2">
								{[1, 2, 3, 4, 5].map((star) => (
									<button
										key={star}
										onClick={() => setRating(star)}
										className={`text-3xl ${
											star <= rating ? 'text-yellow-400' : 'text-gray-300'
										}`}
									>
										★
									</button>
								))}
								<span className="ml-4 text-lg">{rating} / 5</span>
							</div>
						</div>

						<div>
							<label className="block text-gray-700 text-sm font-bold mb-2">
								コメント
							</label>
							<textarea
								rows={6}
								className="shadow border rounded w-full py-2 px-3"
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								placeholder="ドライブの感想をお聞かせください"
							></textarea>
						</div>
					</div>

					{error && <p className="text-red-500 text-sm mt-4">{error}</p>}

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
							{loading ? '送信中...' : '送信'}
						</button>
					</div>
				</div>
			</main>
		</div>
	);
}

export default PassengerReviewPage;

// % End

