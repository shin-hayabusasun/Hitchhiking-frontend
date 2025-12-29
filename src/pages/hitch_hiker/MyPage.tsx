import React from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, ChevronRight, ShieldCheck } from 'lucide-react';

// 本来はAPIから取得するユーザーデータの構造例
const userData = {
  name: "読み込み中...", // ここを空にするか初期値にする
  initial: "山",
  rating: 0.0,
  usageCount: 0,
  joinDate: "----/--",
  bio: "",
  hobbies: "",
  purpose: ""
};

const MyPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white p-4 flex items-center justify-between border-b">
        <button onClick={() => router.back()} className="p-2"><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="text-lg font-bold text-gray-800">マイページ</h1>
        <button className="text-blue-600 font-medium">編集</button>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl font-bold text-blue-600">{userData.initial}</span>
          </div>
          <h2 className="text-xl font-bold mb-1">{userData.name}</h2>
          <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full mb-6">
            <ShieldCheck className="w-4 h-4 text-blue-600 mr-1" />
            <span className="text-xs text-blue-700 font-bold">本人確認済み</span>
          </div>

          <div className="w-full flex justify-around border-t pt-6">
            <div className="text-center">
              <div className="font-bold text-lg">{userData.usageCount}</div>
              <div className="text-gray-400 text-xs">利用回数</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">★ {userData.rating}</div>
              <div className="text-gray-400 text-xs">評価</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-xs pt-1.5">{userData.joinDate}〜</div>
              <div className="text-gray-400 text-xs">登録日</div>
            </div>
          </div>

          <button onClick={() => router.push('/hitch_hiker/MyRequest')} className="w-full mt-6 flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-xl mr-3"><ShieldCheck className="w-5 h-5 text-blue-600" /></div>
              <span className="font-bold">マイリクエスト</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* 項目名だけ残し、中身はデータの有無で表示を切り替えられるように */}
        {[
          { label: '自己紹介', content: userData.bio || "未設定" },
          { label: '趣味', content: userData.hobbies || "未設定" },
          { label: '主な利用目的', content: userData.purpose || "未設定" }
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-bold mb-3">{item.label}</h3>
            <p className="text-gray-800 font-medium">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPage;