import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, MapPin, Calendar, Star, Eye, MessageCircle, Home, ShoppingBag, Search, FileText, Bell } from 'lucide-react';

const MyRequest = () => {
  const router = useRouter();
  const [tab, setTab] = useState<'requesting' | 'approved' | 'completed'>('requesting');
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    // APIからデータを取得する処理をここに記述
    // fetch('/api/requests').then(...)
    setRequests([
      { id: 1, name: '田中 太郎', rating: '4.8', reviews: '120', from: '高知駅', to: '香美市', date: '2025.11.03', time: '11-05 09:00', price: '800' }
    ]);
  }, [tab]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto scrollbar-hide">
        
        {/* Header */}
        <div className="bg-white p-4 flex items-center pt-10 sticky top-0 z-20 border-b border-gray-100">
          <button onClick={() => router.back()} className="p-1"><ArrowLeft className="w-6 h-6 text-gray-500" /></button>
          <h1 className="text-lg font-bold text-gray-700 ml-4">マイリクエスト</h1>
        </div>

        {/* Tabs */}
        <div className="bg-white flex px-6 py-2 sticky top-[73px] z-20 shadow-sm">
          {['requesting', 'approved', 'completed'].map((t) => (
            <button key={t} onClick={() => setTab(t as any)} className={`flex-1 py-2 text-[11px] font-bold transition-all ${tab === t ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 border-b-2 border-transparent'}`}>
              {t === 'requesting' ? '申請中' : t === 'approved' ? '承認済み' : '完了'}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-4 pb-24">
          {requests.map((item) => (
            <div key={item.id} className="bg-white/90 backdrop-blur-sm rounded-[2rem] p-5 shadow-sm border border-white/50">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${tab === 'requesting' ? 'bg-yellow-400' : 'bg-green-500'}`}></span>
                  <span className="text-[11px] font-bold text-gray-500">{tab === 'requesting' ? '承認待ち' : '確定'}</span>
                </div>
                <span className="text-[10px] text-gray-400">申請日：{item.date}</span>
              </div>

              <div className="flex items-center space-x-3 mb-4">
                <div className="w-11 h-11 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 shadow-inner">{item.name[0]}</div>
                <div>
                  <div className="font-bold text-sm text-gray-800">{item.name}</div>
                  <div className="flex items-center text-[10px] text-gray-400">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" /> {item.rating} <span className="ml-1">({item.reviews})</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 mb-4 text-[13px] font-bold text-gray-600">
                <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-green-500" /> {item.from}</div>
                <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-red-500" /> {item.to}</div>
                <div className="flex items-center pt-1 text-[11px] text-gray-400 font-normal">
                  <Calendar className="w-3.5 h-3.5 mr-2" /> {item.time} <span className="ml-auto text-green-600 font-extrabold text-lg">¥{item.price}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button className="w-full py-2 rounded-xl border border-gray-200 text-[11px] font-bold text-gray-500 flex items-center justify-center"><Eye className="w-4 h-4 mr-2" /> 詳細を見る</button>
                {tab === 'completed' ? (
                  <button className="w-full py-3 rounded-xl bg-orange-500 text-white text-[11px] font-bold flex items-center justify-center shadow-lg shadow-orange-100">
                    <Star className="w-4 h-4 mr-2" /> レビューを書く
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button className="flex-1 py-3 rounded-xl bg-gray-100 text-[11px] font-bold text-gray-500">取り消し</button>
                    <button className="flex-[2.5] py-3 rounded-xl bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow-lg shadow-blue-100">
                      <MessageCircle className="w-4 h-4 mr-2" /> チャット
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Nav */}
        <div className="absolute bottom-0 w-full bg-white border-t flex justify-around py-3 px-2 z-30">
          <div className="flex flex-col items-center text-blue-600"><Home className="w-5 h-5" /><span className="text-[9px] mt-1 font-bold">ホーム</span></div>
          <div className="flex flex-col items-center text-gray-400"><ShoppingBag className="w-5 h-5" /><span className="text-[9px] mt-1">ひろば</span></div>
          <div className="flex flex-col items-center text-gray-400"><Search className="w-5 h-5" /><span className="text-[9px] mt-1">募集検索</span></div>
          <div className="flex flex-col items-center text-gray-400"><FileText className="w-5 h-5" /><span className="text-[9px] mt-1">募集管理</span></div>
          <div className="flex flex-col items-center text-gray-400"><Bell className="w-5 h-5" /><span className="text-[9px] mt-1">通知</span></div>
        </div>
      </div>
    </div>
  );
};

export default MyRequest;