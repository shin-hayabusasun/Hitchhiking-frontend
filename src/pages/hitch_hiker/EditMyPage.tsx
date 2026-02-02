import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Check, Loader2, Camera } from 'lucide-react';
import { getApiUrl } from '@/config/api';

const EditMyPage = () => {
  const router = useRouter();
  
  // フォーム用のステート
  const [bio, setBio] = useState('');
  const [name, setName] = useState('山田 太郎'); // 名前も編集可能にする場合
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/hitchhiker/mypage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({}),
        });

        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        setBio(data.bio || '');
        setLoading(false);
      } catch (error) {
        console.error("Fetching error:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router.isReady]);

  // 保存処理
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(getApiUrl('/api/hitchhiker/myupdate'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          bio: bio,
        }),
      });

      const result = await response.json();

      if (result.ok) {
        router.push('/hitch_hiker/MyPage');
      } else {
        throw new Error("更新に失敗しました");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("保存中にエラーが発生しました");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-[#F8FAFC]">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <div className="text-[12px] text-gray-400 font-bold">情報を読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
      <div className="w-full min-h-screen flex flex-col relative">
        
        {/* ヘッダー */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="max-w-2xl mx-auto w-full px-4 py-3 pt-8 flex items-center justify-between">
            <button 
              onClick={() => router.back()} 
              className="text-gray-400 p-1.5 hover:bg-gray-50 border border-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-black text-gray-800">プロフィールの編集</h1>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`text-xs font-black transition-colors ${isSaving ? 'text-gray-300' : 'text-blue-600 hover:text-blue-700'}`}
            >
              {isSaving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-2xl mx-auto w-full p-4 space-y-6">
            
            {/* アバターセクション */}
            <div className="flex flex-col items-center pt-4">
              <div className="relative">
                <div className="w-16 h-16 bg-[#E0EDFF] rounded-full flex items-center justify-center text-xl font-black text-[#3B82F6] shadow-sm border-2 border-white ring-4 ring-blue-50/50">
                  {name[0]}
                </div>
                <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md border border-gray-100">
                  <Camera className="w-3 h-3 text-gray-400" />
                </div>
              </div>
              <p className="text-[9px] text-gray-400 font-bold mt-3 tracking-widest uppercase">Change Avatar (Soon)</p>
            </div>

            {/* 自己紹介入力エリア */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">About Me</label>
                <span className="text-[9px] text-gray-300 font-bold">{bio.length} / 200</span>
              </div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="自己紹介文を入力してください"
                className="w-full h-48 p-4 bg-white rounded-xl border border-gray-100 shadow-sm text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 resize-none leading-relaxed placeholder:text-gray-300"
              />
            </div>

            {/* インフォメーションカード */}
            <div className="bg-blue-50/50 p-4 rounded-[1.2rem] border border-blue-100/50">
              <div className="flex items-start">
                <Check className="w-3.5 h-3.5 text-blue-500 mt-0.5 mr-2.5 flex-shrink-0" />
                <p className="text-[10px] text-gray-500 leading-normal font-bold">
                  利用回数や評価、登録日はシステムにより自動管理されるため、手動で変更することはできません。
                </p>
              </div>
            </div>

          </div>
        </main>

        {/* 保存ボタン（フッター固定版） */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 z-40 md:hidden">
          <div className="max-w-2xl mx-auto w-full p-5">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-black text-sm flex items-center justify-center shadow-lg shadow-blue-100 active:scale-95 transition-all disabled:bg-gray-400"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2 stroke-[3px]" />}
              プロフィールを更新
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditMyPage;