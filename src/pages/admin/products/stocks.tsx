// // % Start(AI Assistant)
// // 在庫管理画面。在庫数確認と補充

// import { useState, useEffect } from 'react';
// import { TitleHeader } from '@/components/TitleHeader';

// interface Product {
//  id: string;
//  name: string;
//  stock: number;
//  alertThreshold: number;
// }

// interface StockStats {
//  totalStock: number;
//  warningCount: number;
//  totalSales: number;
// }

// export function StockManagementPage() {
//  const [products, setProducts] = useState<Product[]>([]);
//  const [stats, setStats] = useState<StockStats | null>(null);
//  const [loading, setLoading] = useState(true);
//  const [error, setError] = useState('');
//  const [replenishId, setReplenishId] = useState<string | null>(null);
//  const [replenishAmount, setReplenishAmount] = useState('');

//  useEffect(() => {
//      fetchData();
//  }, []);

//  async function fetchData() {
//      try {
//          const [productsRes, statsRes] = await Promise.all([
//              fetch('/api/admin/products', {
//                  method: 'GET',
//                  credentials: 'include',
//              }),
//              fetch('/api/admin/stocks/stats', {
//                  method: 'GET',
//                  credentials: 'include',
//              }),
//          ]);

//          const productsData = await productsRes.json();
//          const statsData = await statsRes.json();

//          if (productsRes.ok && productsData.products) {
//              setProducts(productsData.products);
//          }
//          if (statsRes.ok) {
//              setStats({
//                  totalStock: statsData.total_stock || 0,
//                  warningCount: statsData.warning_count || 0,
//                  totalSales: statsData.total_sales || 0,
//              });
//          }
//      } catch (err) {
//          setError('データの取得に失敗しました');
//      } finally {
//          setLoading(false);
//      }
//  }

//  async function handleReplenish(productId: string) {
//      const amount = Number(replenishAmount);
//      if (!amount || amount <= 0) {
//          alert('正しい数量を入力してください');
//          return;
//      }

//      try {
//          const response = await fetch(`/api/admin/products/${productId}/replenish`, {
//              method: 'POST',
//              headers: {
//                  'Content-Type': 'application/json',
//              },
//              credentials: 'include',
//              body: JSON.stringify({ amount }),
//          });

//          const data = await response.json();
//          if (response.ok) {
//              alert(`在庫を補充しました。現在庫: ${data.current_stock}`);
//              setReplenishId(null);
//              setReplenishAmount('');
//              fetchData();
//          } else {
//              alert(data.message || '補充に失敗しました');
//          }
//      } catch (err) {
//          alert('補充に失敗しました');
//      }
//  }

//  if (loading) {
//      return (
//          <div className="min-h-screen bg-gray-100">
//              <TitleHeader title="在庫管理" backPath="/admin/dashboard" />
//              <main className="p-8 text-center">
//                  <p>読み込み中...</p>
//              </main>
//          </div>
//      );
//  }

//  return (
//      <div className="min-h-screen bg-gray-100">
//          <TitleHeader title="在庫管理" backPath="/admin/dashboard" />
//          <main className="p-8">
//              <h2 className="text-2xl font-bold mb-6">在庫管理</h2>

//              {stats && (
//                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//                      <div className="bg-white p-6 rounded-lg shadow-md">
//                          <h3 className="text-lg font-semibold text-gray-600">総在庫数</h3>
//                          <p className="text-3xl font-bold text-blue-600">
//                              {stats.totalStock.toLocaleString()}
//                          </p>
//                      </div>
//                      <div className="bg-white p-6 rounded-lg shadow-md">
//                          <h3 className="text-lg font-semibold text-gray-600">在庫警告数</h3>
//                          <p className="text-3xl font-bold text-red-600">
//                              {stats.warningCount.toLocaleString()}
//                          </p>
//                      </div>
//                      <div className="bg-white p-6 rounded-lg shadow-md">
//                          <h3 className="text-lg font-semibold text-gray-600">総販売数</h3>
//                          <p className="text-3xl font-bold text-green-600">
//                              {stats.totalSales.toLocaleString()}
//                          </p>
//                      </div>
//                  </div>
//              )}

//              {error && <p className="text-red-500 mb-4">{error}</p>}

