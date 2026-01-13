import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// ★インポートパスを以下のように変更します
import { MyRequestHeader } from '@/components/hitch_hiker/MyRequestHeader';
import { MyRequestCard } from '@/components/hitch_hiker/MyRequestCard';

const MyRequest = () => {
  const router = useRouter();
  const [tab, setTab] = useState<'requesting' | 'approved' | 'completed'>('requesting');
  const [allData, setAllData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchRequests();
  }, []);

  const displayRequests = allData ? allData[tab] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400 animate-pulse font-bold">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col border-[8px] border-white relative ring-1 ring-gray-200 bg-[#F1F5F9] overflow-hidden rounded-[3rem]">
        
        {/* ★コンポーネント名をご指定のものに合わせて使用 */}
        <MyRequestHeader currentTab={tab} onTabChange={setTab} />

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 scrollbar-hide">
          {displayRequests.length > 0 ? (
            displayRequests.map((item: any) => (
              <MyRequestCard key={item.id} item={item} tab={tab} />
            ))
          ) : (
            <div className="text-center py-20 text-gray-400 text-sm font-bold">
              リクエストはありません
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MyRequest;