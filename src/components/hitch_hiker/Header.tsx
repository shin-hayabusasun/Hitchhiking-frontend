// % Start(AI Assistant)
// 同乗者用ヘッダーコンポーネント: 同乗者として利用する場合のヘッダー

import { useRouter } from 'next/router';
import Link from 'next/link';

interface HitchhikerHeaderProps {
	title?: string;
	showNotification?: boolean;
	showMyPage?: boolean;
}

export function HitchhikerHeader({
	title = 'ヒッチハイク',
	showNotification = true,
	showMyPage = true,
}: HitchhikerHeaderProps) {
	const router = useRouter();

	function handleNotificationClick() {
		// 通知画面へ遷移
		router.push('/notifications');
	}

	function handleMyPageClick() {
		router.push('/hitch_hiker/MyPage');
	}

	return (
		<header className="hitchhiker-header">
			<div className="hitchhiker-header-container">
				<h1 className="hitchhiker-header-title">{title}</h1>
				<div className="hitchhiker-header-actions">
					{showNotification && (
						<button
							type="button"
							className="icon-button"
							onClick={handleNotificationClick}
							aria-label="通知"
						>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
								<path d="M13.73 21a2 2 0 0 1-3.46 0" />
							</svg>
						</button>
					)}
					{showMyPage && (
						<button
							type="button"
							className="icon-button"
							onClick={handleMyPageClick}
							aria-label="マイページ"
						>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
								<circle cx="12" cy="7" r="4" />
							</svg>
						</button>
					)}
				</div>
			</div>
		</header>
	);
}

// % End

