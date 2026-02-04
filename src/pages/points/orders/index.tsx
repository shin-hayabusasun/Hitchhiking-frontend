import { useEffect, useState } from 'react';
import { TitleHeader } from '@/components/TitleHeader';
import { OrderCard, OrderItemResponse } from '@/components/point/OrderCard';
import { API_BASE_URL } from '@/config/api';

export function PointOrdersPage() {
  const [orders, setOrders] = useState<OrderItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/points/orders`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error(err);
        setError('注文履歴の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  const getFilterButtonClass = (isActive: boolean, activeColor: string) => {
    // 指で押しやすいサイズ（py-2.5）と視認性の良いフォントサイズ（text-sm）に変更
    return `px-5 py-2.5 rounded-full text-sm font-bold transition-all border-none ${
      isActive 
        ? `${activeColor} text-white shadow-md` 
        : 'bg-white text-gray-500 hover:bg-gray-100 shadow-sm'
    }`;
  };

  return (
    /* ★ 背景を w-full で画面一杯に広げる */
    <div className="w-full min-h-screen bg-[#F8F9FA] flex flex-col items-center">
      
      {/* ★ ヘッダー：白背景は横いっぱい、ボーダーなし、高さを適正化 */}
      <header className="w-full bg-white sticky top-0 z-30">
        <div className="max-w-2xl mx-auto py-1">
          <TitleHeader title="注文履歴" backPath="/points" />
        </div>
      </header>

      {/* ★ メインコンテンツ：max-w-2xl、枠線やリングをすべて削除 */}
      <div className="w-full max-w-2xl min-h-screen flex flex-col font-sans relative">
        
        <main className="p-4">
          {/* フィルタリングボタンエリア：適切なサイズ感と余白 */}
          <div className="mb-6 overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex space-x-3 min-w-max">
              <button onClick={() => setStatusFilter('all')} className={getFilterButtonClass(statusFilter === 'all', 'bg-gray-800')}>全て</button>
              <button onClick={() => setStatusFilter('pending')} className={getFilterButtonClass(statusFilter === 'pending', 'bg-yellow-500')}>準備中</button>
              <button onClick={() => setStatusFilter('shipped')} className={getFilterButtonClass(statusFilter === 'shipped', 'bg-blue-500')}>発送済み</button>
              {/* 緑色に指定色 #00B049 を適用 */}
              <button onClick={() => setStatusFilter('delivered')} className={getFilterButtonClass(statusFilter === 'delivered', 'bg-[#00B049]')}>配達完了</button>
            </div>
          </div>

          {/* エラー表示：文字サイズを調整 */}
          {error && (
            <div className="bg-red-50 p-4 rounded-2xl mb-6">
              <p className="text-red-500 text-sm text-center font-bold">{error}</p>
            </div>
          )}

          {/* ローディング表示：文字サイズを調整 */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <p className="text-gray-400 text-sm font-medium animate-pulse">読み込み中...</p>
            </div>
          )}

          {/* コンテンツ表示 */}
          {!loading && !error && (
            <>
              {filteredOrders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                  <p className="text-gray-400 text-sm font-medium">注文履歴がありません</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </>
          )}
        </main>

        <div className="h-10" />
      </div>
    </div>
  );
}

export default PointOrdersPage;