//              <div className="bg-white p-6 rounded-lg shadow-md">
//                  <h3 className="text-xl font-bold mb-4">商品在庫一覧</h3>
//                  {products.length === 0 ? (
//                      <p className="text-center text-gray-600">商品がありません</p>
//                  ) : (
//                      <div className="space-y-4">
//                          {products.map((product) => {
//                              const isLowStock = product.stock < product.alertThreshold;
//                              return (
//                                  <div
//                                      key={product.id}
//                                      className={`border rounded-lg p-4 ${
//                                          isLowStock ? 'border-red-300 bg-red-50' : ''
//                                      }`}
//                                  >
//                                      <div className="flex justify-between items-center mb-2">
//                                          <div>
//                                              <h4 className="font-bold text-lg">{product.name}</h4>
//                                              <p className="text-sm text-gray-600">
//                                                  警告閾値: {product.alertThreshold}個
//                                              </p>
//                                          </div>
//                                          <div className="text-right">
//                                              <p
//                                                  className={`text-2xl font-bold ${
//                                                      isLowStock ? 'text-red-600' : 'text-green-600'
//                                                  }`}
//                                              >
//                                                  {product.stock}個
//                                              </p>
//                                              {isLowStock && (
//                                                  <p className="text-sm text-red-600 font-semibold">
//                                                      ⚠️ 在庫不足
//                                                  </p>
//                                              )}
//                                          </div>
//                                      </div>

//                                      {replenishId === product.id ? (
//                                          <div className="mt-4 flex space-x-2">
//                                              <input
//                                                  type="number"
//                                                  className="shadow border rounded py-2 px-3 flex-1"
//                                                  value={replenishAmount}
//                                                  onChange={(e) => setReplenishAmount(e.target.value)}
//                                                  placeholder="補充数量"
//                                                  min="1"
//                                              />
//                                              <button
//                                                  onClick={() => handleReplenish(product.id)}
//                                                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//                                              >
//                                                  補充
//                                              </button>
//                                              <button
//                                                  onClick={() => {
//                                                      setReplenishId(null);
//                                                      setReplenishAmount('');
//                                                  }}
//                                                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
//                                              >
//                                                  キャンセル
//                                              </button>
//                                          </div>
//                                      ) : (
//                                          <button
//                                              onClick={() => setReplenishId(product.id)}
//                                              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//                                          >
//                                              在庫補充
//                                          </button>
//                                      )}
//                                  </div>
//                              );
//                          })}
//                      </div>
//                  )}
//              </div>
//          </main>
//      </div>
//  );
// }

// export default StockManagementPage;

// // % End

// % Start(AI Assistant)
// 在庫管理画面。在庫数確認と補充

import { useState, useEffect } from 'react';
import { TitleHeader } from '@/components/TitleHeader';

interface Product {
    id: string;
    name: string;
    stock: number;
    points: number;
    // APIにない場合はフロントで定義
    alertThreshold?: number; 
}

interface StockStats {
    totalStock: number;
    warningCount: number;
    totalSales: number;
}

