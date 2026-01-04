// % Start(AI Assistant)
// 運転者用ヘッダーコンポーネント: 運転者用のヘッダー（タイトル、通知、マイページアイコン）

import { useRouter } from 'next/router';
import { Bell, User, ChevronLeft } from 'lucide-react';

interface DriverHeaderProps {
    title?: string;
    showNotification?: boolean;
    showMyPage?: boolean;
    showBackButton?: boolean;
    backPath?: string;
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

// 
// % Start(AI Assistant)
// 運転者用ヘッダー（標準CSS版）: 特別な設定なしでデザインを再現します





export function DriverHeader({
    title = '運転者として利用',
    showNotification = true,
    showMyPage = true,
    showBackButton = true, 
    backPath,
}: DriverHeaderProps) {
    const router = useRouter();

    const handleBackClick = () => {
        if (backPath) {
            router.push(backPath);
        } else {
            router.back();
        }
    };

    const handleNotificationClick = () => router.push('/notifications');
    const handleMyPageClick = () => router.push('/driver/mypage');

    // return (
    //     <header style={styles.header}>
    //         <div style={styles.container}>
    //             <div style={styles.flexRow}>

    //                 {/* 左側（戻る + タイトル） */}
    //                 <div style={styles.leftGroup}>
    //                     {showBackButton && (
    //                         <button
    //                             type="button"
    //                             onClick={handleBackClick}
    //                             style={styles.button}
    //                             aria-label="戻る"
    //                         >
    //                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    //                                 <path d="m12 19-7-7 7-7" />
    //                                 <path d="M19 12H5" />
    //                             </svg>
    //                         </button>
    //                     )}
    //                     <h1 style={styles.title}>{title}</h1>
    //                 </div>

    //                 {/* 右側（マイページ + 通知） */}
    //                 <div style={styles.rightGroup}>
    //                     {showMyPage && (
    //                         <button
    //                             type="button"
    //                             onClick={handleMyPageClick}
    //                             style={styles.button}
    //                             aria-label="マイページ"
    //                         >
    //                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    //                                 <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    //                                 <circle cx="12" cy="7" r="4" />
    //                             </svg>
    //                         </button>
    //                     )}

    //                     {showNotification && (
    //                         <button
    //                             type="button"
    //                             onClick={handleNotificationClick}
    //                             style={styles.button}
    //                             aria-label="通知"
    //                         >
    //                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    //                                 <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    //                                 <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    //                             </svg>
    //                             <span style={styles.badge} />
    //                         </button>
    //                     )}
    //                 </div>

    //             </div>
    //         </div>
    //     </header>
    // );
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
// % End