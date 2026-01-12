// src/components/admin/orders/OrderCard.tsx

import React from 'react';

// 型定義 (親と合わせるためエクスポートしておくと便利ですが、今回はここで定義)
export interface Order {
    id: string;
    orderNumber: string;
    productName: string;
    points: number;
    status: string;
    orderDate: string;
    customerName: string;
}

interface OrderCardProps {
    order: Order;
    onStatusChange: (orderId: string, newStatus: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusChange }) => {
    
    // ステータスの表示名と色を定義する関数
    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'pending': return { label: '準備中', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
            case 'shipped': return { label: '発送済', color: 'bg-blue-100 text-blue-700 border-blue-200' };
            case 'completed': return { label: '完了', color: 'bg-green-100 text-green-700 border-green-200' };
            case 'cancelled': return { label: 'キャンセル', color: 'bg-gray-100 text-gray-500 border-gray-200' };
            default: return { label: status, color: 'bg-gray-100 text-gray-700' };
        }
    };

    const statusInfo = getStatusInfo(order.status);

    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            {/* 上段：商品情報 */}
            <div className="flex justify-between items-start mb-3">
                <div>
                    <p className="text-[10px] text-gray-400 font-mono tracking-wider">{order.orderNumber}</p>
                    <h3 className="font-bold text-gray-800 text-sm mt-0.5 line-clamp-1">{order.productName}</h3>
                </div>
                <div className="text-right shrink-0 ml-2">
                    <p className="font-bold text-blue-600 text-sm">{order.points} pt</p>
                    <p className="text-[10px] text-gray-400">{order.orderDate}</p>
                </div>
            </div>

            {/* 区切り線 */}
            <div className="border-t border-gray-50 my-3"></div>

            {/* 下段：ユーザー情報とステータス操作 */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-xs">
                        👤
                    </div>
                    <p className="text-xs text-gray-600 font-medium truncate max-w-[100px]">{order.customerName}</p>
                </div>

                {/* ステータス変更プルダウン */}
                <div className="relative">
                    <select
                        value={order.status}
                        onChange={(e) => onStatusChange(order.id, e.target.value)}
                        className={`appearance-none py-1.5 pl-3 pr-8 rounded-lg text-xs font-bold border ${statusInfo.color} focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors`}
                    >
                        <option value="pending">準備中</option>
                        <option value="shipped">発送済</option>
                        <option value="completed">完了</option>
                        <option value="cancelled">キャンセル</option>
                    </select>
                    {/* 下矢印アイコン */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-50">
                        <svg className="fill-current h-3 w-3" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>
        </div>
    );
};