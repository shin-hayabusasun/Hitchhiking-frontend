// // % Start(AI Assistant)
// // 同乗者側募集詳細画面。募集に応答する。

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { TitleHeader } from '@/components/TitleHeader';

// interface RequestDetail {
// 	id: string;
// 	passengerName: string;
// 	departure: string;
// 	destination: string;
// 	date: string;
// 	time: string;
// 	budget: number;
// 	details: string;
// 	matchingScore: number;
// }

// export function RequestDetailPage() {
// 	const router = useRouter();
// 	const { requestId } = router.query;
// 	const [request, setRequest] = useState<RequestDetail | null>(null);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState('');

// 	useEffect(() => {
// 		if (requestId) {
// 			fetchRequestDetail();
// 		}
// 	}, [requestId]);

// 	async function fetchRequestDetail() {
// 		try {
// 			const response = await fetch(`/api/passenger-requests/${requestId}`, {
// 				method: 'GET',
// 				credentials: 'include',
// 			});
// 			const data = await response.json();
// 			if (response.ok && data.request) {
// 				setRequest(data.request);
// 			}
// 		} catch (err) {
// 			setError('募集情報の取得に失敗しました');
// 		} finally {
// 			setLoading(false);
// 		}
// 	}

// 	async function handleRespond() {
// 		if (!confirm('この募集に応答しますか？')) {
// 			return;
// 		}

// 		try {
// 			const response = await fetch('/api/applications', {
// 				method: 'POST',
// 				headers: {
// 					'Content-Type': 'application/json',
// 				},
// 				credentials: 'include',
// 				body: JSON.stringify({
// 					targetid: requestId,
// 					type: 'requests',
// 				}),
// 			});

// 			const data = await response.json();
// 			if (response.ok) {
// 				alert('募集に応答しました');
// 				router.push('/driver/drives');
// 			} else {
// 				alert(data.message || '応答に失敗しました');
// 			}
// 		} catch (err) {
// 			alert('応答に失敗しました');
// 		}
// 	}

// 	if (loading) {
// 		return (
// 			<div className="min-h-screen bg-gray-100">
// 				<TitleHeader title="募集詳細" backPath="/driver/search" />
// 				<main className="p-8 text-center">
// 					<p>読み込み中...</p>
// 				</main>
// 			</div>
// 		);
// 	}

// 	if (error || !request) {
// 		return (
// 			<div className="min-h-screen bg-gray-100">
// 				<TitleHeader title="募集詳細" backPath="/driver/search" />
// 				<main className="p-8 text-center">
// 					<p className="text-red-500">{error || '募集が見つかりませんでした'}</p>
// 				</main>
// 			</div>
// 		);
// 	}

// 	return (
// 		<div className="min-h-screen bg-gray-100">
// 			<TitleHeader title="募集詳細" backPath="/driver/search" />
// 			<main className="p-8">
// 				<div className="bg-white p-6 rounded-lg shadow-md">
// 					<div className="mb-6">
// 						<div className="flex justify-between items-start mb-4">
// 							<h2 className="text-2xl font-bold">
// 								{request.departure} → {request.destination}
// 							</h2>
// 							<span className="bg-green-100 text-green-600 px-3 py-1 rounded-full font-semibold">
// 								マッチング度: {request.matchingScore}%
// 							</span>
// 						</div>
// 					</div>

// 					<div className="space-y-4 mb-6">
// 						<div className="flex items-center">
// 							<span className="font-semibold w-32">同乗者:</span>
// 							<span>{request.passengerName}</span>
// 						</div>
// 						<div className="flex items-center">
// 							<span className="font-semibold w-32">希望日時:</span>
// 							<span>
// 								{request.date} {request.time}
// 							</span>
// 						</div>
// 						<div className="flex items-center">
// 							<span className="font-semibold w-32">予算:</span>
// 							<span className="text-blue-600 font-bold text-lg">
// 								{request.budget.toLocaleString()}円
// 							</span>
// 						</div>
// 						<div>
// 							<span className="font-semibold block mb-2">詳細情報:</span>
// 							<p className="text-gray-700 bg-gray-50 p-4 rounded">
// 								{request.details || '特になし'}
// 							</p>
// 						</div>
// 					</div>

// 					<div className="flex justify-end space-x-4">
// 						<button
// 							onClick={() => router.back()}
// 							className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded"
// 						>
// 							戻る
// 						</button>
// 						<button
// 							onClick={handleRespond}
// 							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
// 						>
// 							この募集に応答する
// 						</button>
// 					</div>
// 				</div>
// 			</main>
// 		</div>
// 	);
// }

// export default RequestDetailPage;

// // % End
// % Start(AI Assistant)
// 同乗者側募集詳細画面（運転者視点）。募集内容を確認し、承認・拒否を行う。

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DriverHeader } from '@/components/driver/DriverHeader';
import { 
    MapPin, Calendar, Users, DollarSign, 
    Star, ShieldCheck, MessageCircle, Navigation 
} from 'lucide-react';

interface RequestDetail {
    request: {
        id: string;
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
        id: string;
        name: string;
        age: number;
        gender: string;
        rating: number;
        reviewCount: number;
        profileImage: string;
        bio: string;
    };
    matchingScore: number;
}

