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
        /* ★ 背景を w-full で全幅に広げ、中央寄せを適用 */
        <div className="min-h-screen bg-gray-50 flex justify-center w-full">
            
            {/* ★ コンテンツを max-w-2xl に制限。デザイン・サイズは維持 */}
            <div className="w-full max-w-2xl min-h-screen bg-gray-50 flex flex-col border-x border-gray-100">
                
                <TitleHeader title="ドライブ完了" backPath="/driver/manage" />
                
                <main className="p-4 flex-1 overflow-y-auto pb-10">
                    <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">同乗者を評価</h2>

                        {error && <p className="text-red-500 mb-4 text-xs font-bold">{error}</p>}

                        <div className="space-y-5">
                            {ratings.map((passenger, index) => (
                                <div key={passenger.passengerId} className="border-b border-gray-50 pb-5 last:border-0 last:pb-0">
                                    <h3 className="font-bold text-base mb-3 text-gray-700">
                                        {passenger.passengerName}
                                    </h3>

                                    <div className="mb-4">
                                        <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2 ml-1">
                                            評価 (1〜5)
                                        </label>
                                        <div className="flex items-center space-x-1.5 bg-gray-50 p-3 rounded-xl">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => updateRating(index, 'rating', star)}
                                                    className={`text-2xl transition-all duration-200 active:scale-125 ${
                                                        star <= passenger.rating
                                                            ? 'text-yellow-400'
                                                            : 'text-gray-200'
                                                    }`}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                            <span className="ml-3 text-sm font-bold text-gray-500">{passenger.rating} / 5</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2 ml-1">
                                            コメント
                                        </label>
                                        <textarea
                                            rows={3}
                                            className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all"
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

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => router.back()}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm transition-colors"
                                disabled={loading}
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:bg-gray-300"
                                disabled={loading}
                            >
                                {loading ? '送信中...' : '評価を送信'}
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default DriveCompletePage;