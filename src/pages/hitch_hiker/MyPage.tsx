import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, ShieldCheck, ChevronRight, Home, ShoppingBag, Search, FileText, Bell, MapPin } from 'lucide-react';

const MyPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser({ name: "山田 太郎", rating: 4.7, count: 12, date: "2024-01" });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col border-[8px] border-white relative ring-1 ring-gray-200 bg-[#F8FAFC] overflow-y-auto scrollbar-hide rounded-[3rem]">
        
        <div className="p-4 flex items-center justify-between pt-10 px-6">
          <button onClick={() => router.back()} className="text-gray-500"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-lg font-bold text-gray-700">マイページ</h1>
          <button className="text-sm font-bold text-gray-500">編集</button>
        </div>

        <div className="p-4 space-y-4 pb-24">
          {/* メインプロフィールカード */}
          <div className="bg-white rounded-[2rem] p-8 flex flex-col items-center shadow-sm border border-gray-100/50">
            <div className="w-24 h-24 bg-[#E0EDFF] rounded-full mb-4 flex items-center justify-center text-3xl font-bold text-[#3B82F6] shadow-inner">
              {user?.name[0]}
            </div>
            <h2 className="text-xl font-extrabold text-gray-800 mb-2">{user?.name}</h2>
            <div className="flex items-center text-[#3B82F6] text-[10px] font-bold bg-[#EEF2FF] px-4 py-1.5 rounded-full border border-[#E0E7FF]">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> 本人確認済み
            </div>

            {/* 統計セクション - 画像通りのグレーの細線 */}
            <div className="w-full grid grid-cols-3 border-t border-gray-100 mt-8 pt-6 mb-2">
              <div className="text-center">
                <div className="font-bold text-lg text-gray-800">{user?.count}</div>
                <div className="text-[10px] text-gray-400">利用回数</div>
              </div>
              <div className="text-center border-x border-gray-50 px-2">
                <div className="font-bold text-lg text-gray-800 flex items-center justify-center">
                  <span className="text-yellow-400 mr-1 text-sm">★</span>{user?.rating}
                </div>
                <div className="text-[10px] text-gray-400">評価</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-gray-800 text-[14px] pt-1">{user?.date}～</div>
                <div className="text-[10px] text-gray-400">登録日</div>
              </div>
            </div>
            <div className="w-full border-t border-gray-100 mt-4 pt-4">
              <button onClick={() => router.push('/hitch_hiker/MyRequest')} className="w-full flex items-center justify-between group">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#E0EDFF] rounded-full flex items-center justify-center mr-4">
                    <MapPin className="w-5 h-5 text-[#3B82F6]" />
                  </div>
                  <span className="font-bold text-gray-700">マイリクエスト</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-active:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* 自己紹介エリア */}
          <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100/50">
            <h3 className="text-[13px] font-bold text-gray-500 mb-2">自己紹介</h3>
            <p className="text-sm text-gray-700 leading-relaxed">よろしくお願いします！</p>
          </div>

          <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100/50">
            <h3 className="text-[13px] font-bold text-gray-500 mb-2">趣味</h3>
            <p className="text-sm text-gray-700">旅行、写真、カフェ巡り</p>
          </div>
        </div>

        {/* Footer Nav */}
        <div className="absolute bottom-0 w-full bg-white/90 backdrop-blur-md border-t flex justify-around py-3 px-2 z-30">
          <div className="flex flex-col items-center text-[#3B82F6]"><Home className="w-5 h-5" /><span className="text-[9px] mt-1 font-bold">ホーム</span></div>
          <div className="flex flex-col items-center text-gray-300"><ShoppingBag className="w-5 h-5" /><span className="text-[9px] mt-1">ひろば</span></div>
          <div className="flex flex-col items-center text-gray-300"><Search className="w-5 h-5" /><span className="text-[9px] mt-1">募集検索</span></div>
          <div className="flex flex-col items-center text-gray-300"><FileText className="w-5 h-5" /><span className="text-[9px] mt-1">募集管理</span></div>
          <div className="flex flex-col items-center text-gray-300"><Bell className="w-5 h-5" /><span className="text-[9px] mt-1">通知</span></div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;