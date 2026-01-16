// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { DriverHeader } from '@/components/driver/DriverHeader';
// import { 
//     Calendar, Users, DollarSign, 
//     Star, ShieldCheck, MessageCircle, Navigation, Heart, Check
// } from 'lucide-react';

// interface RequestDetail {
//     request: {
//         id: number;
//         origin: string;
//         destination: string;
//         date: string;
//         time: string;
//         budget: number;
//         passengerCount: number;
//         message: string;
//         status: string;
//     };
//     passenger: {
//         id: number;
//         name: string;
//         age: number;
//         gender: number;
//         rating: number;
//         reviewCount: number;
//         profileImage: string;
//         bio: string;
//     };
//     matchingScore: number;
// }

// export default function RequestDetailPage() {
//     const router = useRouter();
//     // ファイル名が [id].tsx なら id、 [requestId].tsx なら requestId になります
//     const { requestId } = router.query; 
    
//     const [data, setData] = useState<RequestDetail | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [processing, setProcessing] = useState(false);

//     // ★修正ポイント: router.isReady を監視する
//     useEffect(() => {
//         if (!router.isReady) return; // 準備ができるまで待つ

//         if (!requestId) {
//             setError('IDが取得できませんでした');
//             setLoading(false);
//             return;
//         }

//         fetchRequestDetail();
//     }, [router.isReady, requestId]);

//     async function fetchRequestDetail() {
//         try {
//             const response = await fetch(`http://localhost:8000/api/driver/search/${id}`, {
//                 method: 'GET',
//                 credentials: 'include',
//             });
//             const resData = await response.json();
//             if (response.ok && resData.success) {
//                 setData(resData.data);
//             } else {
//                 setError('データの取得に失敗しました');
//             }
//         } catch (err) {
//             setError('通信エラーが発生しました');
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     }

//     async function handleRespond() {
//         if (!confirm('この募集に応答して、同乗を受け入れますか？\n（即座にマッチングが確定します）')) return;

//         setProcessing(true);
//         try {
//             const response = await fetch('http://localhost:8000/api/driver/respond', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 credentials: 'include',
//                 body: JSON.stringify({ recruitment_id: Number(id) }),
//             });
            
//             const resData = await response.json();
            
//             if (response.ok && resData.success) {
//                 alert('マッチングが成立しました！\n予定管理画面へ移動します。');
//                 router.push('/driver/drives');
//             } else {
//                 alert(resData.detail || '処理に失敗しました');
//             }
//         } catch (err) {
//             alert('処理中にエラーが発生しました');
//         } finally {
//             setProcessing(false);
//         }
//     }

//     // 日時フォーマット
//     const formatDate = (dateStr: string, timeStr: string) => {
//         try {
//             const d = new Date(dateStr);
//             const day = d.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short' });
//             // timeStrが "HH:mm:ss" の場合、秒を削る
//             const time = timeStr.length > 5 ? timeStr.substring(0, 5) : timeStr;
//             return `${day} ${time}`;
//         } catch {
//             return `${dateStr} ${timeStr}`;
//         }
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//                 <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
//             </div>
//         );
//     }

//     if (error || !data) {
//         return (
//             <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//                 <div className="text-center w-full max-w-[390px]">
//                     <p className="text-red-500 font-bold mb-4">{error || 'データが見つかりません'}</p>
//                     <button onClick={() => router.back()} className="text-gray-500 underline text-sm bg-white px-4 py-2 rounded-lg shadow-sm">
//                         戻る
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     const { request, passenger, matchingScore } = data;

//     return (
//        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//             <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-green-50 to-white overflow-y-auto rounded-[3rem]">
                
//                 <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
//                     <DriverHeader title="募集詳細" />
//                 </div>

//                 <main className="flex-1 p-4 space-y-5 pb-28 scrollbar-hide">
//                     {/* マッチング度 */}
//                     <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-5 text-white text-center shadow-lg shadow-green-100">
//                         <div className="flex items-center justify-center gap-2 mb-1">
//                             <Heart size={20} fill="white" className="animate-pulse" />
//                             <span className="text-xl font-black">マッチング度 {matchingScore}%</span>
//                         </div>
//                         <p className="text-[10px] opacity-90 font-bold">あなたの条件・ルートと相性が良いです</p>
//                     </div>

