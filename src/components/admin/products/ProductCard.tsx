//憲生：（内部設計書ではSearchCard）
// src/components/admin/product/ProductCard.tsx

import { Product } from '@/types/product'; // 上記で定義した型をインポート

interface ProductCardProps {
    product: Product;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-white/60">
            {/* 上段：商品名とポイント */}
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-800 text-lg leading-tight">
                    {product.name}
                </h3>
                <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap ml-2">
                    {product.points.toLocaleString()} pt
                </span>
            </div>

            {/* 中段：説明文 */}
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                {product.description}
            </p>

            {/* 下段：在庫と操作ボタン */}
            <div className="flex items-end justify-between border-t border-gray-100 pt-3">
                <div className="text-xs text-gray-400 font-medium">
                    在庫: <span className="text-gray-700 text-sm ml-1">{product.stock}</span>
                </div>
                
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"
                        onClick={() => onEdit(product.id)}
                    >
                        編集
                    </button>
                    <button
                        type="button"
                        className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                        onClick={() => onDelete(product.id)}
                    >
                        削除
                    </button>
                </div>
            </div>
        </div>
    );
}