import React from 'react';

export interface Product {
    id: string;
    name: string;
    points: number;
    stock: number;
    description: string;
    category?: string;
    image?: string;
    status?: string;
}

interface SearchCardProps {
    item: Product;
    onEdit: (item: Product) => void;
    onDelete: (id: string) => void;
}

export const SearchCard: React.FC<SearchCardProps> = ({ item, onEdit, onDelete }) => {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-white/60 transition-all active:scale-[0.98]">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-800 text-lg leading-tight truncate flex-1">
                    {item.name}
                </h3>
                <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap ml-2">
                    {item.points.toLocaleString()} pt
                </span>
            </div>

            <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2">
                {item.description}
            </p>

            <div className="flex items-end justify-between border-t border-gray-100 pt-3">
                <div className="text-xs text-gray-400 font-medium">
                    在庫: <span className="text-gray-700 text-sm ml-1">{item.stock}</span>
                </div>
                
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-200"
                        onClick={() => onEdit(item)}
                    >
                        編集
                    </button>
                    <button
                        type="button"
                        className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-100"
                        onClick={() => onDelete(item.id)}
                    >
                        削除
                    </button>
                </div>
            </div>
        </div>
    );
};