//                     {/* 同乗者情報 */}
//                     <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4 border border-gray-100">
//                         <div className="flex items-center justify-between">
//                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Passenger</p>
//                             {passenger.id && (
//                                 <span className="bg-green-100 text-green-700 text-[9px] px-2 py-0.5 rounded-full flex items-center font-bold">
//                                     <ShieldCheck className="w-3 h-3 mr-0.5" /> 本人確認済
//                                 </span>
//                             )}
//                         </div>
                        
//                         <div className="flex items-center gap-4">
//                             <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl font-bold border-2 border-white shadow-sm">
//                                 {passenger.name[0]}
//                             </div>
//                             <div className="flex-1">
//                                 <h2 className="text-lg font-black text-gray-800">{passenger.name}</h2>
//                                 <div className="flex items-center gap-2 mt-0.5">
//                                     <div className="flex items-center text-yellow-400">
//                                         <Star size={14} fill="currentColor" />
//                                         <span className="ml-1 text-xs font-bold text-gray-700">{passenger.rating.toFixed(1)}</span>
//                                     </div>
//                                     <span className="text-[10px] text-gray-400 font-bold">({passenger.reviewCount}回の乗車)</span>
//                                 </div>
//                                 <p className="text-[10px] text-gray-400 mt-1 font-medium">
//                                     {passenger.age > 0 ? `${passenger.age}歳` : ''} 
//                                     {passenger.gender === 1 ? ' 男性' : passenger.gender === 2 ? ' 女性' : ''}
//                                 </p>
//                             </div>
//                         </div>
                        
//                         {/* メッセージ */}
//                         <div className="bg-gray-50 rounded-2xl p-4 text-xs text-gray-600 leading-relaxed font-medium border border-gray-100">
//                             <div className="flex items-center gap-1 mb-1 text-green-600 font-bold">
//                                 <MessageCircle className="w-3 h-3" />
//                                 <span className="text-[10px]">Message</span>
//                             </div>
//                             {request.message}
//                         </div>
//                     </div>

//                     {/* ルート情報 */}
//                     <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
//                         <p className="text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-widest">Request Route</p>
//                         <div className="relative pl-4 space-y-6">
//                             {/* 連結線 */}
//                             <div className="absolute left-[21px] top-2.5 bottom-2.5 w-0.5 bg-gray-100 rounded-full"></div>
                            
//                             {/* 出発地 */}
//                             <div className="relative flex items-start gap-3">
//                                 <div className="w-3 h-3 bg-green-500 rounded-full ring-4 ring-white shadow-sm mt-1 z-10"></div>
//                                 <div>
//                                     <p className="text-[9px] text-gray-400 font-bold">出発地</p>
//                                     <p className="text-sm font-bold text-gray-800 leading-tight">{request.origin}</p>
//                                 </div>
//                             </div>
                            
//                             {/* 目的地 */}
//                             <div className="relative flex items-start gap-3">
//                                 <div className="w-3 h-3 bg-red-500 rounded-full ring-4 ring-white shadow-sm mt-1 z-10"></div>
//                                 <div>
//                                     <p className="text-[9px] text-gray-400 font-bold">目的地</p>
//                                     <p className="text-sm font-bold text-gray-800 leading-tight">{request.destination}</p>
//                                 </div>
//                             </div>
//                         </div>
                        
//                         {/* ナビボタン (モック) */}
//                         <button className="mt-5 w-full py-2.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-blue-100 transition-colors">
//                             <Navigation size={14} /> ルートを地図で確認
//                         </button>
//                     </div>

//                     {/* 条件詳細 */}
//                     <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4 border border-gray-100">
//                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Details</p>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="p-3 bg-gray-50 rounded-2xl border border-gray-50">
//                                 <div className="flex items-center gap-1.5 text-gray-400 mb-1">
//                                     <Calendar size={12} />
//                                     <span className="text-[9px] font-bold">日時</span>
//                                 </div>
//                                 <p className="text-xs font-black text-gray-800">{formatDate(request.date, request.time)}</p>
//                             </div>
//                             <div className="p-3 bg-green-50 rounded-2xl border border-green-100">
//                                 <div className="flex items-center gap-1.5 text-green-600 mb-1">
//                                     <DollarSign size={12} />
//                                     <span className="text-[9px] font-bold">希望予算</span>
//                                 </div>
//                                 <p className="text-sm font-black text-green-700">¥{(request.budget || 0).toLocaleString()}</p>
//                             </div>
//                             <div className="p-3 bg-gray-50 rounded-2xl col-span-2 flex items-center justify-between border border-gray-50">
//                                 <div className="flex items-center gap-1.5 text-gray-400">
//                                     <Users size={12} />
//                                     <span className="text-[9px] font-bold">希望人数</span>
//                                 </div>
//                                 <p className="text-sm font-black text-gray-800">{request.passengerCount}名</p>
//                             </div>
//                         </div>
//                     </div>

