// % Start(稗田隼也)
// 新規登録完了画面: 新規登録が完了したことを示す画面のUI

import { useRouter } from 'next/router';

export function CompletePage() {
  const router = useRouter();

  function handleLoginClick() {
    router.push('/login');
  }

  return (
    /* 背景色を全体に適用 (Wide Background) */
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white flex flex-col font-sans text-gray-800">
      
      {/* コンテンツエリア: 中央寄せ + max-w-2xl */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl flex flex-col items-center">
          
          {/* 1. アプリロゴセクション */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-md">
              {/* 車のアイコン */}
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <h2 className="text-blue-600 font-black text-xl tracking-wider">相乗りサービス</h2>
          </div>

          {/* 2. メインカードセクション */}
          <div className="w-full bg-white rounded-[3rem] shadow-xl shadow-blue-900/5 p-10 md:p-16 flex flex-col items-center border border-white/50">
            
            {/* 緑のチェックアイコン */}
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>

            {/* タイトルとメッセージ */}
            <h1 className="text-green-500 text-3xl font-black mb-3">登録完了</h1>
            <p className="text-gray-500 font-bold text-lg mb-10">会員登録が完了しました</p>

            {/* 3. 本人確認審査の案内ボックス */}
            <div className="w-full bg-blue-50/50 rounded-3xl p-8 mb-12 border border-blue-100/30">
              <p className="text-sm md:text-base text-gray-500 text-center leading-relaxed font-bold">
                本人確認書類の審査終了後に利用できます<br />
                <span className="block mt-3 text-blue-600 text-lg">
                  会員登録特典として100ポイントを付与しました!
                </span>
              </p>
            </div>

            {/* 4. ログイン画面へボタン */}
            <button
              type="button"
              className="w-full max-w-sm bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all text-lg"
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

export default CompletePage;

// % End