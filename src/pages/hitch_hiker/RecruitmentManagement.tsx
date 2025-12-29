import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Plus, Home, ShoppingBag, Search, FileText, Bell } from 'lucide-react';
import RecruitmentManagementCard from '../../components/hitch_hiker/RecruitmentManagementCard';

const RecruitmentManagement = () => {
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    // APIフェッチ想定: fetch('/api/my-recruitments').then(...)
    setData([
      { id: 1, status: 'OPEN', statusText: '募集中', from: '高知駅', to: '高知工科大学', date: '12-25', people: '2', price: '1200', applicantCount: 3 },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-hidden">
        
        <div className="bg-white/80 p-4 flex items-center justify-between border-b pt-10">
          <button onClick={() => router.back()}><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-lg font-bold">募集管理</h1>
          <Plus className="w-6 h-6 text-blue-600" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-24 scrollbar-hide">
          {data.map(item => <RecruitmentManagementCard key={item.id} item={item} />)}
        </div>

        {/* Bottom Nav */}
        <div className="absolute bottom-0 w-full bg-white border-t flex justify-around py-3 px-2">
          <div onClick={() => router.push('/')} className="flex flex-col items-center text-gray-400"><Home className="w-5 h-5" /><span className="text-[8px]">ホーム</span></div>
          <div className="flex flex-col items-center text-gray-400"><ShoppingBag className="w-5 h-5" /><span className="text-[8px]">ひろば</span></div>
          <div className="flex flex-col items-center text-gray-400"><Search className="w-5 h-5" /><span className="text-[8px]">募集検索</span></div>
          <div className="flex flex-col items-center text-blue-600"><FileText className="w-5 h-5" /><span className="text-[8px] font-bold">募集管理</span></div>
          <div className="flex flex-col items-center text-gray-400"><Bell className="w-5 h-5" /><span className="text-[8px]">通知</span></div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentManagement;