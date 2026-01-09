import { MapPin, Calendar, Clock, ChevronRight, User } from 'lucide-react';

// ドライブのステータス定義（必要に応じて追加・変更してください）
export type DriveStatus = 
  | 'recruiting'    // 募集中
  | 'applied'       // 申請中/承認待ち
  | 'approved'      // 確定/進行中
  | 'completed'     // 完了
  | 'cancelled';    // キャンセル

interface DriveCardProps {
  /** ドライブID（クリック時の識別に利用） */
  id: string;
  /** ステータス */
  status: DriveStatus;
  /** 日付表記 (例: "2024/01/01(月)") */
  date: string;
  /** 時間表記 (例: "10:00") */
  time: string;
  /** 出発地 */
  startLocation: string;
  /** 到着地 */
  endLocation: string;
  /** 金額 (円) */
  price: number;
  /** 相手ユーザーの名前（同乗者から見れば運転者、運転者から見れば同乗者） */
  partnerName?: string;
  /** 相手ユーザーのアイコン画像URL (未指定ならデフォルトアイコン) */
  partnerIconUrl?: string;
  /** カードクリック時の動作 */
  onClick?: (id: string) => void;
}

/**
 * ドライブ情報カードコンポーネント
 * * 募集一覧やドライブ管理画面のリストアイテムとして使用
 */
export function DriveCard({
  id,
  status,
  date,
  time,
  startLocation,
  endLocation,
  price,
  partnerName,
  partnerIconUrl,
  onClick,
}: DriveCardProps) {

  // ステータスに応じたバッジの色とテキストの定義
  const getStatusBadge = (status: DriveStatus) => {
    switch (status) {
      case 'recruiting':
        return { text: '募集中', className: 'bg-blue-100 text-blue-700' };
      case 'applied':
        return { text: '申請中', className: 'bg-orange-100 text-orange-700' };
      case 'approved':
        return { text: '進行中', className: 'bg-green-100 text-green-700' };
      case 'completed':
        return { text: '完了', className: 'bg-gray-100 text-gray-600' };
      case 'cancelled':
        return { text: '中止', className: 'bg-red-50 text-red-500' };
      default:
        return { text: '-', className: 'bg-gray-100 text-gray-500' };
    }
  };

  const badge = getStatusBadge(status);

  return (
    <div 
      onClick={() => onClick?.(id)}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer overflow-hidden"
    >
      <div className="p-4 space-y-3">
        
        {/* 上段：ステータスバッジと日付 */}
        <div className="flex justify-between items-start">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badge.className}`}>
            {badge.text}
          </span>
          
          <div className="flex items-center text-gray-500 text-sm font-medium">
            <Calendar size={14} className="mr-1" />
            {date}
            <span className="mx-1 text-gray-300">|</span>
            <Clock size={14} className="mr-1" />
            {time}
          </div>
        </div>

        {/* 中段：ルート情報（出発地 -> 到着地） */}
        <div className="relative pl-4 space-y-4 py-1">
          {/* 左側のタイムライン線 */}
          <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-gray-100" />

          {/* 出発地 */}
          <div className="relative flex items-start">
            <div className="absolute -left-4 mt-1.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white ring-1 ring-green-100" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">{startLocation}</p>
            </div>
          </div>

          {/* 到着地 */}
          <div className="relative flex items-start">
            <div className="absolute -left-4 mt-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white ring-1 ring-red-100" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">{endLocation}</p>
            </div>
          </div>
        </div>

        {/* 下段：ユーザー情報と金額 */}
        <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
          
          {/* 相手ユーザー情報 */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
              {partnerIconUrl ? (
                <img src={partnerIconUrl} alt={partnerName} className="w-full h-full object-cover" />
              ) : (
                <User size={16} className="text-gray-400" />
              )}
            </div>
            <span className="text-xs text-gray-600 font-medium truncate max-w-[100px]">
              {partnerName || '未定'}
            </span>
          </div>

          {/* 金額と矢印 */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-800">
              ¥{price.toLocaleString()}
            </span>
            <ChevronRight size={18} className="text-gray-300" />
          </div>

        </div>
      </div>
    </div>
  );
}