// % Start(稗田隼也)
// 新規登録完了画面: 新規登録が完了したことを示す画面のUI

import { useRouter } from 'next/router';

export function CompletePage() {
	const router = useRouter();

	function handleLoginClick() {
		router.push('/login');
	}

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            
            {/* ★ スマホ本体を模したコンテナ：ご指定のクラスを適用 */}
            <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">
                
                <div className="flex flex-col items-center justify-center h-full px-6 py-10">
                    
                    {/* 1. アプリロゴセクション */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-md">
                            {/* 車のアイコン */}
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                                <circle cx="7" cy="17" r="2" />
                                <path d="M9 17h6" />
                                <circle cx="17" cy="17" r="2" />
                            </svg>
                        </div>
                        <h2 className="text-blue-600 font-bold text-lg tracking-wider">相乗りサービス</h2>
                    </div>

                    {/* 2. メインカードセクション */}
                    <div className="w-full bg-white rounded-[2.5rem] shadow-xl p-8 flex flex-col items-center">
                        
                        {/* 緑のチェックアイコン（画像中央） */}
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                        </div>

                        {/* タイトルとメッセージ */}
                        <h1 className="text-green-500 text-2xl font-bold mb-2">登録完了</h1>
                        <p className="text-gray-600 font-medium mb-8">会員登録が完了しました</p>

                        {/* 3. 本人確認審査の案内ボックス（画像の下部ボックス） */}
                        <div className="w-full bg-blue-50/50 rounded-2xl p-5 mb-10 border border-blue-100/30">
                            <p className="text-[12px] text-gray-500 text-center leading-relaxed font-medium">
                                本人確認書類の審査には1〜3営業日かかります。<br />
                                <span className="block mt-2">
                                    審査完了後、登録いただいたメールアドレスに通知が届きます。
                                </span>
                            </p>
                        </div>

                        {/* 4. ログイン画面へボタン（画像①） */}
                        <button
                            type="button"
                            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 active:scale-[0.98] transition-all"
                            onClick={handleLoginClick}
                        >
                            ログイン画面へ
                        </button>
                    </div>

                </div>
            </div>
        </div>
	);
}

export default CompletePage;

// % End

