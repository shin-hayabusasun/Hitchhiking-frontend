import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Package,
  Truck,
  CheckCircle,
} from 'lucide-react';

type Status = 'all' | 'preparing' | 'shipped' | 'delivered';

type PointHistory = {
  id: number;
  title: string;
  date: string;
  point: number;
  type: 'earn' | 'use';
  status?: 'preparing' | 'shipped' | 'delivered';
};

const histories: PointHistory[] = [
  {
    id: 1,
    title: 'ドライブ完了',
    date: '2025-01-15',
    point: 500,
    type: 'earn',
  },
  {
    id: 2,
    title: 'ギフト券交換',
    date: '2025-01-12',
    point: -1000,
    type: 'use',
    status: 'preparing',
  },
  {
    id: 3,
    title: 'マグカップ交換',
    date: '2025-01-10',
    point: -800,
    type: 'use',
    status: 'shipped',
  },
  {
    id: 4,
    title: 'レビュー投稿',
    date: '2025-01-08',
    point: 200,
    type: 'earn',
  },
  {
    id: 5,
    title: 'Tシャツ交換',
    date: '2025-01-05',
    point: -1500,
    type: 'use',
    status: 'delivered',
  },
];

export default function PointHistoryPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Status>('all');

  const filtered = histories.filter((h) => {
    if (tab === 'all') return true;
    return h.status === tab;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* スマホ外枠 */}
      <div
        className="w-full max-w-[390px] aspect-[9/19]
        bg-gray-100 shadow-2xl border-[8px] border-white
        ring-1 ring-gray-200 overflow-y-auto"
      >
        {/* ヘッダー */}
        <header className="bg-white px-4 py-3 flex items-center gap-3 border-b">
          <button onClick={() => router.back()}>
            <ArrowLeft />
          </button>
          <h1 className="font-bold text-lg">ポイント履歴</h1>
        </header>

        {/* タブ */}
        <div className="px-3 py-3 bg-white border-b">
          <div className="flex bg-gray-200 rounded-full text-xs font-medium overflow-hidden">
            {[
              { key: 'all', label: 'すべて' },
              { key: 'preparing', label: '準備中' },
              { key: 'shipped', label: '発送済み' },
              { key: 'delivered', label: '配達済み' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as Status)}
                className={`flex-1 py-2 ${
                  tab === t.key
                    ? 'bg-white text-blue-600 font-bold'
                    : 'text-gray-500'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 履歴一覧 */}
        <main className="p-4 space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-10">
              該当する履歴がありません
            </p>
          ) : (
            filtered.map((h) => (
              <div
                key={h.id}
                className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{h.title}</p>
                  <p className="text-xs text-gray-400">{h.date}</p>

                  {h.status && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      {h.status === 'preparing' && (
                        <>
                          <Package size={12} /> 準備中
                        </>
                      )}
                      {h.status === 'shipped' && (
                        <>
                          <Truck size={12} /> 発送済み
                        </>
                      )}
                      {h.status === 'delivered' && (
                        <>
                          <CheckCircle size={12} /> 配達済み
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div
                  className={`flex items-center gap-1 font-bold ${
                    h.type === 'earn'
                      ? 'text-green-600'
                      : 'text-red-500'
                  }`}
                >
                  {h.type === 'earn' ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownLeft size={16} />
                  )}
                  {Math.abs(h.point)} pt
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
