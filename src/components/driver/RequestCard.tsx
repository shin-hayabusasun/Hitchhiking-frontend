import { Star, Heart, MapPin, Clock } from 'lucide-react';

interface RequestCardProps {
    id: number;
    passengerName: string;
    rating: number;
    reviewCount: number;
    matchingRate: number;
    departure: string;
    destination: string;
    departureTime: string;
    createdAt: string; // ★追加
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
}

export function RequestCard({
    id,
    passengerName,
    rating,
    reviewCount,
    matchingRate,
    departure,
    destination,
    departureTime,
    // createdAt, // 使わない場合は受け取らなくても良いが、interfaceには必要
    onApprove,
    onReject
}: RequestCardProps) {
    return (
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 space-y-4 mb-4 text-left relative overflow-hidden transition-all hover:shadow-md">
            {/* マッチング度バッジ */}
            <div className="inline-flex items-center gap-1 bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-[10px] font-bold">
                <Heart size={10} fill="currentColor" />
                マッチング度 {matchingRate}%
            </div>

            <div className="flex items-center gap-3">
                {/* ユーザーアイコン（頭文字） */}
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg border border-blue-50">
                    {passengerName.charAt(0)}
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 text-base">{passengerName}</h3>
                    <div className="flex items-center text-xs text-gray-400 gap-1 mt-0.5">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-gray-600">{rating.toFixed(1)}</span>
                        <span>({reviewCount}回)</span>
                    </div>
                </div>
            </div>

            {/* ルート表示カード */}
            <div className="bg-gray-50 rounded-2xl p-3 space-y-2 border border-gray-100/50">
                <div className="text-sm text-gray-700 flex items-center gap-2 font-bold">
                    <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate">{departure}</span>
                    <span className="text-gray-300">→</span>
                    <span className="truncate">{destination}</span>
                </div>
                <div className="text-[11px] text-gray-500 ml-6 flex items-center gap-1 font-medium">
                    <Clock size={12} />
                    {departureTime} 出発
                </div>
            </div>

            {/* アクションボタン */}
            <div className="flex gap-3 pt-1">
                <button
                    onClick={() => onReject(id)}
                    className="flex-1 py-3 px-4 border border-gray-200 text-gray-600 rounded-xl font-bold text-sm active:scale-95 transition-all hover:bg-gray-50"
                >
                    拒否
                </button>
                <button
                    onClick={() => onApprove(id)}
                    className="flex-1 py-3 px-4 bg-green-600 text-white rounded-xl font-bold text-sm active:scale-95 transition-all shadow-lg shadow-green-100 hover:bg-green-700"
                >
                    承認
                </button>
            </div>
        </div>
    );
}