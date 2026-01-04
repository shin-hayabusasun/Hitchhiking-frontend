import { Star, Heart, MapPin } from 'lucide-react';

interface RequestCardProps {
    id: string;
    passengerName: string;
    rating: number;
    reviewCount: number;
    matchingRate: number;
    departure: string;
    destination: string;
    departureTime: string;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
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
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                    {passengerName[0]}
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 text-base">{passengerName}</h3>
                    <div className="flex items-center text-xs text-gray-400 gap-1">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-gray-600">{rating}</span>
                        <span>({reviewCount}回)</span>
                    </div>
                </div>
            </div>

            {/* ルート表示カード */}
            <div className="bg-gray-50 rounded-2xl p-3 space-y-1 border border-gray-100/50">
                <div className="text-sm text-gray-700 flex items-center gap-2 font-medium">
                    <MapPin size={14} className="text-gray-400" />
                    {departure} → {destination}
                </div>
                <div className="text-[10px] text-gray-400 ml-6">
                    {departureTime}
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