import React, { useState, useEffect } from 'react';
import { MyRequestHeader } from '@/components/hitch_hiker/MyRequestHeader';
import { MyRequestCard } from '@/components/hitch_hiker/MyRequestCard';

const MyRequest = () => {
  const [tab, setTab] = useState<'requesting' | 'approved' | 'completed'>('requesting');
  const [allData, setAllData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/hitchhiker/my-requests');
      const result = await response.json();
      if (result.success) setAllData(result.data);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleCancel = async (id: number) => {
    if (!confirm("リクエストを取り消しますか？")) return;
    const res = await fetch(`/api/hitchhiker/cancel-request/${id}`, { method: 'DELETE' });
    if (res.ok) fetchRequests(); // 再取得して画面を更新
  };

  const displayRequests = allData ? allData[tab] : [];

  if (loading) return <div className="text-center py-20">読み込み中...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-[390px] bg-[#F1F5F9] rounded-[3rem] overflow-hidden shadow-xl min-h-[800px] flex flex-col">
        <MyRequestHeader currentTab={tab} onTabChange={setTab} />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {displayRequests.length > 0 ? (
            displayRequests.map((item: any) => (
              <MyRequestCard key={item.id} item={item} tab={tab} onCancel={handleCancel} />
            ))
          ) : (
            <div className="text-center py-20 text-gray-400">履歴がありません</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRequest;