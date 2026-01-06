import { MapPin, Calendar, DollarSign, Star, Heart, Navigation, Clock } from 'lucide-react';

interface RecruitmentCardProps {
    id: string;
    passengerName: string;
    rating?: number;
    reviewCount?: number;
    departure: string;
    destination: string;
    date: string;
    time: string;
    budget: number;
    matchingScore?: number;
    distance?: number;
    startsIn?: number;
    onClick: () => void;
}

export function RecruitmentCard({
    passengerName,
    rating = 4.8,
    reviewCount = 34,
    departure,
    destination,
    date,
    time,
    budget,
    matchingScore,
    distance,
    startsIn,
    onClick
}: RecruitmentCardProps) {
    // 日時のフォーマット
    const formattedDate = new Date(date).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
    const formattedTime = time.substring(0, 5);

    return (
        <div 
            className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden"
            onClick={onClick}
        >
            {/* 上部バッジエリア */}
            <div className="flex items-center justify-between mb-4">
                {/* {matchingScore && (
                    <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-sm">
                        <Heart className="w-3 h-3" fill="currentColor" />
                        マッチング度 {matchingScore}%
                    </span>
                )} */}
                {matchingScore !== undefined && matchingScore !== null ? (
                    <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-sm">
                        <Heart className="w-3 h-3" fill="currentColor" />
                        マッチング度 {matchingScore}%
                    </span>
                ) : (
                    // デバッグ用: 値がない場合は空divでレイアウト崩れを防ぐ
                    <div></div> 
                )}
                
                <div className="flex items-center gap-2 ml-auto">
                    {distance !== undefined && (
                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                            <Navigation className="w-3 h-3" />
                            {distance.toFixed(1)}km
                        </span>
                    )}
                    {startsIn !== undefined && (
                        <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {startsIn}分後
                        </span>
                    )}
                </div>
            </div>

            {/* ユーザー情報 */}
            <div className="flex items-center gap-3 mb-4 pl-1">
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 font-bold text-lg border border-purple-100">
                    {passengerName.charAt(0)}
                </div>
                <div>
                    <p className="text-gray-800 font-bold text-sm leading-tight">{passengerName}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-gray-700">{rating.toFixed(1)}</span>
                        <span>({reviewCount}回)</span>
                    </div>
                </div>
            </div>

            {/* ルート情報（ご提示のデザインに合わせて調整） */}
            <div className="flex flex-col gap-3 mb-4 relative ml-2">
                {/* 縦の線 */}
                <div className="absolute left-[4px] top-[10px] bottom-[10px] w-[1px] bg-gray-200" />
                
                <div className="flex items-center gap-3 z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-white shadow-sm flex-shrink-0" />
                    <span className="text-sm font-bold text-gray-700 truncate">{departure}</span>
                </div>
                <div className="flex items-center gap-3 z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white shadow-sm flex-shrink-0" />
                    <span className="text-sm font-bold text-gray-700 truncate">{destination}</span>
                </div>
            </div>

            {/* 詳細情報（日時・金額） */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4 bg-gray-50/50 rounded-xl p-3 border border-gray-50">
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 font-medium">{formattedDate} {formattedTime}</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-green-600 text-sm">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>¥{budget.toLocaleString()}</span>
                </div>
            </div>

            {/* ボタン */}
            <button
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-green-100 active:scale-[0.98]"
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
            >
                詳細を見る
            </button>
        </div>
    );
}