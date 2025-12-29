import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, MapPin, Calendar, Star, Eye, MessageCircle, Home, ShoppingBag, Search, FileText, Bell, Clock, CheckCircle2 } from 'lucide-react';

const MyRequest = () => {
  const router = useRouter();
  const [tab, setTab] = useState<'requesting' | 'approved' | 'completed'>('requesting');
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    // 画像に基づいたダミーデータ
    if (tab === 'requesting') {
      setRequests([
        { id: 1, name: '田中 太郎', rating: '4.8', reviews: '45', from: '東京駅', to: '横浜駅', date: '2025-11-03', time: '2025-11-05 09:00', price: '800' },
        { id: 2, name: '佐藤 花子', rating: '4.9', reviews: '78', from: '渋谷駅', to: '新宿駅', date: '2025-11-03', time: '2025-11-06 14:30', price: '500' }
      ]);
    } else if (tab === 'approved') {
      setRequests([{ id: 3, name: '鈴木 一郎', rating: '4.7', reviews: '32', from: '品川駅', to: '羽田空港', date: '2025-11-03', time: '2025-11-07 06:00', price: '1200' }]);
    } else {
      setRequests([{ id: 4, name: '高橋 美咲', rating: '4.8', reviews: '56', from: '新宿駅', to: '箱根', date: '2025-11-01', time: '2025-11-01 08:00', price: '2500' }]);
    }
  }, [tab]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col border-[8px] border-white relative ring-1 ring-gray-200 bg-[#F1F5F9] overflow-hidden rounded-[3rem]">
        
        <div className="bg-white p-4 flex items-center pt-10 sticky top-0 z-20 border-b border-gray-50">
          <button onClick={() => router.back()} className="p-1"><ArrowLeft className="w-6 h-6 text-gray-500" /></button>
          <h1 className="text-lg font-bold text-gray-700 ml-4">マイリクエスト</h1>
        </div>

        {/* 画像通りのタブ：グレー背景に白ボタン */}
        <div className="px-5 py-4 bg-white">
          <div className="bg-[#E2E8F0] p-1 rounded-2xl flex">
            {['requesting', 'approved', 'completed'].map((t) => (
              <button key={t} onClick={() => setTab(t as any)} className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition-all ${tab === t ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>
                {t === 'requesting' ? '申請中' : t === 'approved' ? '承認済み' : '完了'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 scrollbar-hide">
          {requests.map((item) => (
            <div key={item.id} className="bg-white rounded-[1.8rem] p-5 shadow-sm border border-white">
              <div className="flex justify-between items-start mb-3">
                {/* 画像通りのステータスラベル */}
                {tab === 'requesting' ? (
                  <div className="flex items-center bg-yellow-50 text-yellow-600 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-yellow-100">
                    <Clock className="w-3 h-3 mr-1" /> 承認待ち
                  </div>
                ) : (
                  <div className="flex items-center bg-green-50 text-green-600 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-green-100">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> {tab === 'approved' ? '承認済み' : '完了'}
                  </div>
                )}
                <span className="text-[10px] text-gray-400">申請日: {item.date}</span>
              </div>

              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-[#E0EDFF] rounded-full flex items-center justify-center font-bold text-[#3B82F6] text-lg">{item.name[0]}</div>
                <div>
                  <div className="font-extrabold text-[14px] text-gray-800">{item.name}</div>
                  <div className="flex items-center text-[11px] text-gray-400 font-bold">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" /> {item.rating} <span className="ml-1 opacity-70">({item.reviews}回)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-[13px] font-bold text-gray-600">
                  <MapPin className="w-4 h-4 mr-3 text-green-500" /> {item.from}
                </div>
                <div className="flex items-center text-[13px] font-bold text-gray-600">
                  <MapPin className="w-4 h-4 mr-3 text-red-500" /> {item.to}
                </div>
                <div className="flex items-center pt-2 text-[11px] text-gray-400 border-t border-gray-50 mt-2">
                  <Calendar className="w-4 h-4 mr-2" /> {item.time} 
                  <span className="ml-auto text-[#059669] font-black text-lg">
                    <span className="text-[14px] mr-1">¥</span>{item.price}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button className="w-full py-2.5 rounded-xl border border-gray-100 text-[11px] font-bold text-gray-500 flex items-center justify-center bg-white"><Eye className="w-4 h-4 mr-2" /> 詳細を見る</button>
                {tab === 'completed' ? (
                   <button className="w-full py-3.5 rounded-xl bg-[#D97706] text-white text-[11px] font-bold flex items-center justify-center shadow-lg shadow-orange-100 active:scale-95 transition-all">
                     <Star className="w-4 h-4 mr-2" /> レビューを書く
                   </button>
                ) : (
                  <div className="flex space-x-2">
                    <button className="flex-1 py-3.5 rounded-xl bg-white border border-gray-100 text-[11px] font-bold text-gray-400">取り消し</button>
                    <button className="flex-[2] py-3.5 rounded-xl bg-[#2563EB] text-white text-[11px] font-bold flex items-center justify-center shadow-lg shadow-blue-100 active:scale-95 transition-all">
                      <MessageCircle className="w-4 h-4 mr-2" /> チャット
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Nav (MyPageと同じため省略。実際はそのまま維持) */}
      </div>
    </div>
  );
};

export default MyRequest;