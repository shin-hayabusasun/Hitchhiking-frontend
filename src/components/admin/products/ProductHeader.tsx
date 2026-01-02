// src/components/admin/product/ProductHeader.tsx
import { TitleHeader } from '@/components/TitleHeader';

interface ProductHeaderProps {
    onBack: () => void;
    onCreate: () => void;
}

export function ProductHeader({ onBack, onCreate }: ProductHeaderProps) {
    return (
        <div className="bg-white/50 backdrop-blur-sm z-10 relative">
            <TitleHeader title="商品情報管理" onBack={onBack} />
            
            {/* 右上の新規登録ボタン */}
            <button
                onClick={onCreate}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-blue-600 text-white px-2 py-3 rounded-full shadow-md active:scale-95 transition-all hover:bg-blue-700"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs font-bold">新規</span>
            </button>
        </div>
    );
}