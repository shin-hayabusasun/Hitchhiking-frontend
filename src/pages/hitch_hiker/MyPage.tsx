// % Start(AI Assistant)
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, ChevronRight, MapPin, Loader2 } from 'lucide-react';
import { getApiUrl } from '@/config/api';

const MyPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchUserData = async () => {
      try {
        const response = await fetch(getApiUrl('/api/hitchhiker/mypage'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({}),
        });

        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        setUser(data);

      } catch (error) {
        console.error("Fetching error:", error);
      }
    };

    fetchUserData();
  }, [router.isReady]);

  if (!router.isReady || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <div className="text-gray-400 font-bold tracking-widest">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800 pb-24">
      
      {/* ヘッダー：背景は横いっぱい、中身は中央寄せ */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="text-gray-500 hover:bg-gray-50 p-2 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-black text-gray-800">マイページ</h1>
          <button 
            onClick={() => router.push('/hitch_hiker/EditMyPage')}
            className="text-sm font-black text-blue-500 hover:text-blue-600 transition-colors p-2"
          >
            編集
          </button>
        </div>
      </header>

      {/* メインコンテンツエリア：max-w-2xl で中央寄せ */}
      <main className="max-w-2xl mx-auto w-full p-5 space-y-6">
        
        {/* メインプロフィールカード */}
        <div className="bg-white rounded-[2.5rem] p-8 flex flex-col items-center shadow-sm border border-gray-50 mt-4 transition-all hover:shadow-md">
          {/* 名前の最初の1文字をアイコンにする */}
          <div className="w-24 h-24 bg-blue-50 rounded-full mb-4 flex items-center justify-center text-4xl font-black text-blue-500 shadow-inner ring-4 ring-blue-50/50">
            {user?.name?.[0] || "?"}
          </div>
          
          <h2 className="text-2xl font-black text-gray-800 mb-2">{user?.name}</h2>
          
          <div className="w-full grid grid-cols-3 border-t border-gray-50 mt-8 pt-6 mb-2">
            <div className="text-center">
              <div className="font-black text-xl text-gray-800">{user?.ride_count}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">利用回数</div>
            </div>
            <div className="text-center border-x border-gray-50 px-2">
              <div className="font-black text-xl text-gray-800 flex items-center justify-center">
                <span className="text-yellow-400 mr-1 text-sm">★</span>{user?.rating}
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">評価</div>
            </div>
            <div className="text-center">
              <div className="font-black text-gray-800 text-[13px] pt-1.5">{user?.reg_date}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">登録日</div>
            </div>
          </div>

          <div className="w-full border-t border-gray-50 mt-4 pt-4">
            <button 
              onClick={() => router.push('/hitch_hiker/MyRequest')} 
              className="w-full flex items-center justify-between group py-3 px-2 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-11 h-11 bg-blue-50 rounded-full flex items-center justify-center mr-4">
                  <MapPin className="w-5 h-5 text-blue-500" />
                </div>
                <span className="font-black text-gray-700">マイリクエスト</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-active:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* 自己紹介エリア */}
        <div className="bg-white rounded-[2rem] p-7 shadow-sm border border-gray-50">
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">About Me</h3>
          <p className="text-[15px] text-gray-700 leading-relaxed font-medium">
            {user?.bio || "自己紹介が未設定です。"}
          </p>
        </div>

      </main>
    </div>
  );
};

export default MyPage;
// % End