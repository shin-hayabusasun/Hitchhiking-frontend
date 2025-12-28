// % Start 黒星
// src/pages/driver/mypage/index.tsx

import React from 'react';
// Pages Router のため next/router を使用します
import { useRouter } from 'next/router'; 
import { ArrowLeft, Car, CheckCircle, Star, Settings, AlertTriangle, PawPrint, XCircle, Pencil } from 'lucide-react';

export function DriverProfilePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="bg-white border-b sticky top-0 z-10 p-4 flex items-center justify-between">
        <button onClick={() => router.back()} aria-label="戻る"><ArrowLeft /></button>
        <h1 className="font-bold">マイページ</h1>
        {/* 編集ページへのリンクを修正 */}
        <button onClick={() => router.push('/driver/mypage/edit')} className="text-blue-600 flex items-center gap-1">
          <Pencil size={16} /> 編集
        </button>
      </header>

      <main className="p-4 space-y-4 max-w-md mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl font-bold text-green-600">山</div>
          <h2 className="text-xl font-bold">山田 太郎</h2>
          <div className="flex justify-center gap-2 my-3">
            <span className="flex items-center text-[10px] bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-100"><CheckCircle size={14} className="mr-1" />本人確認済</span>
            <span className="flex items-center text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100"><Car size={14} className="mr-1" />免許証確認済</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold mb-4 text-gray-500 text-sm uppercase">車両ルール</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-medium"><div className="flex items-center gap-3"><XCircle className="text-red-500" /> 禁煙</div><span className="text-blue-600">許可</span></div>
            <div className="flex justify-between items-center text-sm font-medium"><div className="flex items-center gap-3"><PawPrint className="text-orange-500" /> ペット可</div><span className="text-blue-600">許可</span></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm"><h3 className="font-bold mb-2 text-gray-500 text-sm uppercase">自己紹介</h3><p className="text-sm">安全運転を心がけています！</p></div>
      </main>
    </div>
  );
}
export default DriverProfilePage