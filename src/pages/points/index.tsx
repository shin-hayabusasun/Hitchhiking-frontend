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
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    /* ★ 背景を w-full で画面一杯に広げる */
    <div className="w-full min-h-screen bg-[#F8F9FA] flex flex-col items-center">
      
      {/* ★ ヘッダー：白背景を横いっぱいに広げ、ボーダーなし、高さを適正化 */}
      <header className="w-full bg-white sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-bold text-lg text-gray-800">売上・ポイント</h1>
        </div>
      </header>

      {/* ★ コンテンツエリア：max-w-2xl、枠線なし、適切な余白 */}
      <div className="w-full max-w-2xl min-h-screen flex flex-col relative overflow-y-auto">
        
        <main className="p-5 space-y-5 flex-1">
          {/* メインカード: インパクトのある適切なフォントサイズに変更 */}
          <section className="bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-[32px] p-7 shadow-xl shadow-indigo-100 text-white transition-all">
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <Banknote size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Total Sales</span>
            </div>
            <div className="mb-8 flex items-baseline gap-2">
              <span className="text-2xl font-bold">¥</span>
              <span className="text-5xl font-black tracking-tight">
                {data?.sales.toLocaleString() ?? 0}
              </span>
            </div>

            {/* 保有ポイント表示エリア: サイズを拡大し視認性を向上 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 flex justify-between items-center transition-all hover:bg-white/15">
              <div>
                <p className="text-[10px] opacity-70 mb-1 font-black uppercase tracking-wider">Points Balance</p>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-2xl font-black">{data?.totalBalance.toLocaleString() ?? 0}</p>
                  <span className="text-xs font-bold opacity-80">pt</span>
                </div>
              </div>
              <div className="bg-white/20 p-3 rounded-2xl">
                <Wallet size={24} className="text-white" />
              </div>
            </div>
          </section>

          {/* ナビゲーション：しっかり押せるサイズ(p-7)と見やすい文字(text-sm) */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/points/exchange')}
              className="bg-white rounded-[28px] p-7 shadow-sm flex flex-col items-center gap-3 hover:shadow-md transition-all active:scale-[0.97] group border-none"
            >
              {/* 指定色 #00B049 を適用 */}
              <div className="bg-[#00B049]/10 p-5 rounded-2xl text-[#00B049] group-hover:scale-110 transition-transform">
                <Gift size={32} />
              </div>
              <span className="font-bold text-sm text-gray-700">商品交換</span>
            </button>

            <button
              onClick={() => router.push('/points/history')}
              className="bg-white rounded-[28px] p-7 shadow-sm flex flex-col items-center gap-3 hover:shadow-md transition-all active:scale-[0.97] group border-none"
            >
              <div className="bg-blue-50 p-5 rounded-2xl text-blue-500 group-hover:scale-110 transition-transform">
                <ShoppingBag size={32} />
              </div>
              <span className="font-bold text-sm text-gray-700">交換履歴</span>
            </button>
          </div>
        </main>

        <div className="h-20" />
      </div>
    </div>
  );
}