//                 </main>

//                 {/* 固定アクションボタン */}
//                 <div className="sticky bottom-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent z-30">
//                     <button 
//                         onClick={handleRespond}
//                         disabled={processing}
//                         className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98] ${
//                             processing 
//                             ? 'bg-gray-400 text-white cursor-not-allowed' 
//                             : 'bg-green-600 hover:bg-green-700 text-white shadow-green-200'
//                         }`}
//                     >
//                         {processing ? (
//                             '処理中...'
//                         ) : (
//                             <>
//                                 <Check size={20} strokeWidth={3} /> この同乗を受け入れる
//                             </>
//                         )}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DriverHeader } from '@/components/driver/DriverHeader';
import { HitchhikerHeader } from '@/components/hitch_hiker/Header';
import { 
    Calendar, Users, DollarSign, 
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

export default function RequestDetailPage() {
    const router = useRouter();
    const { requestId } = router.query; 
    
    const [data, setData] = useState<RequestDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!router.isReady) return;

        if (!requestId) {
            setError('IDが取得できませんでした');
            setLoading(false);
            return;
        }

        fetchRequestDetail();
    }, [router.isReady, requestId]);

    async function fetchRequestDetail() {
        try {
            // ★修正: id ではなく requestId を使用
            const response = await fetch(`http://localhost:8000/api/driver/search/${requestId}`, {
                method: 'GET',
                credentials: 'include',
            });
            const resData = await response.json();
            if (response.ok && resData.success) {
                setData(resData.data);
            } else {
                setError('データの取得に失敗しました');
            }
        } catch (err) {
            console.error(err);
            setError('通信エラーが発生しました');
        } finally {
            setLoading(false);
        }
    }

    async function handleRespond() {
        if (!confirm('この募集に応答して、同乗を受け入れますか？\n（即座にマッチングが確定します）')) return;

        setProcessing(true);
        try {
            const response = await fetch('http://localhost:8000/api/driver/respond', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                // ★修正: id ではなく requestId を使用
                body: JSON.stringify({ recruitment_id: Number(requestId) }),
            });
            
            const resData = await response.json();
            
            if (response.ok && resData.success) {
                alert('マッチングが成立しました！\n予定管理画面へ移動します。');
                router.push('/driver/drives');
            } else {
                alert(resData.detail || '処理に失敗しました');
            }
        } catch (err) {
            console.error(err);
            alert('処理中にエラーが発生しました');
        } finally {
            setProcessing(false);
        }
    }

    // 日時フォーマット
    const formatDate = (dateStr: string, timeStr: string) => {
        try {
            const d = new Date(dateStr);
            const day = d.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short' });
            const time = timeStr.length > 5 ? timeStr.substring(0, 5) : timeStr;
            return `${day} ${time}`;
        } catch {
            return `${dateStr} ${timeStr}`;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="text-center w-full max-w-[390px]">
                    <p className="text-red-500 font-bold mb-4">{error || 'データが見つかりません'}</p>
                    <button onClick={() => router.back()} className="text-gray-500 underline text-sm bg-white px-4 py-2 rounded-lg shadow-sm">
                        戻る
                    </button>
                </div>
            </div>
        );
    }

    const { request, passenger, matchingScore } = data;

    return (
       <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">
                
                <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
                    <DriverHeader title="募集詳細" showMyPage={false} showNotification={false}/>
                </div>

                <main className="flex-1 p-4 space-y-5 pb-28 scrollbar-hide">
                    {/* マッチング度 */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-5 text-white text-center shadow-lg shadow-green-100">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Heart size={20} fill="white" className="animate-pulse" />
                            <span className="text-xl font-black">マッチング度 {matchingScore}%</span>
                        </div>
                        <p className="text-[10px] opacity-90 font-bold">あなたの条件・ルートと相性が良いです</p>
                    </div>

                    {/* 同乗者情報 */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Passenger</p>
                            {passenger.id && (
                                <span className="bg-green-100 text-green-700 text-[9px] px-2 py-0.5 rounded-full flex items-center font-bold">
                                    <ShieldCheck className="w-3 h-3 mr-0.5" /> 本人確認済
                                </span>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl font-bold border-2 border-white shadow-sm">
                                {passenger.name[0]}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-black text-gray-800">{passenger.name}</h2>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <div className="flex items-center text-yellow-400">
                                        <Star size={14} fill="currentColor" />
                                        <span className="ml-1 text-xs font-bold text-gray-700">{passenger.rating.toFixed(1)}</span>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-bold">({passenger.reviewCount}回の乗車)</span>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1 font-medium">
                                    {passenger.age > 0 ? `${passenger.age}歳` : ''} 
                                    {passenger.gender === 1 ? ' 男性' : passenger.gender === 2 ? ' 女性' : ''}
                                </p>
                            </div>
                        </div>
                        
                        {/* メッセージ */}
                        <div className="bg-gray-50 rounded-2xl p-4 text-xs text-gray-600 leading-relaxed font-medium border border-gray-100">
                            <div className="flex items-center gap-1 mb-1 text-green-600 font-bold">
                                <MessageCircle className="w-3 h-3" />
                                <span className="text-[10px]">Message</span>
                            </div>
                            {request.message}
                        </div>
                    </div>

                    {/* ルート情報 */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-widest">Request Route</p>
                        <div className="relative pl-4 space-y-6">
                            {/* 連結線 */}
                            <div className="absolute left-[21px] top-2.5 bottom-2.5 w-0.5 bg-gray-100 rounded-full"></div>
                            
                            {/* 出発地 */}
                            <div className="relative flex items-start gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full ring-4 ring-white shadow-sm mt-1 z-10"></div>
                                <div>
                                    <p className="text-[9px] text-gray-400 font-bold">出発地</p>
                                    <p className="text-sm font-bold text-gray-800 leading-tight">{request.origin}</p>
                                </div>
                            </div>
                            
                            {/* 目的地 */}
                            <div className="relative flex items-start gap-3">
                                <div className="w-3 h-3 bg-red-500 rounded-full ring-4 ring-white shadow-sm mt-1 z-10"></div>
                                <div>
                                    <p className="text-[9px] text-gray-400 font-bold">目的地</p>
                                    <p className="text-sm font-bold text-gray-800 leading-tight">{request.destination}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* ナビボタン (モック) */}
                        <button className="mt-5 w-full py-2.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-blue-100 transition-colors">
                            <Navigation size={14} /> ルートを地図で確認
                        </button>
                    </div>

                    {/* 条件詳細 */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4 border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Details</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-50">
                                <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                                    <Calendar size={12} />
                                    <span className="text-[9px] font-bold">日時</span>
                                </div>
                                <p className="text-xs font-black text-gray-800">{formatDate(request.date, request.time)}</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-2xl border border-green-100">
                                <div className="flex items-center gap-1.5 text-green-600 mb-1">
                                    <DollarSign size={12} />
                                    <span className="text-[9px] font-bold">希望予算</span>
                                </div>
                                <p className="text-sm font-black text-green-700">¥{(request.budget || 0).toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-2xl col-span-2 flex items-center justify-between border border-gray-50">
                                <div className="flex items-center gap-1.5 text-gray-400">
                                    <Users size={12} />
                                    <span className="text-[9px] font-bold">希望人数</span>
                                </div>
                                <p className="text-sm font-black text-gray-800">{request.passengerCount}名</p>
                            </div>
                        </div>
                    </div>

                </main>

                {/* 固定アクションボタン */}
                <div className="sticky bottom-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent z-30">
                    <button 
                        onClick={handleRespond}
                        disabled={processing}
                        className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98] ${
                            processing 
                            ? 'bg-gray-400 text-white cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-700 text-white shadow-green-200'
                        }`}
                    >
                        {processing ? (
                            '処理中...'
                        ) : (
                            <>
                                <Check size={20} strokeWidth={3} /> この同乗を受け入れる
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}