// % Start(AI Assistant)
// ドライブ終了後のレビュー入力画面

import { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Star, Send, Loader2 } from 'lucide-react';

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
		<div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800 pb-32">
			
			{/* ヘッダー: 横いっぱい白背景、中身は中央寄せ */}
			<header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
				<div className="max-w-2xl mx-auto px-4 py-4 flex items-center">
					<button onClick={() => router.back()} className="text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors">
						<ArrowLeft className="w-6 h-6" />
					</button>
					<h1 className="text-[17px] font-black text-blue-600 flex-1 text-center mr-8">レビュー入力</h1>
				</div>
			</header>

			{/* メインコンテンツ: max-w-2xl */}
			<main className="max-w-2xl mx-auto p-5 space-y-6">
				<div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 space-y-8">
					<div className="text-center">
						<h2 className="text-xl font-black text-gray-800">ドライブはいかがでしたか？</h2>
						<p className="text-sm text-gray-500 mt-2">ドライバーへの評価と感想を教えてください</p>
					</div>

					{/* 星評価エリア */}
					<div className="space-y-3">
						<label className="text-[11px] font-black text-gray-400 uppercase tracking-wider ml-1">
							5段階評価
						</label>
						<div className="flex flex-col items-center bg-gray-50 rounded-2xl py-6 space-y-3">
							<div className="flex items-center space-x-2">
								{[1, 2, 3, 4, 5].map((star) => (
									<button
										key={star}
										onClick={() => setRating(star)}
										className="transition-transform active:scale-90"
									>
										<Star 
											className={`w-10 h-10 ${
												star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
											}`} 
										/>
									</button>
								))}
							</div>
							<span className="text-2xl font-black text-gray-700">{rating} / 5</span>
						</div>
					</div>

					{/* コメントエリア */}
					<div className="space-y-3">
						<label className="text-[11px] font-black text-gray-400 uppercase tracking-wider ml-1">
							コメント
						</label>
						<textarea
							rows={6}
							className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 min-h-[150px]"
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							placeholder="ドライブの感想をお聞かせください（待ち合わせのスムーズさ、運転の丁寧さなど）"
						></textarea>
					</div>

					{error && (
						<div className="bg-red-50 text-red-500 text-xs font-bold p-4 rounded-xl flex items-center border border-red-100">
							{error}
						</div>
					)}
				</div>
			</main>

			{/* アクションボタン: 画面下部に固定 */}
			<footer className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-gray-50 z-50">
				<div className="max-w-2xl mx-auto flex space-x-3">
					<button
						onClick={() => router.back()}
						className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-4 rounded-[1.5rem] font-black text-[15px] transition-all"
						disabled={loading}
					>
						キャンセル
					</button>
					<button
						onClick={handleSubmit}
						className={`flex-[2] ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-4 rounded-[1.5rem] font-black text-[15px] flex items-center justify-center shadow-xl shadow-blue-200 active:scale-95 transition-all`}
						disabled={loading}
					>
						{loading ? (
							<Loader2 className="w-5 h-5 mr-2 animate-spin" />
						) : (
							<Send className="w-5 h-5 mr-2" />
						)}
						{loading ? '送信中...' : 'レビューを送信'}
					</button>
				</div>
			</footer>
		</div>
	);
}

export default PassengerReviewPage;
// % End