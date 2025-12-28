// src/pages/driver/mypage/edit.tsx

import React, { useState } from "react";
// Pages Router のため next/router を使用します
import { useRouter } from "next/router"; 
import { ArrowLeft, Save } from "lucide-react";

export function DriverEditPage() {
  const router = useRouter();

  const [name, setName] = useState("山田 太郎");
  const [introduction, setIntroduction] = useState("安全運転を心がけています。静かに乗りたい方歓迎です。");

  const handleSave = () => {
    // 実際はここでAPI保存を行う
    // 保存後、表示ページ（index）へ戻るパスに修正
    router.push('/driver/mypage'); 
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-md space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="rounded-full p-2 hover:bg-gray-200" aria-label="戻る"><ArrowLeft /></button>
          <h1 className="text-xl font-bold">マイページ編集</h1>
        </div>

        <section className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">名前</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">自己紹介</label>
            <textarea value={introduction} onChange={(e) => setIntroduction(e.target.value)} rows={4} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </section>

        <div className="flex gap-4">
          <button onClick={() => router.back()} className="flex-1 rounded-xl border bg-white py-3 font-bold">キャンセル</button>
          <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-bold text-white shadow-lg shadow-blue-100">
            <Save size={18} /> 保存する
          </button>
        </div>
      </div>
    </div>
  );
}
export default DriverEditPage