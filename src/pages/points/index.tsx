import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Wallet, Gift, ShoppingBag, Loader2, Banknote } from 'lucide-react';
import { getApiUrl } from '@/config/api';

export default function PointsHomePage() {
  const router = useRouter();
  
  const [data, setData] = useState<{ totalBalance: number; sales: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await fetch(getApiUrl('/api/point/remain'), {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error('Failed to fetch points:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] h-[800px] bg-white shadow-2xl border-[8px] border-white ring-1 ring-gray-200 overflow-y-auto rounded-[3rem]">
        
        {/* ヘッダー */}
        <header className="bg-white px-4 py-4 flex items-center gap-3 border-b sticky top-0 z-10">
          <button onClick={() => router.back()} className="p-1 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-bold text-lg text-gray-800">売上・ポイント</h1>
        </header>

        <main className="p-5 space-y-6">
          {/* メインカード: 決済売上をメインに配置 */}
          <section className="bg-gradient-to-br from-indigo-600 to-purple-500 rounded-3xl p-6 shadow-lg text-white">
            <div className="flex items-center gap-2 mb-2 opacity-90">
              <Banknote size={18} />
              <span className="text-sm font-medium">決済売上 (Sales)</span>
            </div>
            <div className="mb-8">
              <span className="text-xl font-bold mr-1">¥</span>
              <span className="text-5xl font-extrabold">
                {data?.sales.toLocaleString() ?? 0}
              </span>
            </div>

            {/* 保有ポイント表示エリア (サブに配置) */}
            <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-4 flex justify-between items-center">
              <div>
                <p className="text-xs opacity-70 mb-1 font-medium text-white">現在の保有ポイント</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-xl font-bold">{data?.totalBalance.toLocaleString() ?? 0}</p>
                  <span className="text-[10px] opacity-80">pt</span>
                </div>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <Wallet size={20} className="text-white" />
              </div>
            </div>
          </section>

          {/* ナビゲーション */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/points/exchange')}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col items-center gap-2 hover:bg-gray-50 transition-all active:scale-95"
            >
              <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                <Gift size={24} />
              </div>
              <span className="font-bold text-sm text-gray-700">商品交換</span>
            </button>

            <button
              onClick={() => router.push('/points/history')}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col items-center gap-2 hover:bg-gray-50 transition-all active:scale-95"
            >
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <ShoppingBag size={24} />
              </div>
              <span className="font-bold text-sm text-gray-700">交換履歴</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}