import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  ArrowLeft,
  ArrowDownLeft,
  Package,
  Truck,
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';

// APIから返ってくるデータの型
type OrderFromAPI = {
  id: string;
  productName: string;
  points: number;
  status: 'pending' | 'shipped' | 'delivered';
  orderDate: string;
};

type Status = 'all' | 'preparing' | 'shipped' | 'delivered';

// コンポーネント内で扱う型
type PointHistory = {
  id: string;
  title: string;
  date: string;
  point: number;
  type: 'use'; // 今回は注文履歴（交換）なので'use'固定
  status: 'preparing' | 'shipped' | 'delivered';
};

export default function PointHistoryPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Status>('all');
  const [histories, setHistories] = useState<PointHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/points/orders');
        if (!response.ok) throw new Error('Fetch failed');
        
        const data = await response.json();
        
        // APIのデータをコンポーネントの形式に変換
        const mappedOrders: PointHistory[] = data.orders.map((order: OrderFromAPI) => ({
          id: order.id,
          title: order.productName,
          date: order.orderDate,
          point: -order.points, // 使用ポイントなのでマイナスに
          type: 'use',
          // APIの 'pending' を 'preparing' にマッピング
          status: order.status === 'pending' ? 'preparing' : order.status,
        }));

        setHistories(mappedOrders);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filtered = histories.filter((h) => {
    if (tab === 'all') return true;
    return h.status === tab;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] aspect-[9/19] bg-gray-100 shadow-2xl border-[8px] border-white ring-1 ring-gray-200 overflow-y-auto">
        {/* ヘッダー */}
        <header className="bg-white px-4 py-3 flex items-center gap-3 border-b sticky top-0 z-10">
          <button onClick={() => router.back()} className="p-1 hover:bg-gray-100 rounded-full">
            <ArrowLeft />
          </button>
          <h1 className="font-bold text-lg">交換履歴</h1>
        </header>

        {/* タブ */}
        <div className="px-3 py-3 bg-white border-b sticky top-[53px] z-10">
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
                className={`flex-1 py-2 transition-colors ${
                  tab === t.key
                    ? 'bg-white text-blue-600 font-bold shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 履歴一覧 */}
        <main className="p-4 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <Loader2 className="animate-spin text-blue-500" size={32} />
              <p className="text-sm text-gray-500">履歴を読み込み中...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-red-500 gap-2">
              <AlertCircle size={32} />
              <p className="text-sm">データの取得に失敗しました</p>
            </div>
          ) : filtered.length === 0 ? (
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
                  <p className="text-sm font-bold text-gray-800">{h.title}</p>
                  <p className="text-xs text-gray-400">{h.date}</p>

                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    {h.status === 'preparing' && (
                      <span className="flex items-center gap-1 text-orange-500">
                        <Package size={12} /> 準備中
                      </span>
                    )}
                    {h.status === 'shipped' && (
                      <span className="flex items-center gap-1 text-blue-500">
                        <Truck size={12} /> 発送済み
                      </span>
                    )}
                    {h.status === 'delivered' && (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle size={12} /> 配達済み
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 font-bold text-red-500">
                  <ArrowDownLeft size={16} />
                  {Math.abs(h.point).toLocaleString()} pt
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}