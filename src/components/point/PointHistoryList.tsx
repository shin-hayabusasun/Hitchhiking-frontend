// src/components/point/PointHistoryList.tsx

import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export type PointHistoryType = 'earn' | 'use';

export type PointHistory = {
  id: number;
  type: PointHistoryType;
  title: string;
  date: string;
  point: number;
};

type Props = {
  histories: PointHistory[];
};

export default function PointHistoryList({ histories }: Props) {
  return (
    <div className="space-y-3">
      {histories.map((h) => {
        const isEarn = h.type === 'earn';

        return (
          <div
            key={h.id}
            className="bg-white rounded-xl px-4 py-3 shadow-sm flex items-center justify-between"
          >
            {/* 左側：アイコン + 内容 */}
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  isEarn ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}
              >
                {isEarn ? (
                  <ArrowUpRight size={18} />
                ) : (
                  <ArrowDownLeft size={18} />
                )}
              </div>

              <div>
                <p className="text-sm font-medium">{h.title}</p>
                <p className="text-xs text-gray-500">{h.date}</p>
              </div>
            </div>

            {/* 右側：ポイント */}
            <div
              className={`text-sm font-bold ${
                isEarn ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isEarn ? '+' : '-'}
              {h.point.toLocaleString()} pt
            </div>
          </div>
        );
      })}
    </div>
  );
}
