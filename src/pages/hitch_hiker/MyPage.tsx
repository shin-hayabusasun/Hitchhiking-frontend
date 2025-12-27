// % Start(田所櫂人)
// 外部設計書 4.3.5 マイページ画面のUI再現

import { useRouter } from 'next/router';
import Head from 'next/head';

export default function MyPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#F2F5F9] pb-20 font-sans text-slate-900">
            <Head>
                <title>マイページ | G4</title>
            </Head>

            {/* ヘッダー */}
            <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 sticky top-0 z-50">
                <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-lg font-black tracking-tight">マイページ</h1>
                <div className="w-10"></div> {/* バランス調整用空要素 */}
            </header>

            <main className="max-w-md mx-auto px-6 pt-8">
                
                {/* ユーザープロファイルカード (写真のような立体感) */}
                <div className="bg-white rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white flex flex-col items-center">
                    {/* アイコン部分 */}
                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-tr from-slate-100 to-slate-50 rounded-[2.2rem] flex items-center justify-center shadow-inner">
                            <svg className="w-12 h-12 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                            </svg>
                        </div>
                        {/* 本人確認済みバッジ */}
                        <div className="absolute -bottom-1 -right-1 bg-[#22C55E] rounded-full p-1.5 border-[3px] border-white shadow-sm">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    <h2 className="mt-6 text-2xl font-black text-slate-800">田中 太郎</h2>
                    
                    <div className="mt-4 flex items-center gap-3">
                        <span className="px-5 py-2 bg-slate-900 text-white text-[11px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-slate-200">
                            同乗者
                        </span>
                        <div className="flex items-center text-[#F59E0B] bg-[#FFFBEB] px-4 py-1.5 rounded-full border border-[#FEF3C7]">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1.5 text-xs font-black text-[#B45309]">4.8</span>
                        </div>
                    </div>
                </div>

                {/* メニューリスト (丸みを帯びたグループ) */}
                <div className="mt-10 space-y-4">
                    <p className="px-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Activity</p>
                    <div className="bg-white rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-50 overflow-hidden">
                        <MenuItem label="マイリクエスト" icon="file-text" />
                        <MenuItem label="プロフィール詳細" icon="user" isLast />
                    </div>

                    <p className="px-6 pt-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">General</p>
                    <div className="bg-white rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-50 overflow-hidden">
                        <MenuItem label="お支払い情報" icon="credit-card" />
                        <MenuItem label="アプリ設定" icon="settings" />
                        <MenuItem label="ヘルプ・サポート" icon="help-circle" isLast />
                    </div>
                </div>

                {/* ログアウトボタン */}
                <button className="w-full mt-12 py-5 bg-white text-[#EF4444] font-black rounded-[2.5rem] border border-red-50 shadow-sm active:scale-[0.98] transition-all duration-200">
                    ログアウト
                </button>
            </main>
        </div>
    );
}

// メニュー項目のサブコンポーネント
function MenuItem({ label, icon, isLast = false }: { label: string; icon: string; isLast?: boolean }) {
    return (
        <button className={`w-full flex items-center justify-between px-8 py-6 hover:bg-slate-50 transition-colors ${!isLast ? 'border-b border-slate-50' : ''}`}>
            <span className="text-[15px] font-bold text-slate-700">{label}</span>
            <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
        </button>
    );
}
// % End