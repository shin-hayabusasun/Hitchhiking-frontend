// % Start(稗田隼也)
// ログアウト完了画面: ログアウトが完了したことを示す画面のUI

import React from 'react';
import { useRouter } from 'next/router';

export function LogoutPage() {
  const router = useRouter();

  function handleLoginClick() {
    router.push('/login');
  }

  return (
    /* 背景色を画面全体に適用 (Wide Background) */
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-white flex flex-col font-sans text-gray-800">
      
      {/* コンテンツ全体を max-w-2xl で中央寄せ */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl flex flex-col items-center">
          
          {/* 1. アプリロゴセクション */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <h1 className="text-blue-600 text-xl font-black tracking-wider">相乗りサービス</h1>
          </div>

          {/* 2. メインカードセクション: 幅を max-w-md に抑えて可読性を維持 */}
          <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl shadow-blue-900/10 px-8 pt-12 pb-12 flex flex-col items-center border border-white">
            
            {/* 緑のチェックマーク */}
            <div className="mt-4 mb-10">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
            </div>

            {/* ログアウト完了メッセージ */}
            <h2 className="text-red-500 text-3xl font-black text-center mb-16">
              ログアウト完了
            </h2>

            {/* 3. ログイン画面へボタン */}
            <button
              type="button"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-lg shadow-blue-100 active:scale-[0.98] transition-all text-lg"
              onClick={handleLoginClick}
            >
              ログイン画面へ
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default LogoutPage;

// % End