import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Plus, Search, Bell, Home, ShoppingBag, FileText } from 'lucide-react';
import RecruitmentManagementCard from '../../components/hitch_hiker/RecruitmentManagementCard';
import { getApiUrl } from '@/config/api';

const RecruitmentManagement = () => {
  const router = useRouter();
  const [recruitments, setRecruitments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // FastAPIのバックエンドからデータを取得
        const response = await fetch(getApiUrl('/api/hitchhiker/my_recruitments'), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // クッキー（session_id）を含める
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }

        const result = await response.json();
        
        if (result.success) {
          // APIから返ってきた data 配列をステートにセット
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

  function handleManagementClick() {
    router.push('/hitch_hiker/Search');
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-[#E0F2FE] overflow-hidden rounded-[3rem]">
        
        {/* ヘッダー */}
        <div className="bg-white p-4 flex items-center justify-between pt-10 sticky top-0 z-20">
          {/* <button onClick={() => router.back()} className="text-gray-500 p-1"><ArrowLeft className="w-6 h-6" /></button> */}
          <button onClick={() => router.push('/')} className="text-gray-500 p-1"><ArrowLeft className="w-6 h-6" /></button>
          
          <h1 className="text-lg font-bold text-gray-700">同乗者として利用</h1>
          <div className="flex space-x-3 text-gray-400">
            <Search className="w-6 h-6" />
            <Bell className="w-6 h-6" />
          </div>
        </div>

        {/* ヘッダータブ */}
        <div className="px-4 py-2 bg-white flex space-x-2 border-b border-gray-50">
          <button onClick={handleManagementClick} className="flex-1 py-2 text-sm font-bold text-gray-400">募集検索</button>
          <button className="flex-1 py-2 text-sm font-bold text-gray-700 bg-[#F1F5F9] rounded-xl relative">
            募集管理 <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#2563EB] text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white">{recruitments.length}</span>
          </button>
        </div>

        {/* リスト表示エリア */}
        <div className="flex-1 overflow-y-auto p-4 pb-32 scrollbar-hide">
          {loading ? (
            <div className="flex justify-center py-20 text-gray-400 text-sm">読み込み中...</div>
          ) : recruitments.length > 0 ? (
            recruitments.map((item: any) => (
              /* APIのレスポンス項目名(from_location等)をCard側が受け取れるように調整 */
              <RecruitmentManagementCard 
                key={item.id} 
                item={{
                  ...item,
                  from: item.from_location, // APIの名称をCard側の期待する名称に変換
                  to: item.to_location
                }} 
              />
            ))
          ) : (
            <div className="flex justify-center py-20 text-gray-400 text-sm">募集データがありません</div>
          )}
        </div>

        {/* 画面最下部の固定ボタン */}
        <div className="absolute bottom-24 w-full px-6 z-40">
          <button 
            onClick={() => router.push('/hitch_hiker/passenger/CreateDrivePassenger')} 
            className="w-full bg-[#2563EB] text-white py-4 rounded-2xl font-bold flex items-center justify-center shadow-xl shadow-blue-300 active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5 mr-2" /> 新しい募集を作成
          </button>
        </div>

        {/* 下部ナビゲーション */}
        
      </div>
    </div>
  );
};

export default RecruitmentManagement;