// % Start(AI Assistant)
import React, { useState, useEffect } from 'react';
import { MyRequestHeader } from '@/components/hitch_hiker/MyRequestHeader';
import { MyRequestCard } from '@/components/hitch_hiker/MyRequestCard';
import { getApiUrl } from '@/config/api';
import { Loader2, FolderOpen } from 'lucide-react';

const MyRequest = () => {
  const [tab, setTab] = useState<'requesting' | 'approved' | 'completed'>('requesting');
  const [allData, setAllData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- APIからリクエスト一覧を取得 (ロジック変更なし) ---
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl('/api/hitchhiker/my-requests'), {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setAllData(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // --- 申請の取り消し処理 (ロジック変更なし) ---
  const handleCancel = async (id: number) => {
    if (!confirm("このリクエストを取り消しますか？")) return;

    try {
      const res = await fetch(getApiUrl(`/api/hitchhiker/cancel-request/${id}`), { 
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        alert("リクエストを取り消しました");
        fetchRequests();
      } else {
        const errorData = await res.json();
        alert(errorData.detail || "取り消しに失敗しました");
      }
    } catch (error) {
      console.error("Cancel error:", error);
      alert("通信エラーが発生しました");
    }
  };

  // 表示するタブのデータを抽出
  const displayRequests = allData ? allData[tab] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-gray-400 font-black text-sm tracking-widest">LOADING...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
      
      {/* ヘッダー部分: 
        MyRequestHeader コンポーネント側で「背景白・横いっぱい」
        「中身 max-w-2xl」の構造が維持されるようラップしています。
      */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-2xl mx-auto">
          <MyRequestHeader currentTab={tab} onTabChange={setTab} />
        </div>
      </header>

      {/* メインコンテンツ: max-w-2xl で中央寄せ */}
      <main className="max-w-2xl mx-auto p-5">
        <div className="space-y-4 pb-20">
          {displayRequests && displayRequests.length > 0 ? (
            displayRequests.map((item: any) => (
              <MyRequestCard 
                key={item.id} 
                item={item} 
                tab={tab} 
                onCancel={handleCancel} 
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-32 space-y-5 bg-white rounded-[2.5rem] border border-dashed border-gray-200 shadow-inner">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                <FolderOpen className="w-8 h-8 text-gray-200" />
              </div>
              <p className="text-center text-gray-400 font-black text-sm px-6">
                {tab === 'requesting' ? '申請中のリクエストはありません' : 
                 tab === 'approved' ? '承認済みのリクエストはありません' : 
                 '完了した履歴はありません'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyRequest;