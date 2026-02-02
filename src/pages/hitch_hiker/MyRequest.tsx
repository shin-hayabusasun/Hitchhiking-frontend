import React, { useState, useEffect } from 'react';
import { MyRequestHeader } from '@/components/hitch_hiker/MyRequestHeader';
import { MyRequestCard } from '@/components/hitch_hiker/MyRequestCard';
import { getApiUrl } from '@/config/api';
import { Loader2, Inbox } from 'lucide-react';

const MyRequest = () => {
  const [tab, setTab] = useState<'requesting' | 'approved' | 'completed'>('requesting');
  const [allData, setAllData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- APIからリクエスト一覧を取得 ---
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

  // --- 申請の取り消し処理 ---
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

  const displayRequests = allData ? allData[tab] : [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-[#F8FAFC]">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <div className="text-[12px] text-gray-400 font-bold tracking-wider">リクエストを取得中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
      <div className="w-full min-h-screen flex flex-col relative">
        
        {/* ヘッダー部分 (タブ切り替えを含む) */}
        {/* 注意: MyRequestHeader内のデザインも、これまでの修正に合わせて
            rounded-xl や text-xs 等に調整されていることを推奨します */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="max-w-2xl mx-auto w-full">
            <MyRequestHeader currentTab={tab} onTabChange={setTab} />
          </div>
        </div>

        {/* リスト表示エリア */}
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-2xl mx-auto w-full p-4 md:p-6 space-y-4 pb-24">
            {displayRequests && displayRequests.length > 0 ? (
              <div className="grid gap-4">
                {displayRequests.map((item: any) => (
                  <MyRequestCard 
                    key={item.id} 
                    item={item} 
                    tab={tab} 
                    onCancel={handleCancel} 
                  />
                ))}
              </div>
            ) : (
              /* 空状態の表示 */
              <div className="flex flex-col items-center justify-center py-32 space-y-5">
                <div className="w-16 h-16 bg-white rounded-[1.5rem] shadow-sm border border-gray-100 flex items-center justify-center text-gray-200">
                  <Inbox className="w-8 h-8" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-[13px] font-black text-gray-500">
                    {tab === 'requesting' ? '申請中のリクエストはありません' : 
                     tab === 'approved' ? '承認済みのリクエストはありません' : 
                     '完了した履歴はありません'}
                  </p>
                  <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                    No data found
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* 下部に余白を確保するためのスペーサー (モバイルナビがある場合用) */}
        <div className="h-16 md:hidden" />
      </div>
    </div>
  );
};

export default MyRequest;