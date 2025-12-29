import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, User, Bell, MapPin, Calendar, Users, MessageCircle, Plus, Trash2, Edit3 } from 'lucide-react';

// API接続を想定したデータの配列
const dummyRecruitments = [
  { id: 1, status: 'OPEN', statusText: '募集中', from: '東京駅', to: '横浜駅', date: '2025-11-10', people: '2', price: '1500', applicantCount: 3 },
  { id: 2, status: 'MATCHED', statusText: 'マッチング済み', partner: '田中 太郎', from: '渋谷駅', to: '箱根', date: '2025-11-15', people: '1', price: '3000', applicantCount: 0 }
];

const RecruitmentManagement = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('manage');

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-4 flex items-center justify-between border-b">
        <button onClick={() => router.back()} className="p-2"><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="text-lg font-bold text-blue-600">同乗者として利用</h1>
        <div className="flex items-center space-x-3">
          <User className="w-6 h-6 text-gray-400" />
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-400" />
            <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white"></span>
          </div>
        </div>
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
            <div key={item.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.status === 'OPEN' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                  {item.statusText}
                </span>
                <span className="text-xs font-bold text-gray-400">
                  {item.status === 'MATCHED' ? `${item.partner}さんと成立` : `${item.applicantCount}件の申請`}
                </span>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm font-bold text-gray-700"><MapPin className="w-4 h-4 mr-2 text-green-500" /> {item.from}</div>
                <div className="flex items-center text-sm font-bold text-gray-700"><MapPin className="w-4 h-4 mr-2 text-red-500" /> {item.to}</div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-2">
                  <div className="flex items-center text-xs text-gray-500"><Calendar className="w-4 h-4 mr-1" /> {item.date}</div>
                  <div className="flex items-center text-xs text-gray-500"><Users className="w-4 h-4 mr-1" /> {item.people}名</div>
                  <div className="text-green-600 font-bold text-lg">¥{item.price} <span className="text-[10px] text-gray-400 font-normal">/人</span></div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {item.status === 'OPEN' ? (
                  <>
                    <button className="flex-1 border border-gray-200 py-3 rounded-2xl flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50"><Edit3 className="w-4 h-4 mr-2" /> 編集</button>
                    <button className="flex-1 border border-red-100 py-3 rounded-2xl flex items-center justify-center font-bold text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4 mr-2" /> 削除</button>
                  </>
                ) : (
                  <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center shadow-lg shadow-blue-100 active:scale-95 transition-all">
                    <MessageCircle className="w-5 h-5 mr-2" /> 運転者とチャットする
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="fixed bottom-6 left-6 right-6">
        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center shadow-xl shadow-blue-200 active:scale-95 transition-all">
          <Plus className="w-5 h-5 mr-2" /> 新しい募集を作成
        </button>
      </div>
    </div>
  );
};

export default RecruitmentManagement;