import { useEffect, useState } from 'react';
import { TitleHeader } from '@/components/TitleHeader';
import { OrderCard, OrderItemResponse } from '@/components/point/OrderCard';

const API_BASE_URL = 'http://54.165.126.189:8000';

export function PointOrdersPage() {
  // 型定義
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
    return `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
      isActive 
        ? `${activeColor} text-white shadow-sm` 
        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
    }`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">
        <TitleHeader title="注文履歴" backPath="/points" />
        
        <main className="max-w-3xl mx-auto p-4 md:p-6">
          {/* フィルタリングボタンエリア */}
          <div className="mb-6 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex space-x-2 min-w-max">
              <button onClick={() => setStatusFilter('all')} className={getFilterButtonClass(statusFilter === 'all', 'bg-gray-800')}>全て</button>
              <button onClick={() => setStatusFilter('pending')} className={getFilterButtonClass(statusFilter === 'pending', 'bg-yellow-500')}>準備中</button>
              <button onClick={() => setStatusFilter('shipped')} className={getFilterButtonClass(statusFilter === 'shipped', 'bg-blue-500')}>発送済み</button>
              <button onClick={() => setStatusFilter('delivered')} className={getFilterButtonClass(statusFilter === 'delivered', 'bg-green-500')}>配達完了</button>
            </div>
          </div>

          {/* エラー表示 */}
          {error && <p className="text-red-500 mb-4 text-center bg-red-50 p-2 rounded">{error}</p>}

          {/* ローディング表示 */}
          {loading && <p className="text-center text-gray-500 mt-10">読み込み中...</p>}

          {/* コンテンツ表示 */}
          {!loading && !error && (
            <>
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-500">注文履歴がありません</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default PointOrdersPage;