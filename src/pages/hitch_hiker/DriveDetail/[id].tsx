// % Start(田所櫂人)
// ドライブ詳細画面: ドライブの詳細情報を確認し、申請することができる画面

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader';

interface DriveDetail {
	id: string;
	driverId: string;
	driverName: string;
	driverProfile?: any;
	departure: string;
	destination: string;
	departureTime: string;
	capacity: number;
	currentPassengers: number;
	fee: number;
	message?: string;
	vehicleRules?: any;
	status: string;
}

export function DriveDetailPage() {
	const router = useRouter();
	const { id } = router.query;
	const [drive, setDrive] = useState<DriveDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [applying, setApplying] = useState(false);

	// ドライブ詳細取得
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

	async function handleMessageClick() {
		// チャット画面へ遷移（チャットテーブル作成APIを呼び出す）
		router.push(`/chat/${drive?.driverId}`);
	}

	async function handleApplyClick() {
		if (!drive) {
			return;
		}

		setApplying(true);

		try {
			const response = await fetch('/api/applications', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({
					targetid: Number(drive.id),
					type: 'drive',
				}),
			});
			const data = await response.json();

			if (response.ok && data.success) {
				alert('申請が完了しました');
				router.push('/hitch_hiker/MyRequest');
			} else {
				alert(data.error || '申請に失敗しました');
			}
		} catch (err) {
			alert('申請に失敗しました');
		} finally {
			setApplying(false);
		}
	}

	if (loading) {
		return (
			<div className="loading-container">
				<div className="loading-spinner"></div>
			</div>
		);
	}

	if (error || !drive) {
		return (
			<div className="error-container">
				<p>{error || 'ドライブ情報が見つかりません'}</p>
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
		<div className="drive-detail-page">
			<TitleHeader title="ドライブ詳細" />

			<div className="drive-detail-container">
				<div className="driver-info">
					<h2>ドライバー情報</h2>
					<p className="driver-name">{drive.driverName}</p>
				</div>

				<div className="drive-info">
					<h2>ドライブ情報</h2>
					<div className="info-section">
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
							<span className="info-label">空席</span>
							<span className="info-value">
								{drive.capacity - drive.currentPassengers}/{drive.capacity}
							</span>
						</div>
					</div>
				</div>

				{drive.vehicleRules && (
					<div className="vehicle-rules">
						<h2>車両ルール</h2>
						<div className="rules-list">
							{drive.vehicleRules.noSmoking && <div>🚭 禁煙</div>}
							{drive.vehicleRules.petAllowed && <div>🐕 ペット可</div>}
							{drive.vehicleRules.musicAllowed && <div>🎵 音楽可</div>}
						</div>
					</div>
				)}

				{drive.message && (
					<div className="drive-message">
						<h2>メッセージ</h2>
						<p>{drive.message}</p>
					</div>
				)}

				<div className="drive-actions">
					<button
						type="button"
						className="btn btn-secondary"
						onClick={handleMessageClick}
					>
						メッセージ
					</button>
					<button
						type="button"
						className="btn btn-primary"
						onClick={handleApplyClick}
						disabled={
							applying ||
							drive.currentPassengers >= drive.capacity
						}
					>
						{applying ? '申請中...' : '申請する'}
					</button>
				</div>
			</div>
		</div>
	);
}

export default DriveDetailPage;

// % End

