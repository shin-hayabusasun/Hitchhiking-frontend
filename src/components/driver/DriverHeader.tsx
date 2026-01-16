import { useRouter } from 'next/router';
import { Bell, User, ChevronLeft } from 'lucide-react';

interface DriverHeaderProps {
    title?: string;
    showNotification?: boolean;
    showMyPage?: boolean;
    showBackButton?: boolean;
    backPath?: string;      // 文字列で戻り先を指定する場合
    onBack?: () => void;    // ★追加: 関数で戻る動作を指定する場合
}

export function DriverHeader({
    title = '運転者として利用',
    showNotification = true,
    showMyPage = true,
    showBackButton = true, 
    backPath,
    onBack, // ★追加
}: DriverHeaderProps) {
    const router = useRouter();

    // 戻るボタンのクリックハンドラ
    const handleBackClick = () => {
        // 1. onBack（関数）が渡されていたら、それを最優先で実行
        if (onBack) {
            onBack();
            return;
        }

        // 2. onBackがなく、backPath（URL文字列）があれば、そこへ遷移
        if (backPath) {
            router.push(backPath);
        } 
        // 3. どちらもなければ、ブラウザ履歴で1つ戻る
        else {
            router.back();
        }
    };

    const handleNotificationClick = () => router.push('/notifications');
    const handleMyPageClick = () => router.push('/driver/mypage');

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
                
                {/* 左側：戻るボタン + タイトル */}
                <div className="flex items-center gap-2">
                    {showBackButton && (
                        <button
                            type="button"
                            onClick={handleBackClick}
                            className="p-1 -ml-1 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="戻る"
                        >
                            <ChevronLeft size={24} strokeWidth={2.5} />
                        </button>
                    )}
                    <h1 className="text-lg font-bold text-green-600 truncate max-w-[200px]">
                        {title}
                    </h1>
                </div>

                {/* 右側：マイページ + 通知 */}
                <div className="flex items-center gap-1">
                    {showMyPage && (
                        <button
                            type="button"
                            onClick={handleMyPageClick}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-all"
                            aria-label="マイページ"
                        >
                            <User size={22} />
                        </button>
                    )}

                    {showNotification && (
                        <button
                            type="button"
                            onClick={handleNotificationClick}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-all relative"
                            aria-label="通知"
                        >
                            <Bell size={22} />
                            {/* 通知バッジ */}
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </button>
                    )}
                </div>

            </div>
        </header>
    );
}