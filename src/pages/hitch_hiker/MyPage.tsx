import React from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, ChevronRight, ShieldCheck } from 'lucide-react';

const userData = {
  name: "山田 太郎",
  initial: "山",
  rating: 4.7,
  usageCount: 12,
  joinDate: "2024-01",
  bio: "よろしくお願いします！",
  hobbies: "旅行、写真、カフェ巡り",
  purpose: "通勤・出張"
};

const MyPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* ★ 最新のスマホ枠コードを適用 */}
      <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto scrollbar-hide">
        
        {/* Header (stickyを使いたい場合は、枠自体がスクロールするので工夫が必要ですが、まずはシンプルに配置します) */}
        <div className="bg-white/80 backdrop-blur-sm p-4 flex items-center justify-between border-b pt-8">
          <button onClick={() => router.back()} className="p-2"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-lg font-bold text-gray-800">マイページ</h1>
          <button className="text-blue-600 font-medium text-sm">編集</button>
        </div>

        <div className="p-4 space-y-4 pb-10">
          <div className="bg-white/90 rounded-3xl shadow-sm border border-white/50 p-8 flex flex-col items-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-3xl font-bold text-blue-600">{userData.initial}</div>
            <h2 className="text-xl font-bold mb-1">{userData.name}</h2>
            <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full mb-6 text-[10px] text-blue-700 font-bold">本人確認済み</div>
            <div className="w-full flex justify-around border-t pt-6 text-center">
              <div><div className="font-bold text-lg">{userData.usageCount}</div><div className="text-gray-400 text-[10px]">利用回数</div></div>
              <div><div className="font-bold text-lg">★ {userData.rating}</div><div className="text-gray-400 text-[10px]">評価</div></div>
              <div><div className="font-bold text-lg text-xs pt-1.5">{userData.joinDate}〜</div><div className="text-gray-400 text-[10px]">登録日</div></div>
            </div>
          </div>
          <button onClick={() => router.push('/hitch_hiker/MyRequest')} className="w-full flex items-center justify-between p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-all">
            <span className="font-bold text-sm">マイリクエスト</span>
            <ChevronRight className="w-5 h-5 opacity-50" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;