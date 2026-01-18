import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, ChevronRight, MapPin } from 'lucide-react';

const MyPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchUserData = async () => {
      try {
        // バックエンドが別ポート（8000）で動いている場合は、環境に合わせてパスを調整してください
        const response = await fetch('http://54.165.126.189:8000/api/hitchhiker/mypage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({}),
        });

        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        // APIから返ってきたデータをそのままセット（data.nameが含まれている想定）
        setUser(data);

      } catch (error) {
        console.error("Fetching error:", error);
      }
    };

    fetchUserData();
  }, [router.isReady]);

  if (!router.isReady || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400 animate-pulse">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col border-[8px] border-white relative ring-1 ring-gray-200 bg-[#F8FAFC] overflow-y-auto scrollbar-hide rounded-[3rem]">
        
        {/* ヘッダー */}
        <div className="p-4 flex items-center justify-between pt-10 px-6">
          <button onClick={() => router.back()} className="text-gray-500">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-700">マイページ</h1>
          <button 
            onClick={() => router.push('/hitch_hiker/EditMyPage')}
            className="text-sm font-bold text-gray-500 hover:text-[#3B82F6] transition-colors"
          >
            編集
          </button>
        </div>

        <div className="p-4 space-y-4 pb-24">
          {/* メインプロフィールカード */}
          <div className="bg-white rounded-[2rem] p-8 flex flex-col items-center shadow-sm border border-gray-100/50">
            {/* 名前の最初の1文字をアイコンにする */}
            <div className="w-24 h-24 bg-[#E0EDFF] rounded-full mb-4 flex items-center justify-center text-3xl font-bold text-[#3B82F6] shadow-inner">
              {user?.name?.[0] || "?"}
            </div>
            
            {/* APIから取得した名前を表示 */}
            <h2 className="text-xl font-extrabold text-gray-800 mb-2">{user?.name}</h2>
            
            <div className="w-full grid grid-cols-3 border-t border-gray-100 mt-8 pt-6 mb-2">
              <div className="text-center">
                <div className="font-bold text-lg text-gray-800">{user?.ride_count}</div>
                <div className="text-[10px] text-gray-400">利用回数</div>
              </div>
              <div className="text-center border-x border-gray-50 px-2">
                <div className="font-bold text-lg text-gray-800 flex items-center justify-center">
                  <span className="text-yellow-400 mr-1 text-sm">★</span>{user?.rating}
                </div>
                <div className="text-[10px] text-gray-400">評価</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-800 text-[12px] pt-1.5">{user?.reg_date}</div>
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
            <p className="text-sm text-gray-700 leading-relaxed">
              {user?.bio || "自己紹介が未設定です。"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;