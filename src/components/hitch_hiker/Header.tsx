import { useRouter } from 'next/router';

interface HitchhikerHeaderProps {
    title?: string;
    showBackButton?: boolean;    // 追加: 戻るボタンの表示フラグ
    showNotification?: boolean;
    showMyPage?: boolean;
    onBack?: () => void;         // 追加: カスタムの戻る動作
}

export function HitchhikerHeader({
    title = 'ヒッチハイク',
    showBackButton = true,       // 追加: デフォルト値を設定
    showNotification = true,
    showMyPage = true,
    onBack,
}: HitchhikerHeaderProps) {
    const router = useRouter();

    // 通知画面へ遷移
    function handleNotificationClick() {
        router.push('/notifications');
    }

    // マイページへ遷移
    function handleMyPageClick() {
        router.push('/hitch_hiker/MyPage');
    }

    // ★ 追加: handleBack 関数の定義
    function handleBack() {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    }

    return (
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
            {/* 左側：戻るボタンとタイトルのセット */}
            <div className="flex items-center flex-1">
                {showBackButton && (
                    <button
                        type="button"
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={handleBack} // ここで定義した関数を使用
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}
                
                {/* タイトル：運転者は緑、同乗者は青、その他はグレーに色分け */}
                <h1 className={`ml-3 text-lg font-bold tracking-tight ${
                    title === '運転者として利用' ? 'text-green-600' : 
                    title === '同乗者として利用' ? 'text-blue-600' : 'text-slate-700'
                }`}>
                    {title}
                </h1>
            </div>

            {/* 右側：アクションアイコン（マイページ & 通知） */}
            <div className="flex items-center gap-4">
                {showMyPage && (
                    <button
                        type="button"
                        className="p-1 text-slate-500 hover:text-slate-800 transition-colors"
                        onClick={handleMyPageClick}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </button>
                )}

                {showNotification && (
                    <button
                        type="button"
                        className="p-1 text-slate-500 hover:text-slate-800 transition-colors relative"
                        onClick={handleNotificationClick}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        {/* 通知の赤いドット */}
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                    </button>
                )}
            </div>
        </header>
    );
}
// % End