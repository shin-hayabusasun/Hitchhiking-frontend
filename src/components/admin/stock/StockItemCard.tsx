// 憲生：src/components/admin/stock/StockItemCard.tsx
import { Product } from '@/types';

interface StockItemCardProps {
    product: Product;
    alertThreshold: number;
    isReplenishing: boolean;       // 補充モードかどうか
    replenishAmount: string;       // 入力中の数量
    onStartReplenish: (id: string) => void;      // 補充ボタンを押した時
    onCancelReplenish: () => void;               // キャンセルボタンを押した時
    onConfirmReplenish: (id: string) => void;    // 確定ボタンを押した時
    onAmountChange: (val: string) => void;       // 入力が変わった時
}

export function StockItemCard({
    product,
    alertThreshold,
    isReplenishing,
    replenishAmount,
    onStartReplenish,
    onCancelReplenish,
    onConfirmReplenish,
    onAmountChange
}: StockItemCardProps) {

    // 在庫不足かどうか判定
    const isLowStock = product.stock < alertThreshold;

    // デザインのクラス決定ロジック
    let cardBorderClass = 'border-white/60';
    let cardBgClass = 'bg-white';
    let stockTextClass = 'text-gray-800';

    if (isLowStock) {
        cardBorderClass = 'border-red-300';
        cardBgClass = 'bg-red-50/50';
        stockTextClass = 'text-red-600';
    }

    let activeRingClass = '';
    if (isReplenishing) {
        activeRingClass = 'ring-2 ring-blue-400 shadow-md';
    }

    return (
        <div className={`rounded-2xl p-4 shadow-sm border transition-all ${cardBgClass} ${cardBorderClass} ${activeRingClass}`}>
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
                    <p className={`text-2xl font-black leading-none ${stockTextClass}`}>
                        {product.stock}
                    </p>
                </div>
            </div>

            {/* 補充モードの場合のフォーム表示 */}
            {isReplenishing && (
                <div className="mt-3 bg-gray-50 p-3 rounded-xl animate-fadeIn">
                    <label className="text-xs font-bold text-gray-500 mb-1 block">補充数量を入力</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            className="w-full shadow-inner border border-gray-300 rounded-lg py-2 px-3 text-lg font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={replenishAmount}
                            onChange={(e) => onAmountChange(e.target.value)}
                            placeholder="0"
                            min="1"
                            autoFocus
                        />
                    </div>
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={onCancelReplenish}
                            className="flex-1 py-2 rounded-lg text-xs font-bold bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
                        >
                            キャンセル
                        </button>
                        <button
                            onClick={() => onConfirmReplenish(product.id)}
                            className="flex-1 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                        >
                            補充する
                        </button>
                    </div>
                </div>
            )}

            {/* 通常時のボタン表示 */}
            {!isReplenishing && (
                <button
                    onClick={() => onStartReplenish(product.id)}
                    className="w-full mt-1 bg-white border border-blue-100 text-blue-600 font-bold py-2.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-1 text-sm shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    在庫補充
                </button>
            )}
        </div>
    );
}