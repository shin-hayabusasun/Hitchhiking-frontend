// % Start(AI Assistant)
// タイトルヘッダーコンポーネント: タイトルと戻るボタンを表示するヘッダー

import { useRouter } from 'next/router';

interface TitleHeaderProps {
	title: string;
	showBackButton?: boolean;//何もないとture
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
		<header className="bg-white border-b border-gray-200 px-4 py-3 font-sans">
            <div className="flex items-center">
                {showBackButton && (
                    <button
                        type="button"
                        className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
                        onClick={handleBack}
                        aria-label="戻る"
                    >
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}
                <h1 className="ml-3 text-lg font-semibold text-gray-800 tracking-tight">
                    {title}
                </h1>
            </div>
        </header>
	);
}

// % End

