import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  ArrowLeft,
  Search,
  Gift,
  Loader2,
  AlertCircle,
  Wallet
} from 'lucide-react';
import { getApiUrl } from '@/config/api';

type Product = {
  id: string;
  name: string;
  description: string;
  points: number;
  stock: number;
  image?: string;
};

export default function PointExchangePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExchanging, setIsExchanging] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    initPage();
  }, []);

  const initPage = async () => {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchUserBalance()]);
    setLoading(false);
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(getApiUrl('/api/points/products'), {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Fetch products error:', err);
      setError(true);
    }
  };

  const fetchUserBalance = async () => {
    try {
      const response = await fetch(getApiUrl('/api/point/remain'), {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUserPoints(data.totalBalance);
      }
    } catch (err) {
      console.error('Fetch balance error:', err);
    }
  };

  const handleExchange = async (productId: string, productName: string, cost: number) => {
    if (userPoints !== null && userPoints < cost) {
      alert('ポイントが不足しています');
      return;
    }

    if (!confirm(`${productName} (${cost}pt) を交換しますか？`)) return;

    setIsExchanging(true);
    try {
      const response = await fetch(getApiUrl('/api/points/exchange'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: parseInt(productId) }), 
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        alert('交換が完了しました！');
        await initPage();
      } else {
        alert(`エラー: ${result.detail || '交換に失敗しました'}`);
      }
    } catch (err) {
      console.error('Exchange error:', err);
      alert('通信エラーが発生しました');
    } finally {
      setIsExchanging(false);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] font-sans text-gray-800">
      
      {/* ★ ヘッダー：白背景は横いっぱい、ボーダーなし、高さを適正化 */}
      <header className="sticky top-0 z-20 bg-white">
        {/* ★ コンテンツのみ max-w-2xl で中央寄せ */}
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <h1 className="font-bold text-lg text-gray-800">商品交換</h1>
          </div>
        </div>
      </header>

      {/* ★ メインコンテンツ：max-w-2xl で中央寄せ */}
      <main className="max-w-2xl mx-auto min-h-full">
        
        {/* 所持ポイント表示エリア：適切な余白とフォントサイズ */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-7 text-white md:rounded-b-3xl shadow-md">
          <div className="flex items-center gap-2 opacity-80 mb-2">
            <Wallet size={16} />
            <span className="text-xs font-semibold tracking-wide uppercase">現在の所持ポイント</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-black tracking-tight">
              {userPoints !== null ? userPoints.toLocaleString() : '---'}
            </span>
            <span className="text-sm font-bold opacity-90">pt</span>
          </div>
        </div>

        {/* 検索バー：適切なサイズ感 */}
        <div className="p-4">
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm">
            <Search size={20} className="text-gray-400" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="ほしい商品を検索"
              className="w-full outline-none text-sm bg-transparent"
            />
          </div>
        </div>

        {/* 商品リストエリア：適切なカードサイズ */}
        <div className="px-4 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
              <Loader2 className="animate-spin" size={32} />
              <p className="text-sm">ロード中...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-red-500 gap-3 text-center">
              <AlertCircle size={32} />
              <p className="text-sm">データの取得に失敗しました</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Gift size={48} className="opacity-20 mb-3" />
              <p className="text-sm font-medium">該当する商品が見つかりません</p>
            </div>
          ) : (
            filtered.map((p) => (
              <div
                key={p.id}
                className={`bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center transition-all border-none ${
                  p.stock === 0 ? 'opacity-60 grayscale' : 'hover:shadow-md active:scale-[0.99]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                    p.stock === 0 ? 'bg-gray-100' : 'bg-orange-50'
                  }`}>
                    <Gift className={p.stock === 0 ? 'text-gray-400' : 'text-orange-500'} size={24} />
                  </div>
                  <div className="max-w-[200px]">
                    <p className="text-sm font-bold text-gray-800 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{p.description}</p>
                    <p className={`text-xs mt-1.5 font-bold ${p.stock > 0 ? 'text-blue-500' : 'text-red-500'}`}>
                      {p.stock > 0 ? `在庫：残り ${p.stock}` : '在庫切れ'}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className={`text-lg font-black ${userPoints !== null && userPoints < p.points ? 'text-red-400' : 'text-[#00B049]'}`}>
                    {p.points.toLocaleString()} <span className="text-[10px]">pt</span>
                  </p>
                  <button
                    disabled={p.stock === 0 || isExchanging || (userPoints !== null && userPoints < p.points)}
                    onClick={() => handleExchange(p.id, p.name, p.points)}
                    className={`mt-2 px-5 py-2 rounded-xl text-xs font-black transition-all border-none ${
                      p.stock > 0 && (userPoints === null || userPoints >= p.points)
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isExchanging ? '...' : p.stock > 0 ? '交換' : '品切れ'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="h-10" />
      </main>
    </div>
  );
}