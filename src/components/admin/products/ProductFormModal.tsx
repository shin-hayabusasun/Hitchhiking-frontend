// 憲生：src/components/admin/product/ProductFormModal.tsx
// 商品情報の新規登録・編集用モーダルコンポーネント

import { useState, useEffect } from 'react';
import { Product } from '@/types'; // 型定義をインポート

// フォームで扱うデータの型（新規作成・編集で使用）
interface ProductFormData {
    name: string;
    points: number;
    stock: number;
    description: string;
}

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ProductFormData) => void; // フォームデータを親に渡す
    initialData?: Product | null; // 編集時はこれが入る
}

export function ProductFormModal({ isOpen, onClose, onSubmit, initialData }: ProductFormModalProps) {
    // フォームの状態管理
    const [name, setName] = useState('');
    const [points, setPoints] = useState(0);
    const [stock, setStock] = useState(0);
    const [description, setDescription] = useState('');

    // モーダルが開くたび、あるいはinitialDataが変わるたびにフォームを初期化
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // 編集モード：既存データを入れる
                setName(initialData.name);
                setPoints(initialData.points);
                setStock(initialData.stock);
                setDescription(initialData.description);
            } else {
                // 新規モード：空にする
                setName('');
                setPoints(0);
                setStock(0);
                setDescription('');
            }
        }
    }, [isOpen, initialData]);

    // 保存ボタンを押した時の処理
    const handleSubmit = () => {
        // 簡単なバリデーション
        if (!name || points <= 0) {
            alert('商品名と正しいポイント数を入力してください');
            return;
        }

        onSubmit({
            name,
            points,
            stock,
            description,
        });
    };

    // 開いていない時は何も描画しない
    if (!isOpen) return null;

    // タイトルとボタンの文言を切り替え
    const title = initialData ? '商品情報の編集' : '新規商品登録';
    const buttonText = initialData ? '更新する' : '登録する';

    return (
        // 背景の黒いフィルター（オーバーレイ）
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            
            {/* 白い入力ボックス */}
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
                <h3 className="text-lg font-bold mb-4 text-gray-800">{title}</h3>
                
                <div className="space-y-4">
                    {/* 商品名 */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">商品名</label>
                        <input
                            type="text"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="例: Amazonギフト券"
                        />
                    </div>

                    {/* ポイントと在庫（横並び） */}
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 mb-1">ポイント</label>
                            <input
                                type="number"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={points}
                                onChange={(e) => setPoints(Number(e.target.value))}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 mb-1">在庫数</label>
                            <input
                                type="number"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={stock}
                                onChange={(e) => setStock(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    {/* 説明文 */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">商品説明</label>
                        <textarea
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 h-24 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                {/* アクションボタン */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors text-sm"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
}