// % Start(黒星朋来)
// ポイントホーム画面: 現在の保有ポイント数を表示し、ポイント履歴画面や商品交換画面へのナビゲーションを提供する画面

import React from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Coins, List, Gift } from 'lucide-react';

export default function PointsHomePage() {
  const router = useRouter();
  const currentPoint = 2450;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* スマホ外枠 */}
      <div
        className="w-full max-w-[390px] aspect-[9/19]
        bg-gray-100 shadow-2xl border-[8px] border-white
        ring-1 ring-gray-200 overflow-y-auto"
      >
        {/* ヘッダー */}
        <header className="bg-white px-4 py-3 flex items-center gap-3 border-b sticky top-0 z-10">
          <button onClick={() => router.back()}>
            <ArrowLeft />
          </button>
          <h1 className="font-bold text-lg">ポイント</h1>
        </header>

        <main className="p-6 space-y-6">
          {/* 保有ポイント */}
          <section className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <Coins size={40} className="mx-auto text-yellow-500 mb-2" />
            <p className="text-sm text-gray-500">現在のポイント</p>
            <p className="text-3xl font-bold text-green-600">
              {currentPoint.toLocaleString()} pt
            </p>
          </section>

          {/* ナビゲーション */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/points/history')}
              className="w-full bg-white rounded-xl p-4 shadow-sm
              flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                <List />
                <span className="font-medium">ポイント履歴</span>
              </div>
              <span className="text-gray-400">›</span>
            </button>

            <button
              onClick={() => router.push('/points/exchange')}
              className="w-full bg-white rounded-xl p-4 shadow-sm
              flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                <Gift />
                <span className="font-medium">ポイント交換</span>
              </div>
              <span className="text-gray-400">›</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