export function StockManagementPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [stats, setStats] = useState<StockStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // 在庫補充用のState
    const [replenishId, setReplenishId] = useState<string | null>(null);
    const [replenishAmount, setReplenishAmount] = useState('');

    // 閾値（モックデータに含まれないため定数で定義）
    const ALERT_THRESHOLD = 20;

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            // 在庫情報を持つ商品APIを使用
            // Note: points/ordersは注文履歴のため、在庫管理にはproductsを使用します
            const response = await fetch('/api/points/products', {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const productList: Product[] = data.products || [];

            // 統計情報の計算
            const calculatedStats: StockStats = {
                totalStock: productList.reduce((sum, p) => sum + p.stock, 0),
                warningCount: productList.filter(p => p.stock < ALERT_THRESHOLD).length,
                totalSales: 245, // モックデータにないため図99の数値を仮定
            };

            setProducts(productList);
            setStats(calculatedStats);
        } catch (err) {
            console.error(err);
            setError('データの取得に失敗しました');
        } finally {
            setLoading(false);
        }
    }

    async function handleReplenish(productId: string) {
        const amount = Number(replenishAmount);
        if (!amount || amount <= 0) {
            alert('正しい数量を入力してください');
            return;
        }

        // モック動作: ローカルのStateを更新して擬似的に補充する
        const updatedProducts = products.map((p) => {
            if (p.id === productId) {
                return { ...p, stock: p.stock + amount };
            }
            return p;
        });
        
        // 統計も再計算
        const newStats: StockStats = {
            totalStock: updatedProducts.reduce((sum, p) => sum + p.stock, 0),
            warningCount: updatedProducts.filter(p => p.stock < ALERT_THRESHOLD).length,
            totalSales: stats?.totalSales || 0,
        };

        setProducts(updatedProducts);
        setStats(newStats);
        
        alert(`在庫を補充しました`);
        setReplenishId(null);
        setReplenishAmount('');
    }

    // ローディング表示
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-[390px] aspect-[9/19] bg-white shadow-2xl rounded-[3rem] flex items-center justify-center">
                    <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            {/* スマホ枠 */}
            <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white rounded-[3rem] overflow-hidden">
                
                {/* ヘッダー */}
                <div className="bg-white/50 backdrop-blur-sm z-10 relative">
                    <TitleHeader title="在庫管理" backPath="/admin/dashboard" />
                </div>

                {/* スクロールエリア */}
                <div className="flex-1 overflow-y-auto p-5 scrollbar-hide pb-20">
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    {/* 統計情報カード（図99の上部） */}
                    {stats && (
                        <div className="grid grid-cols-3 gap-2 mb-6">
                            <div className="bg-white p-3 rounded-xl shadow-sm text-center border border-white/60">
                                <h3 className="text-[10px] font-bold text-gray-500 mb-1">総在庫</h3>
                                <p className="text-xl font-extrabold text-blue-600 leading-none">
                                    {stats.totalStock.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-white p-3 rounded-xl shadow-sm text-center border border-white/60">
                                <h3 className="text-[10px] font-bold text-gray-500 mb-1">在庫警告</h3>
                                <p className={`text-xl font-extrabold leading-none ${stats.warningCount > 0 ? 'text-red-500' : 'text-gray-600'}`}>
                                    {stats.warningCount.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-white p-3 rounded-xl shadow-sm text-center border border-white/60">
                                <h3 className="text-[10px] font-bold text-gray-500 mb-1">総販売数</h3>
                                <p className="text-xl font-extrabold text-green-600 leading-none">
                                    {stats.totalSales.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-bold text-gray-700">商品在庫一覧</h3>
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
                            閾値: {ALERT_THRESHOLD}個未満
                        </span>
                    </div>

                    {/* 商品リスト */}
                    {products.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <p>商品がありません</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {products.map((product) => {
                                const isLowStock = product.stock < ALERT_THRESHOLD;
                                const isReplenishing = replenishId === product.id;

                                return (
                                    <div
                                        key={product.id}
                                        className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${
                                            isLowStock ? 'border-red-300 bg-red-50/50' : 'border-white/60'
                                        } ${isReplenishing ? 'ring-2 ring-blue-400 shadow-md' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-bold">
                                                        ギフト券
                                                    </span>
                                                    {isLowStock && (
                                                        <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-600 rounded font-bold flex items-center gap-1">
                                                            ⚠️ 不足
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="font-bold text-gray-800 text-base leading-tight">
                                                    {product.name}
                                                </h4>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-gray-400 font-bold mb-0.5">現在庫</div>
                                                <p className={`text-2xl font-black leading-none ${
                                                    isLowStock ? 'text-red-600' : 'text-gray-800'
                                                }`}>
                                                    {product.stock}
                                                </p>
                                            </div>
                                        </div>

                                        {/* 在庫補充フォーム（図100の機能） */}
                                        {isReplenishing ? (
                                            <div className="mt-3 bg-gray-50 p-3 rounded-xl animate-fadeIn">
                                                <label className="text-xs font-bold text-gray-500 mb-1 block">補充数量を入力</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        className="w-full shadow-inner border border-gray-300 rounded-lg py-2 px-3 text-lg font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                        value={replenishAmount}
                                                        onChange={(e) => setReplenishAmount(e.target.value)}
                                                        placeholder="0"
                                                        min="1"
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="flex gap-2 mt-3">
                                                    <button
                                                        onClick={() => {
                                                            setReplenishId(null);
                                                            setReplenishAmount('');
                                                        }}
                                                        className="flex-1 py-2 rounded-lg text-xs font-bold bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
                                                    >
                                                        キャンセル
                                                    </button>
                                                    <button
                                                        onClick={() => handleReplenish(product.id)}
                                                        className="flex-1 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                                                    >
                                                        補充する
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setReplenishId(product.id)}
                                                className="w-full mt-1 bg-white border border-blue-100 text-blue-600 font-bold py-2.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-1 text-sm shadow-sm"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                                在庫補充
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StockManagementPage;

// % End
