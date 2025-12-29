import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Plus, Search, Bell, Home, ShoppingBag, FileText } from 'lucide-react';
import RecruitmentManagementCard from '../../components/hitch_hiker/RecruitmentManagementCard';

const RecruitmentManagement = () => {
  const router = useRouter();
  const [recruitments, setRecruitments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 画像イメージに合わせたダミーデータ
        const data = [
          { 
            id: 1, 
            status: 'OPEN', 
            statusText: '募集中', 
            appliedDate: '2025.12.21', 
            userName: '田所 櫂人',
            rating: '4.9',
            reviews: '12',
            from: '高知駅', 
            to: '高知工科大学', 
            date: '12-25 09:00', 
            people: '2', 
            price: '1200' 
          },
          { 
            id: 2, 
            status: 'MATCHED', 
            statusText: 'マッチ済み', 
            appliedDate: '2025.12.20', 
            userName: '山田 太郎',
            rating: '4.7',
            reviews: '5',
            from: 'はりまや橋', 
            to: '桂浜', 
            date: '12-28 14:00', 
            people: '1', 
            price: '800' 
          }
        ];
        setRecruitments(data);
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* スマホ本体コンテナ */}
      <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-[#E0F2FE] overflow-hidden rounded-[3rem]">
        
        {/* ヘッダー */}
        <div className="bg-white p-4 flex items-center justify-between pt-10 sticky top-0 z-20">
          <button onClick={() => router.back()} className="text-gray-500 p-1"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-lg font-bold text-gray-700">同乗者として利用</h1>
          <div className="flex space-x-3 text-gray-400">
            <Search className="w-6 h-6" />
            <Bell className="w-6 h-6" />
          </div>
        </div>

        {/* ヘッダータブ */}
        <div className="px-4 py-2 bg-white flex space-x-2 border-b border-gray-50">
          <button className="flex-1 py-2 text-sm font-bold text-gray-400">募集検索</button>
          <button className="flex-1 py-2 text-sm font-bold text-gray-700 bg-[#F1F5F9] rounded-xl relative">
            募集管理 <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#2563EB] text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white">{recruitments.length}</span>
          </button>
        </div>

        {/* リスト表示エリア */}
        <div className="flex-1 overflow-y-auto p-4 pb-32 scrollbar-hide">
          {loading ? (
            <div className="flex justify-center py-20 text-gray-400 text-sm">読み込み中...</div>
          ) : (
            recruitments.map((item: any) => (
              <RecruitmentManagementCard key={item.id} item={item} />
            ))
          )}
        </div>

        {/* 画面最下部の固定ボタン */}
        <div className="absolute bottom-24 w-full px-6 z-40">
          <button className="w-full bg-[#2563EB] text-white py-4 rounded-2xl font-bold flex items-center justify-center shadow-xl shadow-blue-300 active:scale-95 transition-all">
            <Plus className="w-5 h-5 mr-2" /> 新しい募集を作成
          </button>
        </div>

        {/* 下部ナビゲーション */}
        <div className="absolute bottom-0 w-full bg-white border-t flex justify-around py-3 px-2 z-30 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <div onClick={() => router.push('/')} className="flex flex-col items-center text-gray-400 cursor-pointer">
            <Home className="w-5 h-5" /><span className="text-[9px] mt-1 font-bold">ホーム</span>
          </div>
          <div className="flex flex-col items-center text-gray-400 cursor-pointer">
            <ShoppingBag className="w-5 h-5" /><span className="text-[9px] mt-1 font-bold">ひろば</span>
          </div>
          <div className="flex flex-col items-center text-gray-400 cursor-pointer">
            <Search className="w-5 h-5" /><span className="text-[9px] mt-1 font-bold">募集検索</span>
          </div>
          <div className="flex flex-col items-center text-[#2563EB] cursor-pointer">
            <FileText className="w-5 h-5" /><span className="text-[9px] mt-1 font-bold">募集管理</span>
          </div>
          <div className="flex flex-col items-center text-gray-400 cursor-pointer">
            <Bell className="w-5 h-5" /><span className="text-[9px] mt-1 font-bold">通知</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentManagement;