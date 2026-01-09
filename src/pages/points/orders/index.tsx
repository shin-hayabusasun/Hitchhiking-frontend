import { useEffect, useState } from 'react';
import { TitleHeader } from '@/components/TitleHeader';

// ★★★ 1. インポートコードは残しておき、コメントアウトのままにします ★★★
// import { OrderCard, Order } from '@/components/OrderCard';

// ★★★ 2. エラー回避のため、型定義を一時的にここに書きます（別ファイルを作ったら消してください） ★★★
interface Order {
  id: string;
  productName: string;
  points: number;
  status: string;
  orderDate: string;
}

// ★★★ 3. UI確認用に、コンポーネントの実体も一時的にここに書きます（別ファイルを作ったら消してください） ★★★
const OrderCard = ({ order }: { order: Order }) => {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return '準備中';
      case 'shipped': return '発送済み';
      case 'delivered': return '配達完了';
      default: return status;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div className="text-sm text-gray-500 font-medium">{order.orderDate}</div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusStyles(order.status)}`}>
          {getStatusLabel(order.status)}
        </span>
      </div>
      <div className="mb-4">
        <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2">{order.productName}</h3>
        <p className="text-xs text-gray-400 font-mono">ID: {order.id}</p>
      </div>
      <div className="border-t border-gray-100 pt-3 flex justify-end items-baseline gap-1">
        <span className="text-sm text-gray-500">交換P:</span>
        <span className="text-xl font-bold text-blue-600">{order.points.toLocaleString()}</span>
        <span className="text-sm text-gray-500">pt</span>
      </div>
    </div>
  );
};

// ▼▼▼ モックデータ ▼▼▼
const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-20250115-001',
    productName: 'Amazonギフトカード 3,000円分',
    points: 3000,
    status: 'pending',
    orderDate: '2025/01/15',
  },
  {
    id: 'ORD-20241228-002',
    productName: 'スターバックス ドリンクチケット',
    points: 500,
    status: 'shipped',
    orderDate: '2024/12/28',
  },
  {
    id: 'ORD-20241110-003',
    productName: 'オリジナルTシャツ (Lサイズ)',
    points: 2500,
    status: 'delivered',
    orderDate: '2024/11/10',
  },
];

export function PointOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('/api/points/orders', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok && data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        setError('注文履歴の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const sourceOrders = orders.length > 0 ? orders : MOCK_ORDERS;

  const filteredOrders = sourceOrders.filter((o) => {
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
          <div className="mb-6 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex space-x-2 min-w-max">
              <button onClick={() => setStatusFilter('all')} className={getFilterButtonClass(statusFilter === 'all', 'bg-gray-800')}>全て</button>
              <button onClick={() => setStatusFilter('pending')} className={getFilterButtonClass(statusFilter === 'pending', 'bg-yellow-500')}>準備中</button>
              <button onClick={() => setStatusFilter('shipped')} className={getFilterButtonClass(statusFilter === 'shipped', 'bg-blue-500')}>発送済み</button>
              <button onClick={() => setStatusFilter('delivered')} className={getFilterButtonClass(statusFilter === 'delivered', 'bg-green-500')}>配達完了</button>
            </div>
          </div>

          {error && <p className="text-red-500 mb-4 text-center bg-red-50 p-2 rounded">{error}</p>}

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">注文履歴がありません</p>
            </div>
          ) : (
            // ★★★ 4. ここをコメントアウト解除しました ★★★
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default PointOrdersPage;