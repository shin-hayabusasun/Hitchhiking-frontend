// src/components/driver/DriveStatusCard.tsx

import React from 'react';
import {
  MapPin,
  Calendar,
  Star,
  MessageCircle,
  CheckCircle,
  JapaneseYen,
} from 'lucide-react';

export type DriveStatus = 'progress' | 'completion';

type Props = {
  status: DriveStatus;
  from: string;
  to: string;
  datetime: string;
  price: number;
  driver: {
    name: string;
    rating: number;
    driveCount: number;
  };
  onChat?: () => void;
  onComplete?: () => void;
  onReview?: () => void;
};

export default function DriveStatusCard({
  status,
  from,
  to,
  datetime,
  price,
  driver,
  onChat,
  onComplete,
  onReview,
}: Props) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
      {/* ステータス・金額 */}
      <div className="flex justify-between items-center">
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${
            status === 'progress'
              ? 'bg-blue-100 text-blue-600'
              : 'bg-green-100 text-green-600'
          }`}
        >
          {status === 'progress' ? '進行中' : '完了'}
        </span>

        <span className="flex items-center gap-1 font-bold text-green-600">
          <JapaneseYen size={14} />
          {price.toLocaleString()}
        </span>
      </div>

      {/* ルート */}
      <div className="space-y-1 text-sm font-medium">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-green-600" />
          {from}
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-red-500" />
          {to}
        </div>
      </div>

      {/* 日時 */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Calendar size={16} />
        {datetime}
      </div>

      {/* ドライバー */}
      <div className="flex items-center justify-between border-t pt-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {driver.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium">{driver.name}</p>
            <p className="flex items-center gap-1 text-xs text-gray-500">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              {driver.rating}（{driver.driveCount}回）
            </p>
          </div>
        </div>
      </div>

      {/* アクション */}
      {status === 'progress' && (
        <div className="flex gap-3 pt-2">
          <button
            onClick={onChat}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border py-2 text-sm font-medium"
          >
            <MessageCircle size={16} />
            チャット
          </button>
          <button
            onClick={onComplete}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white py-2 text-sm font-bold"
          >
            <CheckCircle size={16} />
            完了
          </button>
        </div>
      )}

      {status === 'completion' && (
        <button
          onClick={onReview}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-yellow-400 text-white py-2 text-sm font-bold"
        >
          <Star size={16} className="fill-white" />
          評価する
        </button>
      )}
    </div>
  );
}
