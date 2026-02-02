import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronRight, MapPin } from 'lucide-react';
import { HitchhikerHeader } from '@/components/hitch_hiker/Header';
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400 animate-pulse font-black uppercase text-xs tracking-widest">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
      {/* サイズのみ変更：
        スマホ枠（border-[8px], aspect-[9/19], rounded-[3rem]）を削除。
        他画面と共通の max-w-2xl に変更し、中央配置に。
      */}
      <div className="w-full min-h-screen flex flex-col relative">
        
        {/* ヘッダーセクション */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="max-w-2xl mx-auto w-full">
            <HitchhikerHeader 
              title="マイページ" 
              rightElement={
                <button 
                  onClick={() => router.push('/hitch_hiker/EditMyPage')}
                  className="text-sm font-black text-gray-400 hover:text-blue-600 transition-colors pr-4"
                >
                  編集
                </button>
              }
            />
          </div>
        </div>

        {/* メインコンテンツエリア */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto w-full p-4 space-y-4 pb-24">
            
            {/* メインプロフィールカード（内部デザインは維持） */}
            <div className="bg-white rounded-[2rem] p-8 flex flex-col items-center shadow-sm border border-gray-100">
              <div className="w-24 h-24 bg-blue-50 rounded-full mb-4 flex items-center justify-center text-3xl font-black text-blue-600 shadow-inner">
                {user?.name?.[0] || "?"}
              </div>
              
              <h2 className="text-xl font-black text-gray-800 mb-2">{user?.name}</h2>
              
              <div className="w-full grid grid-cols-3 border-t border-gray-50 mt-8 pt-6 mb-2">
                <div className="text-center">
                  <div className="font-black text-lg text-gray-800">{user?.ride_count}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">利用回数</div>
                </div>
                <div className="text-center border-x border-gray-50 px-2">
                  <div className="font-black text-lg text-gray-800 flex items-center justify-center">
                    <span className="text-yellow-400 mr-1 text-sm">★</span>{user?.rating}
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">評価</div>
                </div>
                <div className="text-center">
                  <div className="font-black text-gray-800 text-[12px] pt-1.5">{user?.reg_date}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">登録日</div>
                </div>
              </div>

              <div className="w-full border-t border-gray-50 mt-4 pt-4">
                <button 
                  onClick={() => router.push('/hitch_hiker/MyRequest')} 
                  className="w-full flex items-center justify-between group py-2"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-4">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-black text-gray-700">マイリクエスト</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-active:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* 自己紹介エリア（内部デザインは維持） */}
            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
              <h3 className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-3">自己紹介</h3>
              <p className="text-sm text-gray-700 leading-relaxed font-bold">
                {user?.bio || "自己紹介が未設定です。"}
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default MyPage;