import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, ShieldCheck, ChevronRight, Home, ShoppingBag, Search, FileText, Bell } from 'lucide-react';

const MyPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // APIフェッチ想定
    setUser({ name: "山田 太郎", rating: 4.8, count: 15 });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-hidden">
        
        <div className="p-4 flex items-center justify-between pt-10">
          <button onClick={() => router.back()}><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-lg font-bold">マイページ</h1>
          <div className="w-6" />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24 scrollbar-hide">
          <div className="bg-white/90 rounded-[3rem] p-8 flex flex-col items-center shadow-sm">
            <div className="w-24 h-24 bg-blue-100 rounded-full mb-4 flex items-center justify-center text-2xl font-bold text-blue-600">{user?.name[0]}</div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <div className="flex items-center text-blue-600 text-[10px] font-bold mt-2 bg-blue-50 px-3 py-1 rounded-full"><ShieldCheck className="w-3 h-3 mr-1" />本人確認済み</div>
          </div>

          <button onClick={() => router.push('/hitch_hiker/MyRequest')} className="w-full bg-blue-600 text-white p-5 rounded-3xl flex justify-between items-center shadow-lg shadow-blue-200">
            <span className="font-bold">マイリクエスト</span>
            <ChevronRight />
          </button>
        </div>

        {/* Bottom Nav */}
        <div className="absolute bottom-0 w-full bg-white border-t flex justify-around py-3 px-2">
          <div className="flex flex-col items-center text-blue-600"><Home className="w-5 h-5" /><span className="text-[8px] font-bold">ホーム</span></div>
          {/* ... 他のアイコン ... */}
        </div>
      </div>
    </div>
  );
};

export default MyPage;