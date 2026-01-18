// % Start(稗田隼也)
// ホーム画面: アプリケーションのホームページUI

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getApiUrl } from '@/config/api';

export function HomePage() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	// セッション確認
	useEffect(() => {
		async function checkSession() {
			try {
				const response = await fetch(getApiUrl('/api/user/IsLogin'), {
					method: 'GET',
					credentials: 'include',
				});
				const data = await response.json();
				
				if (!data.ok ) {
					// ログインしていない場合はログイン画面へ
					router.push('/login');
				} else {
					setLoading(false);
				}
			} catch (err) {
				router.push('/login');
			}
		}

		checkSession();
	}, [router]);

	async function handleLogout() {
		try {
			await fetch(getApiUrl('/api/user/logout'), {
				method: 'GET',
				credentials: 'include',
			});
			router.push('/login/logout');
		} catch (err) {
			console.error('ログアウトエラー:', err);
		}
	}

	function handleSettingsClick() {
		router.push('/settings');
	}

	function handlePointsClick() {
		router.push('/points');
	}

	function handleHitchhikerClick() {
		router.push('/hitch_hiker/Search');
	}

	function handleDriverClick() {
		router.push('/driver/drives');
	}

	function handleInquiryClick() {
		router.push('/inquiry');
	}

	if (loading) {
		return (
			<div className="loading-container">
				<div className="loading-spinner"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
  {/* スマホ本体を模したコンテナ */}
  <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl overflow-hidden flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gray-50">
    
    {/* ヘッダー：ロゴとログアウトボタン */}
    <header className="bg-white px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        </div>
        <span className="text-blue-600 font-bold text-sm">相乗りサービス</span>
      </div>
      <button 
        onClick={handleLogout}
        className="p-2 text-gray-400 hover:text-red-500 transition-colors border border-gray-100 rounded-lg"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </header>

    {/* メインコンテンツ */}
    <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-blue-50/50 to-white">
      <div className="mb-6">
        <h2 className="text-gray-800 text-lg font-bold">ようこそ</h2>
        <p className="text-gray-500 text-xs">ご利用になるサービスを選択してください</p>
      </div>

      <div className="space-y-4">
        {/* ① 同乗者として利用 */}
        <button onClick={handleHitchhikerClick} className="w-full bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow text-left border border-gray-50">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-gray-800 text-sm">同乗者として利用</div>
            <div className="text-[10px] text-gray-400">乗車を探して相乗りを利用する</div>
          </div>
        </button>

        {/* ② 運転者として利用 */}
        <button onClick={handleDriverClick} className="w-full bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow text-left border border-gray-50">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-gray-800 text-sm">運転者として利用</div>
            <div className="text-[10px] text-gray-400">乗車を提供して相乗りを実施する</div>
          </div>
        </button>

        {/* ③ ポイント */}
       <button onClick={handlePointsClick} className="w-full bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow text-left border border-gray-50">
  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
    {/* プレゼント箱のアイコン (Gift) */}
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* 箱の本体 */}
      <polyline points="20 12 20 22 4 22 4 12" />
      {/* 箱の蓋（ふた） */}
      <rect x="2" y="7" width="20" height="5" />
      {/* 縦のリボン */}
      <line x1="12" y1="22" x2="12" y2="7" />
      {/* 左側のリボン結び */}
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      {/* 右側のリボン結び */}
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  </div>
  <div>
    <div className="font-bold text-gray-800 text-sm">売上・ポイント</div>
    <div className="text-[10px] text-gray-400">売上・ポイント確認と商品交換</div>
  </div>
</button>

        {/* ④ 問い合わせ */}
        <button onClick={handleInquiryClick} className="w-full bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow text-left border border-gray-50">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-gray-800 text-sm">問い合わせ</div>
            <div className="text-[10px] text-gray-400">管理者へ問い合わせ</div>
          </div>
        </button>

        {/* ⑤ 設定 */}
        <button onClick={handleSettingsClick} className="w-full bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow text-left border border-gray-50">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-gray-800 text-sm">設定</div>
            <div className="text-[10px] text-gray-400">アカウント情報や各種設定</div>
          </div>
        </button>
      </div>
    </div>
  </div>
</div>
	);
}

export default HomePage;

// % End
