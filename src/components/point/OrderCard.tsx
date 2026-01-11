import React from 'react';

// APIのレスポンス型に合わせた定義
export interface OrderItemResponse {
  id: string;
  productName: string;
  points: number;
  status: string; // 'pending' | 'shipped' | 'delivered' などが入る想定
  orderDate: string; // 'YYYY-MM-DD'
}

interface OrderCardProps {
  order: OrderItemResponse;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  
  // ステータスに応じた表示設定（ラベル、色、アイコン）
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'delivered':
        return {
          label: '配達済み',
          styles: 'bg-green-100 text-green-700 border-green-200',
          icon: (
            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
        };
      case 'shipped':
        return {
          label: '発送済み',
          styles: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: (
            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          ),
        };
      case 'pending':
        return {
          label: '準備中',
          styles: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          icon: (
            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
      default:
        // 想定外のステータスが来た場合のフォールバック
        return { 
          label: status, 
          styles: 'bg-gray-100 text-gray-700 border-gray-200', 
          icon: null 
        };
    }
  };

  const statusConfig = getStatusConfig(order.status);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4 w-full max-w-sm mx-auto transition-all hover:shadow-md">
      
      {/* --- ヘッダー（ステータス & 注文日） --- */}
      <div className="flex justify-between items-center mb-4">
        <span className={`flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.styles}`}>
          {statusConfig.icon}
          {statusConfig.label}
        </span>
        <span className="text-xs text-gray-400 font-medium">
          注文日: {order.orderDate}
        </span>
      </div>

      {/* --- 商品情報エリア --- */}
      <div className="flex gap-4 mb-4">
        {/* 商品画像（APIにないのでプレースホルダー） */}
        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>

        {/* 商品名 */}
        <div className="flex flex-col justify-center">
          <h3 className="text-gray-800 font-bold text-sm mb-1 line-clamp-2">
            {order.productName}
          </h3>
          <p className="text-xs text-gray-400">ID: {order.id}</p>
        </div>
      </div>

      {/* --- 区切り線 --- */}
      <hr className="border-gray-100 mb-3" />

      {/* --- ポイント表示 --- */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">使用ポイント</span>
        <span className="text-gray-800 font-bold text-lg">
          {order.points.toLocaleString()} <span className="text-sm font-normal text-gray-500">pt</span>
        </span>
      </div>
    </div>
  );
};