import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, MapPin, Calendar, Eye, MessageCircle, Star } from 'lucide-react';

// 将来的にAPIから取得するデータの構造
const dummyRequests = {
  requesting: [
    { id: 1, name: '田中 太郎', rate: '4.8 (45回)', from: '東京駅', to: '横浜駅', date: '2025-11-05 09:00', price: '800', applied: '2025-11-03' },
  ],
  approved: [
    { id: 3, name: '鈴木 一郎', rate: '4.7 (32回)', from: '品川駅', to: '羽田空港', date: '2025-11-07 06:00', price: '1200', approvedDate: '2025-11-03' }
  ],
  completed: [
    { id: 4, name: '高橋 美咲', rate: '4.8 (56回)', from: '新宿駅', to: '箱根', date: '2025-11-01 08:00', price: '2500', doneDate: '2025-11-01', reviewed: false },
  ]
};

const MyRequest = () => {
  const router = useRouter();
  const [tab, setTab] = useState<'requesting' | 'approved' | 'completed'>('requesting');

  // 表示するデータの選択
  const currentItems = dummyRequests[tab] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 flex items-center border-b sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-2 mr-2"><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="text-lg font-bold">マイリクエスト</h1>
      </div>

      <div className="p-4">
        <div className="bg-gray-200 p-1 rounded-2xl flex">
          {['requesting', 'approved', 'completed'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                tab === t ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'
              }`}
            >
              {t === 'requesting' ? '申請中' : t === 'approved' ? '承認済み' : '完了'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-4 pb-20">
        {currentItems.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-medium">リクエストはありません</div>
        ) : (
          currentItems.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  tab === 'requesting' ? 'bg-yellow-50 text-yellow-600' :
                  tab === 'approved' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab === 'requesting' ? '● 承認待ち' : tab === 'approved' ? '✓ 承認済み' : '✓ 完了'}
                </span>
                <span className="text-[10px] text-gray-400">
                  日付: {item.applied || item.approvedDate || item.doneDate}
                </span>
              </div>

              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-800">{item.name}</div>
                  <div className="text-xs text-gray-400 flex items-center">
                    <Star className="w-3 h-3 text-yellow-400 mr-1 fill-yellow-400" /> {item.rate}
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-green-500" /> <span>{item.from}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-red-500" /> <span>{item.to}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 pt-1">
                  <Calendar className="w-4 h-4 mr-2" /> <span>{item.date}</span>
                  <span className="ml-auto text-green-600 font-bold text-lg">¥{item.price}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button className="w-full flex items-center justify-center border border-gray-200 py-3 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50">
                  <Eye className="w-4 h-4 mr-2" /> 詳細を見る
                </button>
                {(tab === 'requesting' || tab === 'approved') && (
                  <button className="w-full bg-blue-600 text-white py-3 rounded-2xl text-sm font-bold flex items-center justify-center shadow-md shadow-blue-100">
                    <MessageCircle className="w-4 h-4 mr-2" /> チャットする
                  </button>
                )}
                {tab === 'completed' && !item.reviewed && (
                  <button className="w-full bg-orange-500 text-white py-3 rounded-2xl text-sm font-bold flex items-center justify-center">
                    <Star className="w-4 h-4 mr-2" /> レビューを書く
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyRequest;