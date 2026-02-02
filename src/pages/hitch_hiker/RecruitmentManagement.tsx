import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { HitchhikerHeader } from '@/components/hitch_hiker/Header';
import RecruitmentManagementCard from '../../components/hitch_hiker/RecruitmentManagementCard';
import { getApiUrl } from '@/config/api';
import { Plus, Loader2, Inbox } from 'lucide-react';

const RecruitmentManagement = () => {
  const router = useRouter();
  const [recruitments, setRecruitments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(getApiUrl('/api/hitchhiker/my_recruitments'), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!response.ok) throw new Error('データの取得に失敗しました');
        const result = await response.json();
        if (result.success) {
          setRecruitments(result.data);
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // タブ切り替え時に履歴を増やさない
  function handleSearchClick() {
    router.replace('/hitch_hiker/Search');
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
      <div className="w-full min-h-screen flex flex-col relative">
        
        {/* ヘッダーセクション */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="max-w-2xl mx-auto w-full">
            {/* 【修正箇所】
              プロパティ名を onBackClick ではなく onBack に修正。
              これでヘッダー内の router.push('/') が正しく実行されます。
            */}
            <HitchhikerHeader 
              title="同乗者として利用" 
              onBack={() => router.push('/')} 
            />
            
            {/* タブメニュー（デザイン維持） */}
            <div className="flex px-4 py-2 gap-2 bg-white">
              <button 
                onClick={handleSearchClick}
                className="flex-1 py-2 text-xs font-black text-gray-400 hover:text-gray-600 transition-colors active:scale-95"
              >
                募集検索
              </button>
              <button className="flex-1 py-2 text-xs font-black text-blue-600 bg-blue-50/50 rounded-lg flex items-center justify-center gap-1.5 cursor-default">
                募集管理
                <span className="bg-blue-600 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-black">
                  {recruitments.length}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* メインコンテンツ（max-w-2xl でサイズ拡張） */}
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-2xl mx-auto w-full p-4 space-y-4 pb-32">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <p className="text-[10px] font-black text-gray-300 uppercase">Loading...</p>
              </div>
            ) : recruitments.length > 0 ? (
              <div className="grid gap-4">
                {recruitments.map((item: any) => (
                  <RecruitmentManagementCard 
                    key={item.id} 
                    item={{
                      ...item,
                      from: item.from_location,
                      to: item.to_location
                    }} 
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="w-16 h-16 bg-white rounded-[1.5rem] shadow-sm border border-gray-100 flex items-center justify-center text-gray-200">
                  <Inbox className="w-8 h-8" />
                </div>
                <div className="text-center font-black text-gray-400 text-[13px]">
                  作成した募集がありません
                </div>
              </div>
            )}
          </div>
        </main>

        {/* 下部固定ボタン（中央寄せ max-w-2xl） */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 z-40">
          <div className="max-w-2xl mx-auto w-full p-5">
            <button 
              onClick={() => router.push('/hitch_hiker/passenger/CreateDrivePassenger')} 
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-100 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3px]" />
              同乗者として募集を作成
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RecruitmentManagement;