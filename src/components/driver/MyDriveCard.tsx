// % Start(AI Assistant)
import { useRouter } from 'next/router';
import { Calendar, Users, MessageCircle, ChevronRight, Loader2 } from 'lucide-react';
import { getApiUrl } from '@/config/api';
import { useState } from 'react';

interface Passenger {
    userId: number;
    name: string;
    passengerCount: number;
}

interface MyDriveCardProps {
    id: number;
    departure: string;
    destination: string;
    departureTime: string;
    fee: number;
    capacity: number;
    currentPassengers: number;
    status: string;
    approvedPassengers?: Passenger[];
    onEdit?: () => void;
    onDelete?: () => void; // 削除成功後のリロード用
    onDetail?: () => void;
}

export function MyDriveCard({
    id,
    departure,
    destination,
    departureTime,
    fee,
    capacity,
    currentPassengers,
    status,
    approvedPassengers = [],
    onEdit,
    onDelete,
    onDetail,
}: MyDriveCardProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    // 削除処理の実装
    const handleDeleteClick = async () => {
        if (!confirm("このドライブを削除してもよろしいですか？\n関連する取引データや経路情報もすべて削除されます。")) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(getApiUrl(`/api/driver/schedules/${id}`), {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // セッションID（クッキー）を送信
            });

            const result = await response.json();

            if (response.ok && result.ok) {
                alert("削除が完了しました");
                if (onDelete) onDelete(); // 親コンポーネントに通知してリストを再取得させる
            } else {
                alert(result.detail || "削除に失敗しました");
            }
        } catch (error) {
            console.error("Delete Error:", error);
            alert("サーバーとの通信に失敗しました");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEditClick = () => {
        
            router.push(`/driver/drives/edit/${id}`);
        
    };

    const handleDetailClick = () => {
        if (onDetail) {
            onDetail();
        } else {
            router.push(`/driver/drives/detail/${id}`);
        }
    };

    // ステータス表示設定
    const statusLabels: Record<string, { label: string, badgeClass: string }> = {
        recruiting: { label: '🕒 募集中', badgeClass: 'bg-blue-50 text-blue-700' },
        matched: { label: '✓ 確定済み', badgeClass: 'bg-green-50 text-green-700' },
        in_progress: { label: '🚗 進行中', badgeClass: 'bg-amber-50 text-amber-700' },
        completed: { label: '🏁 完了', badgeClass: 'bg-gray-100 text-gray-700' },
        cancelled: { label: '❌ 中止', badgeClass: 'bg-red-50 text-red-700' },
    };

    const formattedDate = new Date(departureTime).toLocaleString('ja-JP', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });

    const currentStatus = statusLabels[status] || { label: status, badgeClass: 'bg-gray-100 text-gray-600' };

    return (
        <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100 relative">
            {/* 削除中のオーバーレイ（簡易） */}
            {isDeleting && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-20 rounded-2xl">
                    <Loader2 className="animate-spin text-red-500" />
                </div>
            )}

            {/* ヘッダー部分 */}
            <div className="flex justify-between items-center mb-4">
                <div className={`px-3 py-1 rounded-full text-[11px] font-bold ${currentStatus.badgeClass}`}>
                    {currentStatus.label}
                </div>
                <div className="flex gap-4">
                    <button onClick={handleEditClick} className="text-sm font-bold text-blue-400 hover:text-blue-600">
                        編集
                    </button>
                    <button 
                        onClick={handleDeleteClick} 
                        disabled={isDeleting}
                        className="text-sm font-bold text-red-400 hover:text-red-600 disabled:text-gray-300"
                    >
                        消去
                    </button>
                </div>
            </div>

            {/* ルート情報 */}
            <div className="flex flex-col gap-3 mb-4 relative ml-1 text-left">
                <div className="absolute left-[5px] top-[14px] bottom-[14px] w-[1px] bg-gray-200" />
                <div className="flex items-start gap-3 z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1 border-2 border-white shadow-sm" />
                    <div>
                        <span className="text-[10px] text-gray-400 block leading-none mb-1">出発地</span>
                        <span className="text-sm font-bold text-gray-800">{departure}</span>
                    </div>
                </div>
                <div className="flex items-start gap-3 z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1 border-2 border-white shadow-sm" />
                    <div>
                        <span className="text-[10px] text-gray-400 block leading-none mb-1">目的地</span>
                        <span className="text-sm font-bold text-gray-800">{destination}</span>
                    </div>
                </div>
            </div>

            {/* 詳細情報 */}
            <div className="flex items-center justify-between text-[12px] text-gray-500 mb-4 pb-4 border-b border-gray-50 px-1">
                <div className="flex items-center gap-1"><Calendar size={14} className="text-gray-300" /><span>{formattedDate}</span></div>
                <div className="flex items-center gap-1 font-bold text-green-600 text-sm"><span>¥{fee.toLocaleString()}</span></div>
                <div className="flex items-center gap-1"><Users size={14} className="text-gray-300" /><span>{currentPassengers}/{capacity}名</span></div>
            </div>

            {/* 同乗者情報 */}
            {status === 'matched' && approvedPassengers.length > 0 && (
                <div className="mb-4 text-left">
                    <p className="text-[10px] font-bold text-gray-400 mb-2 ml-1 uppercase">承認済み同乗者</p>
                    <div className="space-y-2">
                        {approvedPassengers.map((passenger) => (
                            <div key={passenger.userId} className="flex items-center justify-between bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">
                                        {passenger.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-700">{passenger.name}</div>
                                        <div className="text-[10px] text-gray-400 font-medium">{passenger.passengerCount}名で同乗</div>
                                    </div>
                                </div>
                                <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
                                    <MessageCircle size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button onClick={handleDetailClick} className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-100 transition-all active:scale-[0.98] flex items-center justify-center gap-1">
                詳細を見る <ChevronRight size={16} />
            </button>
        </div>
    );
}

// % End