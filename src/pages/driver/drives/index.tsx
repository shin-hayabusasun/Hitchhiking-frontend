// % Start(小松暉)
// マイドライブ画面: 運転者として登録したドライブ予定の一覧を表示・管理する

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DriverHeader } from '@/components/driver/DriverHeader';
import { MyDriveCard } from '@/components/driver/MyDriveCard';

interface Drive {
	id: string;
	departure: string;
	destination: string;
	departureTime: string;
	fee: number;
	capacity: number;
	currentPassengers: number;
	status: string;
}

export function DriverDrivesPage() {
	const router = useRouter();
	const [drives, setDrives] = useState<Drive[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	// ドライブ一覧取得
	useEffect(() => {
		async function fetchDrives() {
			try {
				const response = await fetch('/api/driver/drives', {
					method: 'GET',
					credentials: 'include',
				});
				const data = await response.json();
				setDrives(data.drives || []);
			} catch (err) {
				setError('ドライブ情報の取得に失敗しました');
			} finally {
				setLoading(false);
			}
		}

		fetchDrives();
	}, []);

	function handleCreateClick() {
		router.push('/driver/drives/create');
	}

	function handleRequestsClick() {
		router.push('/driver/requests');
	}

	function handleNearbyClick() {
		router.push('/driver/nearby');
	}

	function handleSearchClick() {
		router.push('/driver/search');
	}

	

	async function handleDelete(id: string) {
		if (!confirm('本当に削除しますか？')) {
			return;
		}

		try {
			await fetch(`/api/drives/${id}`, {
				method: 'DELETE',
				credentials: 'include',
			});
			setDrives(drives.filter((drive) => drive.id !== id));
			alert('削除しました');
		} catch (err) {
			alert('削除に失敗しました');
		}
	}

	return (
		<div className="driver-drives-page">
			<DriverHeader title="マイドライブ" />

			<div className="driver-drives-container">
				<div className="driver-tabs">
					<button
						type="button"
						className="tab-button active"
						onClick={() => {
							router.push('/driver/drives');
						}}
					>
						マイドライブ
					</button>
					<button
						type="button"
						className="tab-button"
						onClick={handleRequestsClick}
					>
						申請確認
					</button>
					<button
						type="button"
						className="tab-button"
						onClick={handleNearbyClick}
					>
						近くの募集
					</button>
					<button
						type="button"
						className="tab-button"
						onClick={handleSearchClick}
					>
						募集検索
					</button>
				</div>

				<div className="drives-actions">
					<button
						type="button"
						className="btn btn-primary"
						onClick={handleCreateClick}
					>
						ドライブを作成
					</button>
				</div>

				{loading && (
					<div className="loading-container">
						<div className="loading-spinner"></div>
					</div>
				)}

				{error && <div className="error-message">{error}</div>}

				{!loading && !error && drives.length === 0 && (
					<div className="empty-state">
						<p>ドライブがありません</p>
						<p>新しいドライブを作成しましょう</p>
					</div>
				)}

				{!loading && !error && drives.length > 0 && (
					<div className="drives-list">
						{drives.map((drive) => {
							return (
								<MyDriveCard
									key={drive.id}
									id={drive.id}
									departure={drive.departure}
									destination={drive.destination}
									departureTime={drive.departureTime}
									fee={drive.fee}
									capacity={drive.capacity}
									currentPassengers={drive.currentPassengers}
									status={drive.status}
									onDelete={() => {
										handleDelete(drive.id);
									}}
								/>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

export default DriverDrivesPage;

// % End

