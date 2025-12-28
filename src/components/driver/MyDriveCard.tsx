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
		// recruiting: '募集中',
		// matched: '確定済み',
		// in_progress: '進行中',
		// completed: '完了',
		// cancelled: 'キャンセル',
		recruiting: { label: '募集中', bg: '#dbeafe', color: '#1e40af' }, // 青系
		matched: { label: '確定', bg: '#dcfce7', color: '#166534' },     // 緑系
		in_progress: { label: '進行中', bg: '#fef3c7', color: '#92400e' }, // 黄系
		completed: { label: '完了', bg: '#f3f4f6', color: '#374151' },    // グレー系
		cancelled: { label: '中止', bg: '#fee2e2', color: '#991b1b' },    // 赤系
	};

	//const statusLabel = statusLabels[status] || status;

	// 日時のフォーマット
	const formattedDate = new Date(departureTime).toLocaleString('ja-JP', {
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	});


	// スタイル定義
	const styles = {
		card: {
			backgroundColor: 'white',
			borderRadius: '16px',
			padding: '16px',
			marginBottom: '12px',
			boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
			border: 'none',
		},
		header: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: '12px',
		},
		badge: {
			padding: '4px 12px',
			borderRadius: '20px',
			fontSize: '12px',
			fontWeight: 'bold',
			backgroundColor: status === 'matched' ? '#e8f5e9' : '#e3f2fd',
			color: status === 'matched' ? '#2e7d32' : '#1976d2',
			display: 'flex',
			alignItems: 'center',
			gap: '4px',
		},
		editBtn: {
			background: 'none',
			border: 'none',
			color: '#374151',
			fontSize: '14px',
			cursor: 'pointer',
			fontWeight: 'bold',
		},
		routeContainer: {
			display: 'flex',
			flexDirection: 'column' as const,
			gap: '8px',
			marginBottom: '12px',
		},
		locationRow: {
			display: 'flex',
			alignItems: 'flex-start',
			gap: '8px',
		},
		dotGreen: { width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e', marginTop: '4px' },
		dotRed: { width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444', marginTop: '4px' },
		locLabel: { fontSize: '12px', color: '#9ca3af', display: 'block' },
		locValue: { fontSize: '14px', color: '#1f2937', fontWeight: 500 },
		infoGrid: {
			display: 'flex',
			flexWrap: 'wrap' as const,
			gap: '12px',
			fontSize: '12px',
			color: '#6b7280',
			marginBottom: '12px',
			paddingBottom: '12px',
			borderBottom: '1px solid #f3f4f6',
		},
		price: { color: '#16a34a', fontWeight: 'bold' },
		footerBtn: {
			width: '100%',
			padding: '10px',
			backgroundColor: '#16a34a',
			color: 'white',
			border: 'none',
			borderRadius: '8px',
			fontWeight: 'bold',
			cursor: 'pointer',
		}
	};

	const statusLabel = status === 'matched' ? '✓ 確定' : '🕒 募集中';

	return (
		// <div className="my-drive-card">
		// 	<div className="my-drive-card-header">
		// 		<span className={`status-badge status-${status}`}>
		// 			{statusLabel}
		// 		</span>
		// 	</div>
		// 	<div className="my-drive-card-body">
		// 		<div className="my-drive-card-route">
		// 			<div className="my-drive-card-location">
		// 				<span className="location-label">出発</span>
		// 				<span className="location-value">{departure}</span>
		// 			</div>
		// 			<div className="my-drive-card-arrow">→</div>
		// 			<div className="my-drive-card-location">
		// 				<span className="location-label">目的地</span>
		// 				<span className="location-value">{destination}</span>
		// 			</div>
		// 		</div>
		// 		<div className="my-drive-card-info">
		// 			<div className="info-item">
		// 				<span className="info-label">出発時刻</span>
		// 				<span className="info-value">{formattedDate}</span>
		// 			</div>
		// 			<div className="info-item">
		// 				<span className="info-label">料金</span>
		// 				<span className="info-value">¥{fee.toLocaleString()}</span>
		// 			</div>
		// 			<div className="info-item">
		// 				<span className="info-label">乗車人数</span>
		// 				<span className="info-value">
		// 					{currentPassengers}/{capacity}
		// 				</span>
		// 			</div>
		// 		</div>
		// 	</div>
		// 	<div className="my-drive-card-footer">
		// 		<button
		// 			type="button"
		// 			className="btn btn-secondary"
		// 			onClick={handleDetailClick}
		// 		>
		// 			詳細を見る
		// 		</button>
		// 		{status === 'recruiting' && (
		// 			<>
		// 				<button
		// 					type="button"
		// 					className="btn btn-primary"
		// 					onClick={handleEditClick}
		// 				>
		// 					編集
		// 				</button>
		// 				{onDelete && (
		// 					<button
		// 						type="button"
		// 						className="btn btn-danger"
		// 						onClick={onDelete}
		// 					>
		// 						削除
		// 					</button>
		// 				)}
		// 			</>
		// 		)}
		// 	</div>
		// </div>
		<div style={styles.card}>
			{/* ヘッダー部分 */}
			<div style={styles.header}>
				<div style={styles.badge}>{statusLabel}</div>
				<button onClick={() => router.push(`/driver/drives/edit/${id}`)} style={styles.editBtn}>
					編集
				</button>
			</div>

			{/* ルート情報 */}
			<div style={styles.routeContainer}>
				<div style={styles.locationRow}>
					<div style={styles.dotGreen} />
					<div>
						<span style={styles.locLabel}>出発地</span>
						<span style={styles.locValue}>{departure}</span>
					</div>
				</div>
				<div style={styles.locationRow}>
					<div style={styles.dotRed} />
					<div>
						<span style={styles.locLabel}>目的地</span>
						<span style={styles.locValue}>{destination}</span>
					</div>
				</div>
			</div>

			{/* 詳細情報 */}
			<div style={styles.infoGrid}>
				<span>📅 {new Date(departureTime).toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
				<span style={styles.price}>$ ¥{fee} /人</span>
				<span>👤 {currentPassengers}/{capacity}名</span>
			</div>

			{/* 同乗者情報（確定時のみ表示） */}
			{status === 'matched' && (
				<div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
					<p style={{ marginBottom: '4px' }}>承認済み同乗者アカウント</p>
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f9fafb', padding: '8px', borderRadius: '8px' }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
							<div style={{ width: '32px', height: '32px', backgroundColor: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2e7d32' }}>山</div>
							<div>
								<div style={{ color: '#374151', fontWeight: 'bold' }}>山田 太郎</div>
								<div style={{ fontSize: '10px' }}>2名で同乗</div>
							</div>
						</div>
						<span>💬</span>
					</div>
				</div>
			)}

			{/* 詳細を見るボタン */}
			<button
				style={styles.footerBtn}
				onClick={() => router.push(`/driver/drives/${id}`)}
			>
				詳細を見る
			</button>
		</div>
	);
}

// % End

