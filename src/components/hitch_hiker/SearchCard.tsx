// % Start(AI Assistant)
// 募集検索カードコンポーネント: 検索結果を表示するカード

import { useRouter } from 'next/router';

interface SearchCardProps {
	id: string;
	driverName: string;
	departure: string;
	destination: string;
	departureTime: string;
	fee: number;
	capacity: number;
	currentPassengers: number;
	matchingScore?: number;
}

export function SearchCard({
	id,
	driverName,
	departure,
	destination,
	departureTime,
	fee,
	capacity,
	currentPassengers,
	matchingScore,
}: SearchCardProps) {
	const router = useRouter();

	function handleDetailClick() {
		router.push(`/hitch_hiker/DriveDetail/${id}`);
	}

	// 日時のフォーマット
	const formattedDate = new Date(departureTime).toLocaleString('ja-JP', {
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	});

	return (
		<div className="search-card">
			<div className="search-card-header">
				<div className="search-card-driver">{driverName}</div>
				{matchingScore !== undefined && (
					<div className="search-card-score">
						マッチ度: {Math.round(matchingScore)}%
					</div>
				)}
			</div>
			<div className="search-card-body">
				<div className="search-card-route">
					<div className="search-card-location">
						<span className="location-label">出発</span>
						<span className="location-value">{departure}</span>
					</div>
					<div className="search-card-arrow">→</div>
					<div className="search-card-location">
						<span className="location-label">目的地</span>
						<span className="location-value">{destination}</span>
					</div>
				</div>
				<div className="search-card-info">
					<div className="info-item">
						<span className="info-label">出発時刻</span>
						<span className="info-value">{formattedDate}</span>
					</div>
					<div className="info-item">
						<span className="info-label">料金</span>
						<span className="info-value">¥{fee.toLocaleString()}</span>
					</div>
					<div className="info-item">
						<span className="info-label">空席</span>
						<span className="info-value">
							{capacity - currentPassengers}/{capacity}
						</span>
					</div>
				</div>
			</div>
			<div className="search-card-footer">
				<button
					type="button"
					className="btn btn-primary"
					onClick={handleDetailClick}
				>
					詳細を見る
				</button>
			</div>
		</div>
	);
}

// % End

