// % Start(RequestDetailPage)
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DriverHeader } from '@/components/driver/DriverHeader';
import { 
    MapPin, Calendar, Users, DollarSign, 
    Star, ShieldCheck, MessageCircle, Navigation, Heart, Check
} from 'lucide-react';

interface RequestDetail {
    request: {
        id: number;
        origin: string;
        destination: string;
        date: string;
        time: string;
        budget: number;
        passengerCount: number;
        message: string;
        status: string;
    };
    passenger: {
        id: number;
        name: string;
        age: number;
        gender: number;
        rating: number;
        reviewCount: number;
        profileImage: string;
        bio: string;
    };
    matchingScore: number;
}

export function RequestDetailPage() {
    const router = useRouter();
    const { requestId } = router.query; // ファイル名が [requestId].tsx の場合
    const [data, setData] = useState<RequestDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (requestId) {
            fetchRequestDetail();
        }
    }, [requestId]);

    async function fetchRequestDetail() {
        try {
            // ★修正: 新しいAPIエンドポイント
            const response = await fetch(`http://localhost:8000/api/driver/search/${requestId}`, {
                method: 'GET',
                credentials: 'include',
            });
            const resData = await response.json();
            if (response.ok && resData.success) {
                setData(resData.data);
            } else {
                setError('募集情報の取得に失敗しました');
            }
        } catch (err) {
            setError('通信エラーが発生しました');
        } finally {
            setLoading(false);
        }
    }

    // ★修正: 応答（即確定）処理
    async function handleRespond() {
        if (!confirm('この募集に応答してドライブを確定しますか？')) return;

        try {
            const response = await fetch('http://localhost:8000/api/driver/respond', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ recruitment_id: Number(requestId) }),
            });
            
            const resData = await response.json();
            
            if (response.ok && resData.success) {
                alert('マッチングが成立しました！');
                router.push('/driver/drives'); // マイドライブ一覧へ
            } else {
                alert(resData.detail || '処理に失敗しました');
            }
        } catch (err) {
            alert('処理中にエラーが発生しました');
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <p className="text-red-500 font-bold">{error || 'データが見つかりません'}</p>
            </div>
        );
    }

    const { request, passenger, matchingScore } = data;

    return (
       <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">
                
                <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md">
                    <DriverHeader title="募集詳細" />
                </div>

                <main className="flex-1 p-4 space-y-4 pb-24">
                    {/* マッチング度カード */}
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-5 text-white text-center shadow-lg">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Heart size={20} fill="white" />
                            <span className="text-xl font-black">マッチング度 {matchingScore}%</span>
                        </div>
                        <p className="text-xs opacity-90 font-bold">あなたのルートとマッチしています</p>
                    </div>

                    {/* 同乗者情報 */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">募集者情報</p>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl font-bold">
                                {passenger.name[0]}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-gray-800">{passenger.name}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center text-yellow-500">
                                        <Star size={16} fill="currentColor" />
                                        <span className="ml-1 font-bold text-gray-700">{passenger.rating.toFixed(1)}</span>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">({passenger.reviewCount}回)</span>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1">
                                    {passenger.age > 0 ? `${passenger.age}歳` : ''} 
                                    {passenger.gender === 1 ? ' 男性' : passenger.gender === 2 ? ' 女性' : ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ルート情報 */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
                        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">ルート</p>
                        <div className="relative pl-6 space-y-6">
                            <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-dashed border-l-2 border-gray-200 border-dashed"></div>
                            <div className="relative">
                                <div className="absolute -left-6 top-1 w-3 h-3 bg-green-500 rounded-full ring-4 ring-green-100"></div>
                                <p className="text-[10px] text-gray-400 font-bold">出発地</p>
                                <p className="text-sm font-bold text-gray-800">{request.origin}</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-6 top-1 w-3 h-3 bg-red-500 rounded-full ring-4 ring-red-100"></div>
                                <p className="text-[10px] text-gray-400 font-bold">目的地</p>
                                <p className="text-sm font-bold text-gray-800">{request.destination}</p>
                            </div>
                        </div>
                    </div>

                    {/* 詳細情報 */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold mb-1">日時</p>
                                <p className="text-sm font-black text-gray-800">{request.date} <br/> {request.time}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold mb-1">予算</p>
                                <p className="text-lg font-black text-green-600">¥{request.budget.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-600 leading-relaxed font-medium">
                            {request.message}
                        </div>
                    </div>

                </main>

                {/* 固定アクションボタン */}
                <div className="sticky bottom-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent z-30">
                    <button 
                        onClick={handleRespond}
                        className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black shadow-lg shadow-green-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                        <Check size={20} /> この募集に応答する（確定）
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RequestDetailPage;
// % End