import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Plus, Loader2 } from 'lucide-react';
// 共通ヘッダーをインポート（パスはプロジェクトの構造に合わせて調整してください）
import { HitchhikerHeader } from '@/components/hitch_hiker/Header'; 
import RecruitmentManagementCard from '../../components/hitch_hiker/RecruitmentManagementCard';
import { getApiUrl } from '@/config/api';

const RecruitmentManagement = () => {
  const router = useRouter();
  const [recruitments, setRecruitments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // データの取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(getApiUrl('/api/hitchhiker/my_recruitments'), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }

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

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
      <div className="w-full min-h-screen flex flex-col relative">
        
        {/* Header: 白背景は横いっぱい、中身は max-w-2xl で中央寄せ */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
          <div className="max-w-2xl mx-auto w-full px-4 py-1">
            <HitchhikerHeader 
              title="同乗者として利用" 
              showBackButton={true} 
              onBack={() => router.push('/')} // 戻るボタンの挙動をカスタマイズ
            />
          </div>
        </header>

        {/* Main Content: max-w-2xl で中央寄せ */}
        <main className="flex-1 max-w-2xl mx-auto w-full px-5 pt-4 pb-32">
          
          {/* タブ切り替えセクション */}
          <div className="flex py-4 gap-2">
            <button 
              onClick={() => router.push('/hitch_hiker/Search')}
              className="flex-1 py-3 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              募集検索
            </button>
            <button className="flex-1 py-3 text-sm font-black text-blue-600 bg-white rounded-2xl shadow-sm border border-blue-100 relative">
              募集管理 
              <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-[10px] rounded-full">
                {recruitments.length}
              </span>
            </button>
          </div>

          {/* 募集カードリスト表示エリア */}
          <section className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p className="text-sm font-bold">情報を読み込み中...</p>
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
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-gray-300 rotate-45" />
                </div>
                <p className="text-gray-400 text-sm font-bold">まだ作成した募集はありません</p>
              </div>
            )}
          </section>

          {/* 下部固定ボタンエリア：max-w-2xl 内に収まるように配置 */}
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl p-6 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/90 to-transparent z-40">
            <button 
              onClick={() => router.push('/hitch_hiker/passenger/CreateDrivePassenger')} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-blue-200 active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5 stroke-[3px]" /> 
              新しい募集を作成
            </button>
          </div>

        </main>
      </div>
    </div>
  );
};

export default RecruitmentManagement;