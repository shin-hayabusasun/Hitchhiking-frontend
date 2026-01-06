import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Check } from 'lucide-react';

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
        // 取得したデータをステートにセット
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
    const response = await fetch('http://localhost:8000/api/hitchhiker/myupdate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        bio: bio, // ステートの値を送信
      }),
    });

    const result = await response.json();

    if (result.ok) {
      
      router.push('/hitch_hiker/MyPage'); // マイページへ戻る
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
          <h1 className="text-lg font-bold text-gray-700">プロフィールの編集</h1>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`text-sm font-bold ${isSaving ? 'text-gray-300' : 'text-[#3B82F6]'}`}
          >
            {isSaving ? '保存中...' : '保存'}
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* アバター表示（編集不可の想定） */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-[#E0EDFF] rounded-full flex items-center justify-center text-2xl font-bold text-[#3B82F6] shadow-inner mb-2">
              {name[0]}
            </div>
            <p className="text-xs text-gray-400">画像を変更（準備中）</p>
          </div>

          {/* 自己紹介入力エリア */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-gray-500 ml-1">自己紹介</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="自己紹介文を入力してください"
              className="w-full h-40 p-4 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 resize-none leading-relaxed"
            />
            <div className="text-right text-[10px] text-gray-400 mr-2">
              {bio.length} / 200文字
            </div>
          </div>

          {/* 編集できない項目の案内（任意） */}
          <div className="bg-blue-50/50 p-4 rounded-[1.2rem] border border-blue-100/50">
            <div className="flex items-start">
              <Check className="w-4 h-4 text-[#3B82F6] mt-0.5 mr-2" />
              <p className="text-[11px] text-gray-500 leading-tight">
                利用回数や評価、登録日は自動的に管理されるため、手動で変更することはできません。
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditMyPage;