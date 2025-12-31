// % Start(小松憲生)
// 商品情報管理画面: 商品情報の一覧閲覧、新規登録、編集・削除を行う画面

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { adminApi } from '@/lib/api';
import { TitleHeader } from '@/components/TitleHeader';

interface Product {
    id: string;
    name: string;
    points: number;
    stock: number;
    description: string;
}

export function ProductManagementPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 商品一覧取得
    // useEffect(() => {
    //  async function fetchProducts() {
    //      try {
    //          const response = await adminApi.getProducts();
    //          setProducts(response.products || []);
    //      } catch (err) {
    //          setError('商品情報の取得に失敗しました');
    //      } finally {
    //          setLoading(false);
    //      }
    //  }

    //  fetchProducts();
    // }, []);

    // 商品一覧取得
    useEffect(() => {
        async function fetchProducts() {
            try {
                // 指定されたモック情報のURLへ直接リクエスト
                const response = await fetch('/api/points/products', {
                    method: 'GET',
                    credentials: 'include', // 認証情報を含める（必要に応じて）
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                // レスポンスの形に合わせて products をセット
                setProducts(data.products || []); 
            } catch (err) {
                console.error('Fetch error:', err);
                setError('商品情報の取得に失敗しました');
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    function handleCreateClick() {
        // 新規作成画面へ（オーバーレイまたは別ページ）
        alert('新規作成機能は実装予定です');
    }

    function handleEditClick(id: string) {
        // 編集画面へ
        alert(`商品ID: ${id} の編集機能は実装予定です`);
    }

    async function handleDeleteClick(id: string) {
        if (!confirm('本当に削除しますか？')) {
            return;
        }

        try {
            await adminApi.deleteProduct(id);
            setProducts(products.filter((p) => p.id !== id));
            alert('削除しました');
        } catch (err) {
            alert('削除に失敗しました');
        }
    }

    function handleBack() {
        router.push('/admin/dashboard');
    }

    // if (loading) {
    //  return (
    //      <div className="loading-container">
    //          <div className="loading-spinner"></div>
    //      </div>
    //  );
    // }

    // ローディング画面のデザイン調整
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-[390px] aspect-[9/19] bg-white shadow-2xl rounded-[3rem] flex items-center justify-center">
                    <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
            </div>
        );
    }

    // return (
    //  // <div className="product-management-page">
    //  <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            
    //      {/* <div className="product-management-container"> */}
    //      <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">

    //          <TitleHeader title="商品情報管理" onBack={handleBack} />

    //          {error && <div className="error-message">{error}</div>}

    //          <div className="actions">
    //              <button
    //                  type="button"
    //                  // className="btn btn-primary"
    //                  // className="bg-blue-500 text-white px-4 py-2 rounded"
    //                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 active:scale-[0.98] transition-all"
    
    //                  onClick={handleCreateClick}
    //              >
    //                  新規登録
    //              </button>
    //          </div>

    //          <div className="products-list">
    //              {products.map((product) => {
    //                  return (
    //                      <div key={product.id} className="product-card">
    //                          <div className="product-info">
    //                              <h3>{product.name}</h3>
    //                              <p>{product.description}</p>
    //                              <div className="product-details">
    //                                  <span>{product.points}pt</span>
    //                                  <span>在庫: {product.stock}</span>
    //                              </div>
    //                          </div>
    //                          <div className="product-actions">
    //                              <button
    //                                  type="button"
    //                                  className="btn btn-secondary"
    //                                  onClick={() => {
    //                                      handleEditClick(product.id);
    //                                  }}
    //                              >
    //                                  編集
    //                              </button>
    //                              <button
    //                                  type="button"
    //                                  className="btn btn-danger"
    //                                  onClick={() => {
    //                                      handleDeleteClick(product.id);
    //                                  }}
    //                              >
    //                                  削除
    //                              </button>
    //                          </div>
    //                      </div>
    //                  );
    //              })}
    //          </div>

    //          {products.length === 0 && !error && (
    //              <div className="empty-state">
    //                  <p>商品がありません</p>
    //              </div>
    //          )}
    //      </div>
    //  </div>
    // );

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            
            {/* スマホ枠 */}
            <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto rounded-[3rem]">

                {/* <TitleHeader title="商品情報管理" onBack={handleBack} /> */}

                {/* ヘッダー部分は固定（relativeを追加し、ボタンをabsoluteで配置） */}
                <div className="bg-white/50 backdrop-blur-sm z-10 relative">
                    <TitleHeader title="商品情報管理" onBack={handleBack} />
                    
                    {/* 右上の新規登録ボタン（アイコン＋文字） */}
                    <button
                        onClick={handleCreateClick}
                        className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-blue-600 text-white px-2 py-3 rounded-full shadow-md active:scale-95 transition-all hover:bg-blue-700"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-xs font-bold">新規</span>
                    </button>
                </div>

                {/* コンテンツエリア：余白を追加 */}
                <div className="p-5 pb-20"> 
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    {/* <div className="mb-6">
                        <button
                            type="button"
                            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 active:scale-[0.95] transition-transform flex items-center justify-center gap-2"
                            onClick={handleCreateClick}
                        >
                            <span className="text-xl">+</span> 新規登録
                        </button>
                    </div> */}

                    <div className="space-y-4">
                        {products.map((product) => {
                            return (
                                <div key={product.id} className="bg-white p-5 rounded-2xl shadow-sm border border-white/60">
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
                                                onClick={() => handleEditClick(product.id)}
                                            >
                                                編集
                                            </button>
                                            <button
                                                type="button"
                                                className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                                                onClick={() => handleDeleteClick(product.id)}
                                            >
                                                削除
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {products.length === 0 && !error && (
                        <div className="text-center py-10 text-gray-400">
                            <p>商品がありません</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductManagementPage;

// % End


