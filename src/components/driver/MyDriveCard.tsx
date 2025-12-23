// % Start(AI Assistant)
// マイドライブカードコンポーネント: 自分が作成したドライブ情報を表示

import { useRouter } from 'next/router';

interface MyDriveCardProps {
	id: string;
	departure: string;
	destination: string;
	departureTime: string;
	fee: number;
	capacity: number;
	currentPassengers: number;
	status: string;
	onEdit?: () => void;
	onDelete?: () => void;
}

export function MyDriveCard({
	id,
	departure,
	destination,
	departureTime,
	fee,
	capacity,
	currentPassengers,
	status,
	onEdit,
	onDelete,
}: MyDriveCardProps) {
	const router = useRouter();

	function handleDetailClick() {
		router.push(`/driver/drives/${id}`);
	}

	function handleEditClick() {
		if (onEdit) {
			onEdit();
		} else {
			router.push(`/driver/drives/edit/${id}`);
		}
	}

	// ステータス表示
	const statusLabels: Record<string, string> = {
		recruiting: '募集中',
		matched: '確定済み',
		in_progress: '進行中',
		completed: '完了',
		cancelled: 'キャンセル',
	};

	const statusLabel = statusLabels[status] || status;

	// 日時のフォーマット
	const formattedDate = new Date(departureTime).toLocaleString('ja-JP', {
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	});

	return (
		<div className="my-drive-card">
			<div className="my-drive-card-header">
				<span className={`status-badge status-${status}`}>
					{statusLabel}
				</span>
			</div>
			<div className="my-drive-card-body">
				<div className="my-drive-card-route">
					<div className="my-drive-card-location">
						<span className="location-label">出発</span>
						<span className="location-value">{departure}</span>
					</div>
					<div className="my-drive-card-arrow">→</div>
					<div className="my-drive-card-location">
						<span className="location-label">目的地</span>
						<span className="location-value">{destination}</span>
					</div>
				</div>
				<div className="my-drive-card-info">
					<div className="info-item">
						<span className="info-label">出発時刻</span>
						<span className="info-value">{formattedDate}</span>
					</div>
					<div className="info-item">
						<span className="info-label">料金</span>
						<span className="info-value">¥{fee.toLocaleString()}</span>
					</div>
					<div className="info-item">
						<span className="info-label">乗車人数</span>
						<span className="info-value">
							{currentPassengers}/{capacity}
						</span>
					</div>
				</div>
			</div>
			<div className="my-drive-card-footer">
				<button
					type="button"
					className="btn btn-secondary"
					onClick={handleDetailClick}
				>
					詳細を見る
				</button>
				{status === 'recruiting' && (
					<>
						<button
							type="button"
							className="btn btn-primary"
							onClick={handleEditClick}
						>
							編集
						</button>
						{onDelete && (
							<button
								type="button"
								className="btn btn-danger"
								onClick={onDelete}
							>
								削除
							</button>
						)}
					</>
				)}
			</div>
		</div>
	);
}

// % End

