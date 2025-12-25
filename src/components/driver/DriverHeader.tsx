// % Start(AI Assistant)
// 運転者用ヘッダーコンポーネント: 運転者用のヘッダー（タイトル、通知、マイページアイコン）

import { useRouter } from 'next/router';

interface DriverHeaderProps {
	title?: string;
	showNotification?: boolean;
	showMyPage?: boolean;
	showBackButton?: boolean;
}

// export function DriverHeader({
// 	title = '運転者として利用',
// 	showNotification = true,
// 	showMyPage = true,
// }: DriverHeaderProps) {
// 	const router = useRouter();

// 	function handleNotificationClick() {
// 		router.push('/notifications');
// 	}

// 	function handleMyPageClick() {
// 		router.push('/mypage');
// 	}

// 	return (
// 		<header className="driver-header">
// 			<div className="driver-header-container">
// 				<h1 className="driver-header-title">{title}</h1>
// 				<div className="driver-header-actions">
// 					{showNotification && (
// 						<button
// 							type="button"
// 							className="icon-button"
// 							onClick={handleNotificationClick}
// 							aria-label="通知"
// 						>
// 							<svg
// 								width="24"
// 								height="24"
// 								viewBox="0 0 24 24"
// 								fill="none"
// 								stroke="currentColor"
// 								strokeWidth="2"
// 							>
// 								<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
// 								<path d="M13.73 21a2 2 0 0 1-3.46 0" />
// 							</svg>
// 						</button>
// 					)}
// 					{showMyPage && (
// 						<button
// 							type="button"
// 							className="icon-button"
// 							onClick={handleMyPageClick}
// 							aria-label="マイページ"
// 						>
// 							<svg
// 								width="24"
// 								height="24"
// 								viewBox="0 0 24 24"
// 								fill="none"
// 								stroke="currentColor"
// 								strokeWidth="2"
// 							>
// 								<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
// 								<circle cx="12" cy="7" r="4" />
// 							</svg>
// 						</button>
// 					)}
// 				</div>
// 			</div>
// 		</header>
// 	);
// }

// % End

export function DriverHeader({
    title = 'マイドライブ', // デフォルトタイトルを合わせました
    showNotification = true,
    showMyPage = true,
    showBackButton = true,    // デフォルトで表示するように変更
}: DriverHeaderProps) {
    const router = useRouter();

    // --- 各ボタンの動作 ---
    
    function handleBackClick() {
        router.back(); // 前のページに戻る
        // または router.push('/home'); など固定の場所に戻したい場合はこちら
    }

    function handleNotificationClick() {
        router.push('/notifications');
    }

    function handleMyPageClick() {
        router.push('/mypage');
    }

    return (
        // 1. 全体の枠組み（白い帯・影付き・上部固定）
        <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="max-w-md mx-auto px-4 py-3">
                
                {/* 左右を両端揃えにするコンテナ */}
                <div className="flex items-center justify-between">
                    
                    {/* --- 左側のグループ（戻るボタン + タイトル） --- */}
                    <div className="flex items-center gap-3">
                        {showBackButton && (
                            <button
                                type="button"
                                onClick={handleBackClick}
                                className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                                aria-label="戻る"
                            >
                                {/* ArrowLeft アイコン */}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m12 19-7-7 7-7"/>
                                    <path d="M19 12H5"/>
                                </svg>
                            </button>
                        )}
                        
                        {/* タイトル（緑色） */}
                        <h1 className="text-green-600 font-bold text-lg">
                            {title}
                        </h1>
                    </div>

                    {/* --- 右側のグループ（マイページ + 通知） --- */}
                    <div className="flex items-center gap-2">
                        
                        {/* マイページボタン */}
                        {showMyPage && (
                            <button
                                type="button"
                                onClick={handleMyPageClick}
                                className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                                aria-label="マイページ"
                            >
                                {/* User アイコン */}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                </svg>
                            </button>
                        )}

                        {/* 通知ボタン */}
                        {showNotification && (
                            <button
                                type="button"
                                onClick={handleNotificationClick}
                                className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                                aria-label="通知"
                            >
                                {/* Bell アイコン */}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                                </svg>
                                
                                {/* 赤い未読バッジ（絶対配置で右上に置く） */}
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </header>
    );
}