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

// 
// % Start(AI Assistant)
// 運転者用ヘッダー（標準CSS版）: 特別な設定なしでデザインを再現します



export function DriverHeader({
    title = '運転者として利用',
    showNotification = true,
    showMyPage = true,
    showBackButton = true,
}: DriverHeaderProps) {
    const router = useRouter();

    // --- ボタンの動作 ---
    const handleBackClick = () => router.back();
    const handleNotificationClick = () => router.push('/notifications');
    const handleMyPageClick = () => router.push('/mypage');

    // --- スタイル定義（ここがデザインの正体です） ---
    const styles = {
        header: {
            backgroundColor: 'white',
            position: 'sticky' as const, // 上に固定
            top: 0,
            zIndex: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', // 薄い影
            width: '100%',
        },
        container: {
            maxWidth: '28rem', // max-w-md 相当
            margin: '0 auto',  // 中央寄せ
            padding: '0.75rem 1rem', // px-4 py-3 相当
        },
        flexRow: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        leftGroup: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px', // gap-3
        },
        rightGroup: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px', // gap-2
        },
        title: {
            color: '#16a34a', // text-green-600 相当
            fontSize: '1.125rem',
            fontWeight: 'bold',
            margin: 0,
        },
        button: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            borderRadius: '9999px', // 丸くする
            color: '#4b5563', // text-gray-600
            position: 'relative' as const,
        },
        badge: {
            position: 'absolute' as const,
            top: '4px',
            right: '4px',
            width: '8px',
            height: '8px',
            backgroundColor: '#ef4444', // bg-red-500
            borderRadius: '50%',
        }
    };

    return (
        <header style={styles.header}>
            <div style={styles.container}>
                <div style={styles.flexRow}>
                    
                    {/* 左側（戻る + タイトル） */}
                    <div style={styles.leftGroup}>
                        {showBackButton && (
                            <button
                                type="button"
                                onClick={handleBackClick}
                                style={styles.button}
                                aria-label="戻る"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m12 19-7-7 7-7"/>
                                    <path d="M19 12H5"/>
                                </svg>
                            </button>
                        )}
                        <h1 style={styles.title}>{title}</h1>
                    </div>

                    {/* 右側（マイページ + 通知） */}
                    <div style={styles.rightGroup}>
                        {showMyPage && (
                            <button
                                type="button"
                                onClick={handleMyPageClick}
                                style={styles.button}
                                aria-label="マイページ"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                </svg>
                            </button>
                        )}

                        {showNotification && (
                            <button
                                type="button"
                                onClick={handleNotificationClick}
                                style={styles.button}
                                aria-label="通知"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                                </svg>
                                <span style={styles.badge} />
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </header>
    );
}
// % End