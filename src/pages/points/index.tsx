// % Start(黒星朋来)
// ポイントホーム画面: 現在の保有ポイント数を表示し、ポイント履歴画面や商品交換画面へのナビゲーションを提供する画面

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader';

interface PointBalance {
	totalBalance: number;
	breakdown?: {
		earned: number;
		spent: number;
	};
}

export function PointsPage() {
	const router = useRouter();
	const [balance, setBalance] = useState<PointBalance | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	// ポイント残高取得
	useEffect(() => {
		async function fetchBalance() {
			try {
				const response = await fetch('/api/point/remain', {
					method: 'POST',
					credentials: 'include',
				});
				const data = await response.json();
				setBalance(data);
			} catch (err) {
				setError('ポイント残高の取得に失敗しました');
			} finally {
				setLoading(false);
			}
		}

		fetchBalance();
	}, []);

	function handleHistoryClick() {
		router.push('/points/history');
	}

	function handleExchangeClick() {
		router.push('/points/exchange');
	}

	function handleOrdersClick() {
		router.push('/points/orders');
	}

	function handleBack() {
		router.push('/');
	}

	if (loading) {
		return (
			<div className="loading-container">
				<div className="loading-spinner"></div>
			</div>
		);
	}

	return (
		<div className="points-page">
			<TitleHeader title="ポイント" onBack={handleBack} />

			<div className="points-container">
				{error && <div className="error-message">{error}</div>}

				<div className="balance-card">
					<div className="balance-label">保有ポイント</div>
					<div className="balance-value">
						{balance?.totalBalance.toLocaleString() || 0}
						<span className="balance-unit">pt</span>
					</div>
					{balance?.breakdown && (
						<div className="balance-breakdown">
							<div className="breakdown-item">
								<span>獲得</span>
								<span>{balance.breakdown.earned.toLocaleString()}pt</span>
							</div>
							<div className="breakdown-item">
								<span>利用</span>
								<span>{balance.breakdown.spent.toLocaleString()}pt</span>
							</div>
						</div>
					)}
				</div>

				<div className="points-menu">
					<button
						type="button"
						className="menu-item"
						onClick={handleHistoryClick}
					>
						<div className="menu-icon">
							<svg
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<circle cx="12" cy="12" r="10" />
								<polyline points="12 6 12 12 16 14" />
							</svg>
						</div>
						<div className="menu-label">履歴</div>
					</button>

					<button
						type="button"
						className="menu-item"
						onClick={handleExchangeClick}
					>
						<div className="menu-icon">
							<svg
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<circle cx="9" cy="21" r="1" />
								<circle cx="20" cy="21" r="1" />
								<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
							</svg>
						</div>
						<div className="menu-label">商品検索</div>
					</button>

					<button
						type="button"
						className="menu-item"
						onClick={handleOrdersClick}
					>
						<div className="menu-icon">
							<svg
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
							</svg>
						</div>
						<div className="menu-label">注文履歴</div>
					</button>
				</div>
			</div>
		</div>
	);
}

export default PointsPage;

// % End

