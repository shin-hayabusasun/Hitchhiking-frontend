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

	const currentPath = router.pathname; // 現在のURLを取得

	// どのページがどのパスに対応するか定義
	const tabs = [
		{ name: 'マイドライブ', path: '/driver/drives' },
		{ name: '申請確認', path: '/driver/requests' },
		{ name: '近くの募集', path: '/driver/nearby' },
		{ name: '募集検索', path: '/driver/search' },
	];

	// スタイル定義（Tailwindなしで再現）
	// スタイル定義（確実に文字が見えるように調整済み）
	const styles = {
		container: {
			maxWidth: '448px', // max-w-md と同じ幅
			margin: '0 auto',  // mx-auto (中央寄せ)
			padding: '1rem',   // px-4 pt-4 相当
			width: '100%',
		},
		tabsList: {
			display: 'grid',
			gridTemplateColumns: 'repeat(4, 1fr)', // 4等分
			gap: '4px',
			backgroundColor: '#f3f4f6', // 薄いグレー背景
			padding: '4px',
			borderRadius: '8px',
			marginBottom: '1rem',
		},
		buttonBase: {
			position: 'relative' as const,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			fontSize: '12px', // フォントサイズを明示
			padding: '8px 4px',
			borderRadius: '6px',
			border: 'none',
			cursor: 'pointer',
			width: '100%',
			fontWeight: 500,
			textDecoration: 'none',
			transition: 'all 0.2s',
			lineHeight: '1.5', // 高さを確保
		},
		// アクティブ時のスタイル
		active: {
			backgroundColor: '#ffffff', // 白背景
			color: '#000000',           // ★文字色を黒に固定
			boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
		},
		// 非アクティブ時のスタイル
		inactive: {
			backgroundColor: 'transparent',
			color: '#6b7280',           // ★文字色をグレーに固定
		},
	};

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

			{/* <div className="driver-drives-container"> */}
			<div style={styles.container}>
				{/* <div className="driver-tabs">
      				{tabs.map((tab) => {
        			// 現在のURLとタブのパスが一致していたら active にする
        			const isActive = currentPath === tab.path;
        
        			return (
          			<button
            			key={tab.path}
            			type="button"
            			className={`tab-button ${isActive ? 'active' : ''}`}
            			onClick={() => router.push(tab.path)}
          			>
            		{tab.name}
          			</button>
        			);
      				})}
    			</div> */}
				<div style={styles.tabsList}>
					{tabs.map((tab) => {
						const isActive = currentPath === tab.path;

						// スタイルを結合 (基本 + アクティブ/非アクティブ)
						const currentButtonStyle = {
							...styles.buttonBase,
							...(isActive ? styles.active : styles.inactive)
						};

						return (
							<button
								key={tab.id}
								type="button"
								style={currentButtonStyle}
								onClick={() => router.push(tab.path)}
							>
								{tab.name}
							</button>
						);
					})}
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

