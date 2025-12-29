import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Plus, Home, ShoppingBag, Search, FileText, Bell } from 'lucide-react';
import RecruitmentManagementCard from '../../components/hitch_hiker/RecruitmentManagementCard';

const RecruitmentManagement = () => {
  const router = useRouter();
  const [recruitments, setRecruitments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ★ APIから情報を取得する想定
        // const response = await fetch('/api/hitch-hiker/recruitments');
        // const data = await response.json();
        
        // 画像イメージに合わせたダミーデータ
        const data = [
          { id: 1, status: 'OPEN', statusText: '募集中', appliedDate: '2025.12.21', from: '高知駅', to: '高知工科大学', date: '12-25 09:00', people: '2', price: '1200', applicantCount: 3 },
          { id: 2, status: 'MATCHED', statusText: 'マッチ済み', appliedDate: '2025.12.20', from: 'はりまや橋', to: '桂浜', date: '12-28 14:00', people: '1', price: '800', applicantCount: 1 }
        ];
        setRecruitments(data as any);
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
      <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-hidden">
        
        {/* ヘッダー */}
        <div className="bg-white/80 backdrop-blur-sm p-4 flex items-center justify-between border-b pt-10 sticky top-0 z-20">
          <button onClick={() => router.back()} className="p-1 text-gray-500"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-lg font-bold text-gray-700">募集管理</h1>
          <button className="p-1 text-blue-600"><Plus className="w-6 h-6" /></button>
        </div>

        {/* リスト表示エリア */}
        <div className="flex-1 overflow-y-auto p-4 pb-24 scrollbar-hide">
          {loading ? (
            <div className="flex justify-center py-20 text-gray-400 text-sm">読み込み中...</div>
          ) : (
            recruitments.map((item: any) => (
              <RecruitmentManagementCard key={item.id} item={item} />
            ))
          )}
        </div>

        {/* 下部ナビゲーション (画像通り) */}
        <div className="absolute bottom-0 w-full bg-white border-t flex justify-around py-3 px-2 z-30 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <div onClick={() => router.push('/')} className="flex flex-col items-center text-gray-400 cursor-pointer">
            <Home className="w-5 h-5" /><span className="text-[9px] mt-1">ホーム</span>
          </div>
          <div className="flex flex-col items-center text-gray-400 cursor-pointer">
            <ShoppingBag className="w-5 h-5" /><span className="text-[9px] mt-1">ひろば</span>
          </div>
          <div className="flex flex-col items-center text-gray-400 cursor-pointer">
            <Search className="w-5 h-5" /><span className="text-[9px] mt-1">募集検索</span>
          </div>
          <div className="flex flex-col items-center text-blue-600 cursor-pointer">
            <FileText className="w-5 h-5" /><span className="text-[9px] mt-1 font-bold">募集管理</span>
          </div>
          <div className="flex flex-col items-center text-gray-400 cursor-pointer">
            <Bell className="w-5 h-5" /><span className="text-[9px] mt-1">通知</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentManagement;