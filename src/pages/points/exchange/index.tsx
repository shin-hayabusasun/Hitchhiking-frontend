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
  const [userPoints, setUserPoints] = useState<number | null>(null); // 所持ポイント用
  const [loading, setLoading] = useState(true);
  const [isExchanging, setIsExchanging] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    initPage();
  }, []);

  // 画面初期化（商品一覧とユーザーポイントを両方取得）
  const initPage = async () => {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchUserBalance()]);
    setLoading(false);
  };

  // 商品一覧取得
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://54.165.126.189:8000/api/points/products', {
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

  // ユーザーのポイント残高取得
  const fetchUserBalance = async () => {
    try {
      const response = await fetch('http://54.165.126.189:8000/api/point/remain', {
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

  // --- 商品交換APIを呼び出す関数 ---
  const handleExchange = async (productId: string, productName: string, cost: number) => {
    // クライアント側でも簡易チェック
    if (userPoints !== null && userPoints < cost) {
      alert('ポイントが不足しています');
      return;
    }

    if (!confirm(`${productName} (${cost}pt) を交換しますか？`)) return;

    setIsExchanging(true);
    try {
      const response = await fetch('http://54.165.126.189:8000/api/points/exchange', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        // productIdはDBに合わせて数値型に変換して送信
        body: JSON.stringify({ product_id: parseInt(productId) }), 
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        alert('交換が完了しました！');
        // 在庫数と所持ポイントを最新にするため再取得
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] aspect-[9/19] bg-gray-100 shadow-2xl border-[8px] border-white ring-1 ring-gray-200 overflow-y-auto">
        
        <header className="sticky top-0 z-20 bg-white border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-1 hover:bg-gray-100 rounded-full">
              <ArrowLeft />
            </button>
            <h1 className="font-bold text-lg text-gray-800">商品交換</h1>
          </div>
        </header>

        {/* 所持ポイント表示エリア */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
          <div className="flex items-center gap-2 opacity-80 mb-1">
            <Wallet size={14} />
            <span className="text-xs font-medium">現在の所持ポイント</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black">
              {userPoints !== null ? userPoints.toLocaleString() : '---'}
            </span>
            <span className="text-xs opacity-80">pt</span>
          </div>
        </div>

        <div className="p-4 bg-gray-50/50 border-b">
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm border border-gray-100">
            <Search size={18} className="text-gray-400" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="ほしい商品を検索"
              className="w-full outline-none text-sm bg-transparent"
            />
          </div>
        </div>

        <main className="p-4 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <Loader2 className="animate-spin" size={32} />
              <p className="text-sm">ロード中...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-red-500 gap-2 text-center">
              <AlertCircle size={32} />
              <p className="text-sm">データの取得に失敗しました</p>
            </div>
          ) : filtered.map((p) => (
            <div
              key={p.id}
              className={`bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center border transition-all ${
                p.stock === 0 ? 'opacity-60 grayscale' : 'hover:border-blue-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  p.stock === 0 ? 'bg-gray-200' : 'bg-orange-50'
                }`}>
                  <Gift className={p.stock === 0 ? 'text-gray-400' : 'text-orange-500'} size={24} />
                </div>
                <div className="max-w-[150px]">
                  <p className="text-sm font-bold text-gray-800 truncate">{p.name}</p>
                  <p className="text-[10px] text-gray-400 line-clamp-1">{p.description}</p>
                  <p className={`text-[10px] mt-1 font-medium ${p.stock > 0 ? 'text-blue-500' : 'text-red-500'}`}>
                    {p.stock > 0 ? `残り ${p.stock} 個` : '在庫切れ'}
                  </p>
                </div>
              </div>

              <div className="text-right border-l pl-3">
                <p className={`font-extrabold ${userPoints !== null && userPoints < p.points ? 'text-red-400' : 'text-emerald-600'}`}>
                  {p.points.toLocaleString()} <span className="text-[10px]">pt</span>
                </p>
                <button
                  disabled={p.stock === 0 || isExchanging || (userPoints !== null && userPoints < p.points)}
                  onClick={() => handleExchange(p.id, p.name, p.points)}
                  className={`mt-2 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    p.stock > 0 && (userPoints === null || userPoints >= p.points)
                      ? 'bg-blue-600 text-white active:scale-95' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isExchanging ? '...' : p.stock > 0 ? '交換する' : '品切れ'}
                </button>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}