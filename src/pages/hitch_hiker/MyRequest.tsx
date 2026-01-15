import React, { useState, useEffect } from 'react';


import { MyRequestHeader } from '@/components/hitch_hiker/MyRequestHeader';
import { MyRequestCard } from '@/components/hitch_hiker/MyRequestCard';

const MyRequest = () => {
  const [tab, setTab] = useState<'requesting' | 'approved' | 'completed'>('requesting');
  const [allData, setAllData] = useState<any>(null);
  const [loading, setLoading] = useState(true);


  // --- APIからリクエスト一覧を取得 ---


  const fetchRequests = async () => {
    try {
      setLoading(true);
      // credentials: 'include' を追加してCookie（session_id）を送信
      const response = await fetch('/api/hitchhiker/my-requests', {
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

  // --- 申請の取り消し処理 ---
  const handleCancel = async (id: number) => {
    if (!confirm("このリクエストを取り消しますか？")) return;

    try {
      const res = await fetch(`/api/hitchhiker/cancel-request/${id}`, { 
        method: 'DELETE',
        credentials: 'include', // 認証が必要なため追加
      });

      if (res.ok) {
        alert("リクエストを取り消しました");
        fetchRequests(); // データを再読み込みして表示を更新
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500 font-bold">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      {/* スマホ風コンテナ */}
      <div className="w-full max-w-[390px] bg-[#F1F5F9] rounded-[3rem] overflow-hidden shadow-xl min-h-[800px] flex flex-col border-[8px] border-white relative">
        
        {/* ヘッダー部分 */}
        <MyRequestHeader currentTab={tab} onTabChange={setTab} />

        {/* リスト表示エリア */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-10 scrollbar-hide">
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
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                📁
              </div>
              <p className="text-center text-gray-400 font-bold text-sm">
                {tab === 'requesting' ? '申請中のリクエストはありません' : 
                 tab === 'approved' ? '承認済みのリクエストはありません' : 
                 '完了した履歴はありません'}
              </p>
            </div>

          )}
        </div>
      </div>
    </div>
  );
};

export default MyRequest;