import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, MapPin, Calendar, Star, Eye, MessageCircle, Home, ShoppingBag, Search, FileText, Bell } from 'lucide-react';

const MyRequest = () => {
  const router = useRouter();
  const [tab, setTab] = useState<'requesting' | 'approved' | 'completed'>('requesting');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // APIから情報を取得する想定
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        // ここに実際のAPIエンドポイントを記述
        // const res = await fetch(`/api/hitch_hiker/requests?status=${tab}`);
        // const data = await res.json();
        
        // 現時点では画像に基づいたダミーデータをセット
        const dummyData = [
          {
            id: 1,
            status: tab === 'requesting' ? '承認待ち' : tab === 'approved' ? '承認済み' : '完了',
            date: '2025.11.03',
            name: '田中 太郎',
            rating: '4.8',
            reviews: '120',
            from: '高知駅',
            to: '香美市',
            time: '11-05 09:00',
            price: '800'
          },
          {
            id: 2,
            status: tab === 'requesting' ? '承認待ち' : tab === 'approved' ? '承認済み' : '完了',
            date: '2025.11.03',
            name: '佐藤 健太',
            rating: '4.5',
            reviews: '85',
            from: 'はりまや橋',
            to: '高知大学',
            time: '11-06 14:00',
            price: '500'
          }
        ];
        setRequests(dummyData);
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [tab]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* スマホ枠コンテナ */}
      <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gray-50 overflow-hidden">
        
        {/* Header */}
        <div className="bg-white p-4 flex items-center pt-8">
          <button onClick={() => router.back()} className="p-2 mr-2 text-gray-600"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold text-gray-700">マイリクエスト</h1>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white px-4 pb-2 flex border-b">
          {['requesting', 'approved', 'completed'].map((t) => (
            <button 
              key={t} 
              onClick={() => setTab(t as any)}
              className={`flex-1 py-2 text-sm font-bold border-b-2 transition-all ${tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}
            >
              {t === 'requesting' ? '申請中' : t === 'approved' ? '承認済み' : '完了'}
            </button>
          ))}
        </div>

        {/* Main Content (Scroll Area) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20 scrollbar-hide">
          {requests.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
              {/* Card Header */}
              <div className="p-4 flex justify-between items-center bg-white">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${tab === 'requesting' ? 'bg-yellow-400' : 'bg-green-500'}`}></span>
                  <span className={`text-xs font-bold ${tab === 'requesting' ? 'text-yellow-600' : 'text-green-600'}`}>{item.status}</span>
                </div>
                <span className="text-[10px] text-gray-400 font-medium">申請日：{item.date}</span>
              </div>

              {/* User Info */}
              <div className="px-4 flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">{item.name[0]}</div>
                <div>
                  <div className="font-bold text-gray-800 text-sm">{item.name}</div>
                  <div className="flex items-center text-[10px] text-gray-400">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
                    {item.rating} <span className="ml-1">({item.reviews}件)</span>
                  </div>
                </div>
              </div>

              {/* Route Info */}
              <div className="p-4 space-y-2">
                <div className="flex items-center text-xs font-bold text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-green-500" /> {item.from}
                </div>
                <div className="flex items-center text-xs font-bold text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-red-500" /> {item.to}
                </div>
                <div className="flex items-center text-[10px] text-gray-500 pt-1">
                  <Calendar className="w-3 h-3 mr-2" /> {item.time}
                  <span className="ml-auto text-green-600 font-bold text-base">¥{item.price}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 space-y-2">
                <button className="w-full flex items-center justify-center py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50">
                  <Eye className="w-4 h-4 mr-2" /> 詳細を見る
                </button>
                
                {tab === 'completed' ? (
                  <button className="w-full flex items-center justify-center py-3 rounded-xl bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-100">
                    <Star className="w-4 h-4 mr-2" /> レビューを書く
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-500">取り消し</button>
                    <button className="flex-[2] py-3 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-blue-100">
                      <MessageCircle className="w-4 h-4 mr-2" /> チャット
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="absolute bottom-0 w-full bg-white border-t flex justify-around py-3 px-2 z-20">
          <div className="flex flex-col items-center text-blue-600"><Home className="w-6 h-6" /><span className="text-[8px] font-bold mt-1">ホーム</span></div>
          <div className="flex flex-col items-center text-gray-400"><ShoppingBag className="w-6 h-6" /><span className="text-[8px] font-bold mt-1">ひろば</span></div>
          <div className="flex flex-col items-center text-gray-400"><Search className="w-6 h-6" /><span className="text-[8px] font-bold mt-1">募集検索</span></div>
          <div className="flex flex-col items-center text-gray-400"><FileText className="w-6 h-6" /><span className="text-[8px] font-bold mt-1">募集管理</span></div>
          <div className="flex flex-col items-center text-gray-400"><Bell className="w-6 h-6" /><span className="text-[8px] font-bold mt-1">お知らせ</span></div>
        </div>
      </div>
    </div>
  );
};

export default MyRequest;