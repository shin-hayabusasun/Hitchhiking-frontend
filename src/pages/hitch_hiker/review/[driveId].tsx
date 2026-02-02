import { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Star, Send, Loader2, MessageSquare } from 'lucide-react';

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
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
            <div className="w-full min-h-screen flex flex-col relative">
                
                {/* ヘッダー */}
                <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
                    <div className="max-w-2xl mx-auto w-full px-4 py-3 pt-8 flex items-center">
                        <button 
                            onClick={() => router.back()} 
                            className="text-gray-400 hover:bg-gray-50 p-1.5 border border-gray-100 rounded-xl transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-sm font-black text-gray-800 flex-1 text-center mr-8">レビューを入力</h1>
                    </div>
                </div>

                <main className="flex-1 overflow-y-auto scrollbar-hide">
                    <div className="max-w-2xl mx-auto w-full p-4 space-y-5">
                        
                        {/* 評価カード */}
                        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 space-y-8 text-center">
                            <div>
                                <h2 className="text-sm font-black text-gray-700 mb-1">ドライブはいかがでしたか？</h2>
                                <p className="text-[11px] text-gray-400 font-bold">ドライバーへの評価をお願いします</p>
                            </div>

                            <div className="flex flex-col items-center space-y-3">
                                <div className="flex items-center space-x-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className="transition-transform active:scale-90"
                                        >
                                            <Star 
                                                className={`w-8 h-8 ${
                                                    star <= rating 
                                                    ? 'text-yellow-400 fill-yellow-400' 
                                                    : 'text-gray-200'
                                                }`} 
                                            />
                                        </button>
                                    ))}
                                </div>
                                <span className="text-xl font-black text-gray-700">{rating}.0</span>
                            </div>

                            <div className="text-left space-y-2">
                                <div className="flex items-center space-x-2 ml-1">
                                    <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                                        Comment
                                    </label>
                                </div>
                                <textarea
                                    rows={5}
                                    className="w-full bg-gray-50 border-none rounded-xl p-4 text-xs font-bold focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300 leading-relaxed transition-all"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="ドライブの感想や、感謝のメッセージを入力してください"
                                ></textarea>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-500 text-[10px] font-bold p-3 rounded-lg border border-red-100">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* 下部固定ボタン */}
                <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 z-40">
                    <div className="max-w-2xl mx-auto w-full p-5 flex space-x-3">
                        <button
                            onClick={() => router.back()}
                            className="flex-1 bg-white border border-gray-200 text-gray-500 py-3.5 rounded-xl font-black text-sm active:scale-95 transition-all"
                            disabled={loading}
                        >
                            キャンセル
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-[2] bg-blue-600 text-white py-3.5 rounded-xl font-black text-sm flex items-center justify-center shadow-lg shadow-blue-100 active:scale-95 transition-all disabled:bg-gray-400"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4 mr-2" />
                            )}
                            {loading ? '送信中...' : 'レビューを送信'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PassengerReviewPage;