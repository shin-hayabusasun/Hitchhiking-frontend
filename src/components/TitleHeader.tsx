// % Start(AI Assistant)
// タイトルヘッダーコンポーネント: タイトルと戻るボタンを表示するヘッダー

import { useRouter } from 'next/router';

interface TitleHeaderProps {
	title: string;
	showBackButton?: boolean;
	onBack?: () => void;
}

export function TitleHeader({
	title,
	showBackButton = true,
	onBack,
}: TitleHeaderProps) {
	const router = useRouter();

	function handleBack() {
		if (onBack) {
			onBack();
		} else {
			router.back();
		}
	}

	return (
		<header className="title-header">
			<div className="title-header-container">
				{showBackButton && (
					<button
						type="button"
						className="back-button"
						onClick={handleBack}
						aria-label="戻る"
					>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M19 12H5M12 19l-7-7 7-7" />
						</svg>
					</button>
				)}
				<h1 className="title-header-text">{title}</h1>
			</div>
		</header>
	);
}

// % End

