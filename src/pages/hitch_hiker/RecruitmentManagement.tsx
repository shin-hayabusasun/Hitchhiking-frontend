import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, User, Bell, Plus } from 'lucide-react';
// 新しいファイル名に合わせて読み込み
import RecruitmentManagementCard from '../../components/hitch_hiker/RecruitmentManagementCard';

const dummyRecruitments = [
  { id: 1, status: 'OPEN', statusText: '募集中', from: '東京駅', to: '横浜駅', date: '2025-11-10', people: '2', price: '1500', applicantCount: 3 },
  { id: 2, status: 'MATCHED', statusText: 'マッチング済み', partner: '田中 太郎', from: '渋谷駅', to: '箱根', date: '2025-11-15', people: '1', price: '3000', applicantCount: 0 }
];

const RecruitmentManagement = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('manage');

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-4 flex items-center justify-between border-b sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-2"><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="text-lg font-bold text-blue-600">同乗者として利用</h1>
        <div className="flex items-center space-x-3 text-gray-400"><User className="w-6 h-6" /><Bell className="w-6 h-6" /></div>
      </div>

      <div className="p-4">
        <div className="bg-gray-200 p-1 rounded-2xl flex">
          <button onClick={() => setActiveTab('search')} className={`flex-1 py-3 rounded-xl text-sm font-bold ${activeTab === 'search' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>募集検索</button>
          <button onClick={() => setActiveTab('manage')} className={`flex-1 py-3 rounded-xl text-sm font-bold relative ${activeTab === 'manage' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>
            募集管理 <span className="absolute top-2 right-4 bg-blue-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">{dummyRecruitments.length}</span>
          </button>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {dummyRecruitments.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-medium">管理中の募集はありません</div>
        ) : (
          dummyRecruitments.map((item) => (
            // ここで新しいコンポーネント名を使用
            <RecruitmentManagementCard key={item.id} item={item} />
          ))
        )}
      </div>

      <div className="fixed bottom-6 left-6 right-6">
        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center shadow-xl active:scale-95 transition-all">
          <Plus className="w-5 h-5 mr-2" /> 新しい募集を作成
        </button>
      </div>
    </div>
  );
};

export default RecruitmentManagement;