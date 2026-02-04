// % Start(AI Assistant)
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Check, Loader2, Save } from 'lucide-react';
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
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <div className="text-gray-400 font-bold">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800 pb-32">
      
      {/* ヘッダー: 白背景は横いっぱい、中身は max-w-2xl で中央寄せ */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center">
          <button onClick={() => router.back()} className="text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-[17px] font-black text-blue-600 flex-1 text-center mr-8">プロフィールの編集</h1>
        </div>
      </header>

      {/* メインコンテンツ: max-w-2xl */}
      <main className="max-w-2xl mx-auto p-5 space-y-6">
        
        {/* アバター表示 */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50 flex flex-col items-center">
          <div className="w-24 h-24 bg-[#E0EDFF] rounded-full flex items-center justify-center text-3xl font-black text-[#3B82F6] shadow-inner mb-4">
            {name[0]}
          </div>
          <p className="text-xs font-bold text-gray-400">画像を変更（準備中）</p>
        </div>

        {/* 自己紹介入力エリア */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 space-y-3">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider ml-1">自己紹介</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="自己紹介文を入力してください"
            className="w-full h-48 p-5 bg-gray-50 border-none rounded-2xl text-sm text-gray-700 focus:ring-2 focus:ring-blue-500/20 resize-none leading-relaxed"
          />
          <div className="text-right text-[10px] font-bold text-gray-400 mr-2">
            {bio.length} / 200文字
          </div>
        </div>

        {/* 注意事項 */}
        <div className="bg-blue-50/50 p-5 rounded-[1.5rem] border border-blue-100">
          <div className="flex items-start">
            <Check className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-[12px] text-blue-700 leading-relaxed font-medium">
              利用回数や評価、登録日は自動的に管理されるため、手動で変更することはできません。
            </p>
          </div>
        </div>
      </main>

      {/* 固定アクションボタン: 画面下部に固定 */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-gray-50 z-50">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className={`w-full ${isSaving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-4 rounded-[1.5rem] font-black text-[15px] flex items-center justify-center shadow-xl shadow-blue-200 active:scale-95 transition-all`}
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            {isSaving ? '保存中...' : 'プロフィールを保存'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default EditMyPage;
// % End