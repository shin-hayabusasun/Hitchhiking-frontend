import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, MapPin, Calendar, Star, MessageCircle } from 'lucide-react';

const dummyRequests = {
  requesting: [{ id: 1, name: '田中 太郎', rate: '4.8', from: '東京駅', to: '横浜駅', date: '11-05 09:00', price: '800' }],
  approved: [], completed: []
};

const MyRequest = () => {
  const router = useRouter();
  const [tab, setTab] = useState<'requesting' | 'approved' | 'completed'>('requesting');

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* ★ 最新のスマホ枠コードを適用 */}
      <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto scrollbar-hide">
        
        <div className="bg-white/80 p-4 flex items-center border-b pt-8">
          <button onClick={() => router.back()} className="p-2 mr-2"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-lg font-bold">マイリクエスト</h1>
        </div>

        <div className="p-4 space-y-4 pb-10">
          <div className="bg-black/5 p-1 rounded-2xl flex">
            {['requesting', 'approved', 'completed'].map((t) => (
              <button key={t} onClick={() => setTab(t as any)} className={`flex-1 py-2 rounded-xl text-[10px] font-bold ${tab === t ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}>
                {t === 'requesting' ? '申請中' : t === 'approved' ? '承認済み' : '完了'}
              </button>
            ))}
          </div>

          {dummyRequests[tab].map((item) => (
            <div key={item.id} className="bg-white/80 rounded-3xl p-5 shadow-sm border border-white/50 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">{item.name[0]}</div>
                <div>
                  <div className="font-bold text-sm">{item.name}</div>
                  <div className="text-[10px] text-gray-400 flex items-center"><Star className="w-3 h-3 text-yellow-400 mr-1 fill-yellow-400" /> {item.rate}</div>
                </div>
              </div>
              <div className="space-y-1 mb-4 text-xs text-gray-600">
                <div className="flex items-center"><MapPin className="w-3 h-3 mr-2 text-green-500" /> {item.from}</div>
                <div className="flex items-center"><MapPin className="w-3 h-3 mr-2 text-red-500" /> {item.to}</div>
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-2xl text-xs font-bold shadow-md shadow-blue-100">チャットする</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyRequest;