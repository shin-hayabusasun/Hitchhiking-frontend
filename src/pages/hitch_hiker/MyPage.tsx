import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, ShieldCheck, ChevronRight, Home, ShoppingBag, Search, FileText, Bell } from 'lucide-react';

const MyPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // APIフェッチ想定
    setUser({ name: "山田 太郎", rating: 4.8, count: 15, date: "2024-01" });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto scrollbar-hide">
        
        <div className="p-4 flex items-center pt-10 sticky top-0 z-20">
          <button onClick={() => router.back()} className="p-1 text-gray-500"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-lg font-bold text-gray-700 ml-4">マイページ</h1>
        </div>

        <div className="p-6 space-y-4 pb-24">
          <div className="bg-white rounded-[3rem] p-8 flex flex-col items-center shadow-sm relative overflow-hidden">
            <div className="w-24 h-24 bg-blue-100 rounded-full mb-4 flex items-center justify-center text-3xl font-bold text-blue-600">{user?.name[0]}</div>
            <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
            <div className="flex items-center text-blue-600 text-[10px] font-bold mt-2 bg-blue-50 px-4 py-1.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> 本人確認済み
            </div>
            <div className="w-full flex justify-around border-t border-gray-50 mt-8 pt-6">
              <div className="text-center"><div className="font-bold text-lg">{user?.count}</div><div className="text-[10px] text-gray-400 uppercase">利用回数</div></div>
              <div className="text-center"><div className="font-bold text-lg">★ {user?.rating}</div><div className="text-[10px] text-gray-400 uppercase">評価</div></div>
              <div className="text-center"><div className="font-bold text-lg text-sm pt-1.5">{user?.date}</div><div className="text-[10px] text-gray-400 uppercase">登録日</div></div>
            </div>
          </div>

          <button onClick={() => router.push('/hitch_hiker/MyRequest')} className="w-full bg-blue-600 text-white p-5 rounded-[2rem] flex justify-between items-center shadow-xl shadow-blue-200 active:scale-[0.98] transition-all">
            <div className="flex items-center"><FileText className="w-5 h-5 mr-3" /><span className="font-bold">マイリクエスト</span></div>
            <ChevronRight className="w-5 h-5 opacity-50" />
          </button>
        </div>

        {/* Footer Nav */}
        <div className="absolute bottom-0 w-full bg-white border-t flex justify-around py-3 px-2 z-30">
          <div className="flex flex-col items-center text-blue-600"><Home className="w-5 h-5" /><span className="text-[9px] mt-1 font-bold">ホーム</span></div>
          <div className="flex flex-col items-center text-gray-400"><ShoppingBag className="w-5 h-5" /><span className="text-[9px] mt-1">ひろば</span></div>
          <div className="flex flex-col items-center text-gray-400"><Search className="w-5 h-5" /><span className="text-[9px] mt-1">募集検索</span></div>
          <div className="flex flex-col items-center text-gray-400"><FileText className="w-5 h-5" /><span className="text-[9px] mt-1 font-bold">募集管理</span></div>
          <div className="flex flex-col items-center text-gray-400"><Bell className="w-5 h-5" /><span className="text-[9px] mt-1">通知</span></div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;