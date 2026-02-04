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
import { getApiUrl } from '@/config/api';

type Status = 'all' | 'preparing' | 'shipped' | 'delivered';

type PointHistory = {
  id: string;
  title: string;
  date: string;
  point: number;
  type: 'use'; 
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
        const response = await fetch(getApiUrl('/api/points/orders'), {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) return;
          throw new Error('Fetch failed');
        }
        
        const data = await response.json();
        const mappedOrders: PointHistory[] = data.orders.map((order: any) => ({
          id: order.id,
          title: order.productName,
          date: order.orderDate,
          point: -order.points,
          type: 'use',
          status: order.status === 'pending' ? 'preparing' : order.status,
        }));

        setHistories(mappedOrders);
      } catch (err) {
        console.error('注文履歴の取得に失敗しました:', err);
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
    /* ★ 背景は横いっぱい、コンテンツは中央寄せ */
    <div className="w-full min-h-screen bg-[#F8F9FA] flex flex-col items-center">
      
      {/* ★ ヘッダー：白背景は横いっぱい、中身は max-w-2xl */}
      <header className="w-full bg-white sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-bold text-lg text-gray-800">交換履歴</h1>
        </div>
      </header>

      {/* ★ メインコンテンツ：max-w-2xl で中央寄せ */}
      <div className="w-full max-w-2xl min-h-screen flex flex-col relative overflow-y-auto">
        
        {/* タブ：ボーダーを削除し、適切な高さと文字サイズに調整 */}
        <div className="px-4 py-3 bg-white sticky top-0 z-10">
          <div className="flex bg-gray-100 rounded-2xl font-bold overflow-hidden p-1.5">
            {[
              { key: 'all', label: 'すべて' },
              { key: 'preparing', label: '準備中' },
              { key: 'shipped', label: '発送済み' },
              { key: 'delivered', label: '配達済み' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as Status)}
                className={`flex-1 py-2.5 rounded-xl text-sm transition-all border-none ${
                  tab === t.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 履歴一覧：カードサイズとフォントを適切に大きく */}
        <main className="p-5 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="animate-spin text-blue-500" size={36} />
              <p className="text-sm text-gray-400 font-medium">履歴を読み込み中...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 text-red-500 gap-3">
              <AlertCircle size={36} />
              <p className="text-sm font-bold">データの取得に失敗しました</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[32px] shadow-sm">
               <p className="text-gray-400 text-sm font-medium">該当する履歴がありません</p>
            </div>
          ) : (
            filtered.map((h) => (
              <div
                key={h.id}
                className="bg-white rounded-[24px] p-5 shadow-sm flex justify-between items-center transition-all active:scale-[0.98] border-none"
              >
                <div className="space-y-1.5">
                  <p className="text-base font-bold text-gray-800">{h.title}</p>
                  <p className="text-xs text-gray-400">{h.date}</p>

                  <div className="flex items-center gap-1.5 text-xs mt-2 font-bold">
                    {h.status === 'preparing' && (
                      <span className="flex items-center gap-1 text-orange-400">
                        <Package size={14} /> 準備中
                      </span>
                    )}
                    {h.status === 'shipped' && (
                      <span className="flex items-center gap-1 text-blue-400">
                        <Truck size={14} /> 発送済み
                      </span>
                    )}
                    {h.status === 'delivered' && (
                      <span className="flex items-center gap-1 text-[#00B049]">
                        <CheckCircle size={14} /> 配達済み
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 font-black text-red-500 text-lg">
                  <ArrowDownLeft size={18} strokeWidth={3} />
                  {Math.abs(h.point).toLocaleString()}
                  <span className="text-xs ml-0.5 font-bold">pt</span>
                </div>
              </div>
            ))
          )}
        </main>

        <div className="h-20" />
      </div>
    </div>
  );
}