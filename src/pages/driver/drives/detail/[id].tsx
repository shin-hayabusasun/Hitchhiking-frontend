// % Start(小松暉)
// ドライブ詳細画面: 運転者が作成した特定のドライブ募集の詳細情報を表示する

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DriverHeader } from '@/components/driver/DriverHeader';

interface DriveDetail {
	id: string;
	driverId: string;
	driverName: string;
	departure: string;
	destination: string;
	departureTime: string;
	capacity: number;
	currentPassengers: number;
	fee: number;
	message?: string;
	vehicleRules?: {
		noSmoking?: boolean;
		petAllowed?: boolean;
		musicAllowed?: boolean;
	};
	status: string;
	passengers?: Array<{
		id: string;
		name: string;
		status: string;
	}>;
}

export function DriverDriveDetailPage() {
	const router = useRouter();
	const { id } = router.query;
	const [drive, setDrive] = useState<DriveDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	// URLパラメータからidを取得し、ドライブ詳細を取得
	useEffect(() => {
		if (!id) {
			return;
		}

		async function fetchDriveDetail() {
			try {
				const response = await fetch(`/api/drives/${id}`, {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
				});
				const data = await response.json();

				if (response.ok && data.drive) {
					setDrive(data.drive);
				} else {
					setError('ドライブ情報の取得に失敗しました');
				}
			} catch (err) {
				setError('ドライブ情報の取得に失敗しました');
			} finally {
				setLoading(false);
			}
		}

		fetchDriveDetail();
	}, [id]);

	function handleBackClick() {
		router.push('/driver/drives');
	}

	function handleEditClick() {
		router.push(`/driver/drives/edit/${id}`);
	}

	if (loading) {
		return (
			<div className="driver-drive-detail-page">
				<DriverHeader />
				<div className="loading-container">
					<div className="loading-spinner"></div>
					<p>読み込み中...</p>
				</div>
			</div>
		);
	}

	if (error || !drive) {
		return (
			<div className="driver-drive-detail-page">
				<DriverHeader />
				<div className="error-container">
					<p>{error || 'ドライブ情報が見つかりません'}</p>
					<button
						type="button"
						className="btn btn-secondary"
						onClick={handleBackClick}
					>
						戻る
					</button>
				</div>
			</div>
		);
	}

	const formattedDate = new Date(drive.departureTime).toLocaleString(
		'ja-JP',
		{
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
		}
	);

	return (
		<div className="driver-drive-detail-page">
			<DriverHeader />

			<div className="drive-detail-container">
				<div className="detail-header">
					<h1>ドライブ詳細</h1>
					<div className="status-badge">
						{drive.status === 'active' && (
							<span className="badge badge-success">募集中</span>
						)}
						{drive.status === 'scheduled' && (
							<span className="badge badge-info">予定</span>
						)}
						{drive.status === 'in_progress' && (
							<span className="badge badge-warning">進行中</span>
						)}
						{drive.status === 'completed' && (
							<span className="badge badge-secondary">完了</span>
						)}
					</div>
				</div>

				<div className="drive-info-section">
					<h2>ルート情報</h2>
					<div className="info-grid">
						<div className="info-item">
							<span className="info-label">出発地</span>
							<span className="info-value">{drive.departure}</span>
						</div>
						<div className="info-item">
							<span className="info-label">目的地</span>
							<span className="info-value">{drive.destination}</span>
						</div>
						<div className="info-item">
							<span className="info-label">出発時刻</span>
							<span className="info-value">{formattedDate}</span>
						</div>
						<div className="info-item">
							<span className="info-label">料金</span>
							<span className="info-value">
								¥{drive.fee.toLocaleString()}
							</span>
						</div>
						<div className="info-item">
							<span className="info-label">定員</span>
							<span className="info-value">
								{drive.currentPassengers} / {drive.capacity}名
							</span>
						</div>
					</div>
				</div>

				{drive.vehicleRules && (
					<div className="vehicle-rules-section">
						<h2>車両ルール</h2>
						<div className="rules-list">
							{drive.vehicleRules.noSmoking && (
								<div className="rule-item">
									<span className="icon">🚭</span>
									<span>禁煙</span>
								</div>
							)}
							{drive.vehicleRules.petAllowed && (
								<div className="rule-item">
									<span className="icon">🐕</span>
									<span>ペット可</span>
								</div>
							)}
							{drive.vehicleRules.musicAllowed && (
								<div className="rule-item">
									<span className="icon">🎵</span>
									<span>音楽可</span>
								</div>
							)}
						</div>
					</div>
				)}

				{drive.message && (
					<div className="message-section">
						<h2>メッセージ</h2>
						<p className="message-content">{drive.message}</p>
					</div>
				)}

				{drive.passengers && drive.passengers.length > 0 && (
					<div className="passengers-section">
						<h2>同乗者リスト</h2>
						<div className="passengers-list">
							{drive.passengers.map((passenger) => {
								return (
									<div key={passenger.id} className="passenger-card">
										<div className="passenger-info">
											<span className="passenger-name">
												{passenger.name}
											</span>
											<span
												className={`passenger-status status-${passenger.status}`}
											>
												{passenger.status === 'approved'
													? '承認済み'
													: passenger.status === 'pending'
														? '承認待ち'
														: passenger.status}
											</span>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				)}

				<div className="action-buttons">
					<button
						type="button"
						className="btn btn-secondary"
						onClick={handleBackClick}
					>
						戻る
					</button>
					<button
						type="button"
						className="btn btn-primary"
						onClick={handleEditClick}
					>
						編集する
					</button>
				</div>
			</div>

			<style jsx>{`
				.driver-drive-detail-page {
					min-height: 100vh;
					background-color: #f5f5f5;
				}

				.loading-container,
				.error-container {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					padding: 3rem;
					text-align: center;
				}

				.loading-spinner {
					width: 50px;
					height: 50px;
					border: 4px solid #f3f3f3;
					border-top: 4px solid #007bff;
					border-radius: 50%;
					animation: spin 1s linear infinite;
					margin-bottom: 1rem;
				}

				@keyframes spin {
					0% {
						transform: rotate(0deg);
					}
					100% {
						transform: rotate(360deg);
					}
				}

				.drive-detail-container {
					max-width: 800px;
					margin: 0 auto;
					padding: 1.5rem;
				}

				.detail-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 2rem;
				}

				.detail-header h1 {
					font-size: 1.75rem;
					font-weight: bold;
					margin: 0;
				}

				.badge {
					padding: 0.5rem 1rem;
					border-radius: 20px;
					font-size: 0.875rem;
					font-weight: 500;
				}

				.badge-success {
					background-color: #28a745;
					color: white;
				}

				.badge-info {
					background-color: #17a2b8;
					color: white;
				}

				.badge-warning {
					background-color: #ffc107;
					color: #333;
				}

				.badge-secondary {
					background-color: #6c757d;
					color: white;
				}

				.drive-info-section,
				.vehicle-rules-section,
				.message-section,
				.passengers-section {
					background: white;
					padding: 1.5rem;
					border-radius: 8px;
					margin-bottom: 1.5rem;
					box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
				}

				.drive-info-section h2,
				.vehicle-rules-section h2,
				.message-section h2,
				.passengers-section h2 {
					font-size: 1.25rem;
					font-weight: 600;
					margin-bottom: 1rem;
					color: #333;
				}

				.info-grid {
					display: grid;
					gap: 1rem;
				}

				.info-item {
					display: flex;
					justify-content: space-between;
					padding: 0.75rem 0;
					border-bottom: 1px solid #eee;
				}

				.info-item:last-child {
					border-bottom: none;
				}

				.info-label {
					color: #666;
					font-weight: 500;
				}

				.info-value {
					color: #333;
					font-weight: 600;
				}

				.rules-list {
					display: flex;
					gap: 1rem;
					flex-wrap: wrap;
				}

				.rule-item {
					display: flex;
					align-items: center;
					gap: 0.5rem;
					padding: 0.5rem 1rem;
					background-color: #f8f9fa;
					border-radius: 20px;
				}

				.rule-item .icon {
					font-size: 1.25rem;
				}

				.message-content {
					color: #333;
					line-height: 1.6;
					white-space: pre-wrap;
				}

				.passengers-list {
					display: flex;
					flex-direction: column;
					gap: 0.75rem;
				}

				.passenger-card {
					padding: 1rem;
					background-color: #f8f9fa;
					border-radius: 8px;
					border: 1px solid #dee2e6;
				}

				.passenger-info {
					display: flex;
					justify-content: space-between;
					align-items: center;
				}

				.passenger-name {
					font-weight: 500;
					color: #333;
				}

				.passenger-status {
					padding: 0.25rem 0.75rem;
					border-radius: 12px;
					font-size: 0.875rem;
				}

				.status-approved {
					background-color: #d4edda;
					color: #155724;
				}

				.status-pending {
					background-color: #fff3cd;
					color: #856404;
				}

				.action-buttons {
					display: flex;
					gap: 1rem;
					margin-top: 2rem;
				}

				.btn {
					flex: 1;
					padding: 1rem;
					border: none;
					border-radius: 8px;
					font-size: 1rem;
					font-weight: 600;
					cursor: pointer;
					transition: all 0.2s;
				}

				.btn-secondary {
					background-color: #6c757d;
					color: white;
				}

				.btn-secondary:hover {
					background-color: #5a6268;
				}

				.btn-primary {
					background-color: #007bff;
					color: white;
				}

				.btn-primary:hover {
					background-color: #0056b3;
				}

				@media (max-width: 768px) {
					.drive-detail-container {
						padding: 1rem;
					}

					.detail-header {
						flex-direction: column;
						align-items: flex-start;
						gap: 1rem;
					}

					.action-buttons {
						flex-direction: column;
					}
				}
			`}</style>
		</div>
	);
}

export default DriverDriveDetailPage;

// % End

