import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  ArrowLeft,
  Search,
  Gift,
} from 'lucide-react';

type Product = {
  id: number;
  name: string;
  category: string;
  point: number;
};

const products: Product[] = [
  { id: 1, name: 'Amazonギフト券 500円', category: 'ギフト券', point: 500 },
  { id: 2, name: 'Amazonギフト券 1000円', category: 'ギフト券', point: 1000 },
  { id: 3, name: 'スターバックス チケット', category: '飲食', point: 700 },
  { id: 4, name: 'コンビニ商品引換券', category: '飲食', point: 300 },
  { id: 5, name: 'オリジナルグッズ', category: 'グッズ', point: 1200 },
];

const categories = ['すべて', 'ギフト券', '飲食', 'グッズ'];

export default function PointExchangePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('すべて');

  const filtered = products.filter((p) => {
    const matchKeyword = p.name.includes(keyword);
    const matchCategory =
      category === 'すべて' || p.category === category;
    return matchKeyword && matchCategory;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* スマホ外枠 */}
      <div className="w-full max-w-[390px] aspect-[9/19] bg-gray-100 shadow-2xl border-[8px] border-white ring-1 ring-gray-200 overflow-y-auto">

        {/* ヘッダー */}
        <header className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()}>
            <ArrowLeft />
          </button>
          <h1 className="font-bold text-lg">ポイント交換</h1>
        </header>

        {/* 検索 */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm">
            <Search size={18} className="text-gray-400" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="商品名で検索"
              className="w-full outline-none text-sm"
            />
          </div>

          {/* カテゴリ */}
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
                  category === c
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 商品一覧 */}
        <main className="px-4 pb-6 space-y-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Gift className="text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-gray-400">
                    {p.category}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-green-600">
                  {p.point.toLocaleString()} pt
                </p>
                <button
                  onClick={() =>
                    alert(`${p.name} を交換しました`)
                  }
                  className="mt-1 text-xs text-blue-600 font-medium"
                >
                  交換する
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="text-center text-sm text-gray-500">
              該当する商品がありません
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
