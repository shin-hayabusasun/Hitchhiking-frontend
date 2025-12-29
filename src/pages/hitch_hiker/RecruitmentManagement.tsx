import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, User, Bell, Plus } from 'lucide-react';
import RecruitmentManagementCard from '../../components/hitch_hiker/RecruitmentManagementCard';

const dummyRecruitments = [
  { id: 1, status: 'OPEN', statusText: '募集中', from: '東京駅', to: '横浜駅', date: '2025-11-10', people: '2', price: '1500', applicantCount: 3 },
  { id: 2, status: 'MATCHED', statusText: 'マッチング済み', partner: '田中 太郎', from: '渋谷駅', to: '箱根', date: '2025-11-15', people: '1', price: '3000', applicantCount: 0 }
];

const RecruitmentManagement = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('manage');

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* ★ 最新のスマホ枠コードを適用 */}
      <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto scrollbar-hide">
        
        <div className="bg-white/80 p-4 flex items-center justify-between border-b pt-8">
          <button onClick={() => router.back()} className="p-2"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-md font-bold text-blue-600">募集管理</h1>
          <div className="flex items-center space-x-2 text-gray-400"><User className="w-5 h-5" /><Bell className="w-5 h-5" /></div>
        </div>

        <div className="p-4 space-y-4 pb-24">
          <div className="bg-black/5 p-1 rounded-2xl flex">
            <button onClick={() => setActiveTab('search')} className={`flex-1 py-2 rounded-xl text-[10px] font-bold ${activeTab === 'search' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>募集検索</button>
            <button onClick={() => setActiveTab('manage')} className={`flex-1 py-2 rounded-xl text-[10px] font-bold relative ${activeTab === 'manage' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>
              募集管理 <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full shadow-sm">{dummyRecruitments.length}</span>
            </button>
          </div>

          {dummyRecruitments.map((item) => (
            <RecruitmentManagementCard key={item.id} item={item} />
          ))}
        </div>

        {/* Floating Button (スマホ枠コードに合わせて下部に固定) */}
        <div className="sticky bottom-6 px-6 mt-auto">
          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center shadow-xl shadow-blue-200 active:scale-95 transition-all text-sm">
            <Plus className="w-5 h-5 mr-2" /> 新しい募集を作成
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentManagement;