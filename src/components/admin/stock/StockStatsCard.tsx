// 憲生：src/components/admin/stock/StockStatsCard.tsx
import { StockStats } from '@/types/stock';

interface StockStatsCardProps {
    stats: StockStats;
}

export function StockStatsCard({ stats }: StockStatsCardProps) {
    // 警告数が0より大きいかどうかで文字色を変える
    let warningTextColor = 'text-gray-600';
    if (stats.warningCount > 0) {
        warningTextColor = 'text-red-500';
    }

    return (
        <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="bg-white p-3 rounded-xl shadow-sm text-center border border-white/60">
                <h3 className="text-[10px] font-bold text-gray-500 mb-1">総在庫</h3>
                <p className="text-xl font-extrabold text-blue-600 leading-none">
                    {stats.totalStock.toLocaleString()}
                </p>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm text-center border border-white/60">
                <h3 className="text-[10px] font-bold text-gray-500 mb-1">在庫警告</h3>
                <p className={`text-xl font-extrabold leading-none ${warningTextColor}`}>
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
    );
}