export function RequestDetailPage() {
    const router = useRouter();
    const { requestId } = router.query;
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
            // 提供されたモックAPIのパスに合わせて取得
            const response = await fetch(`/api/passenger-requests/${requestId}`, {
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

    async function handleAction(type: 'approve' | 'reject') {
        const actionName = type === 'approve' ? '承認' : '拒否';
        if (!confirm(`このリクエストを${actionName}しますか？`)) return;

        try {
            const response = await fetch(`/api/applications/${requestId}/${type}`, {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                alert(`${actionName}しました`);
                router.push('/driver/requests');
            } else {
                alert('処理に失敗しました');
            }
        } catch (err) {
            alert('処理中にエラーが発生しました');
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-[390px] aspect-[9/19] bg-white rounded-[3rem] shadow-2xl flex flex-col items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mb-4"></div>
                    <p className="text-gray-500 font-bold">読み込み中...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 text-center">
                <div className="w-full max-w-[390px] aspect-[9/19] bg-white rounded-[3rem] shadow-2xl p-10">
                    <p className="text-red-500 font-bold mb-4">{error || 'データが見つかりません'}</p>
                    <button onClick={() => router.back()} className="text-blue-500 underline">戻る</button>
                </div>
            </div>
        );
    }

    const { request, passenger, matchingScore } = data;

    return (
       <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			<div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">
                
                <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md">
                    <DriverHeader title="募集詳細" showBackButton={true} showNotification = {false} showMyPage = {false}/>
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

                    {/* 同乗者（募集者）情報カード */}
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
                                        <span className="ml-1 font-bold text-gray-700">{passenger.rating}</span>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">({passenger.reviewCount}回の利用)</span>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                                    <ShieldCheck size={12} className="text-green-500" />
                                    登録: 2023年5月
                                </p>
                            </div>
                        </div>
                        <button className="w-full py-3 bg-gray-50 text-gray-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-gray-100 active:scale-95 transition-all">
                            <MessageCircle size={18} /> メッセージを送る
                        </button>
                    </div>

                    {/* ルート情報カード */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
                        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">ルート</p>
                        <div className="relative pl-6 space-y-6">
                            <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-dashed border-l-2 border-gray-200 border-dashed"></div>
                            <div className="relative">
                                <div className="absolute -left-6 top-1 w-3 h-3 bg-green-500 rounded-full ring-4 ring-green-100"></div>
                                <p className="text-[10px] text-gray-400 font-bold">出発地</p>
                                <p className="text-lg font-bold text-gray-800">{request.origin}</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-6 top-1 w-3 h-3 bg-red-500 rounded-full ring-4 ring-red-100"></div>
                                <p className="text-[10px] text-gray-400 font-bold">目的地</p>
                                <p className="text-lg font-bold text-gray-800">{request.destination}</p>
                            </div>
                        </div>
                        {/* 地図イメージ（画像参照） */}
                        <div className="h-40 bg-blue-50 rounded-2xl relative overflow-hidden flex items-center justify-center border border-blue-100">
                             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
                             <button className="relative bg-white px-4 py-2 rounded-xl shadow-md text-xs font-bold text-blue-600 flex items-center gap-2">
                                <Navigation size={14} /> ナビ起動
                             </button>
                        </div>
                    </div>

                    {/* 詳細情報カード */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
                        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">詳細情報</p>
                        <div className="divide-y divide-gray-50">
                            <div className="py-3 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Calendar size={18} />
                                    <span className="text-sm font-bold">日時</span>
                                </div>
                                <span className="text-sm font-black text-gray-700">{request.date.replace(/-/g, '/')} {request.time}</span>
                            </div>
                            <div className="py-3 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Users size={18} />
                                    <span className="text-sm font-bold">同乗希望人数</span>
                                </div>
                                <span className="text-sm font-black text-gray-700">{request.passengerCount}名</span>
                            </div>
                            <div className="py-3 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <DollarSign size={18} />
                                    <span className="text-sm font-bold">予算</span>
                                </div>
                                <span className="text-lg font-black text-green-600">¥{request.budget.toLocaleString()} /人</span>
                            </div>
                        </div>
                    </div>

                    {/* メッセージカード */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm space-y-3">
                        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">メッセージ</p>
                        <div className="bg-gray-50 rounded-2xl p-4">
                            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                {request.message}
                            </p>
                        </div>
                    </div>

                </main>

                {/* 固定アクションボタン */}
                <div className="sticky bottom-0 p-4 bg-gradient-to-t from-gray-50 via-gray-50/90 to-transparent flex gap-3 z-30">
                    <button 
                        onClick={() => handleAction('reject')}
                        className="flex-1 py-4 bg-white border-2 border-gray-200 text-gray-800 rounded-2xl font-black shadow-lg active:scale-95 transition-all"
                    >
                        拒否
                    </button>
                    <button 
                        onClick={() => handleAction('approve')}
                        className="flex-[1.5] py-4 bg-green-600 text-white rounded-2xl font-black shadow-lg shadow-green-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                        承認
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RequestDetailPage;

// LucideのHeartアイコン用（標準にはないためカスタム）
function Heart({ size, fill }: { size: number, fill: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
    )
}
// % End
