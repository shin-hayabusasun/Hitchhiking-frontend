// % Start(小松暉)
// マイドライブ画面: 運転者として登録したドライブ予定の一覧を表示・管理する

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DriverHeader } from '@/components/driver/DriverHeader';
import { MyDriveCard } from '@/components/driver/MyDriveCard';
import { Plus } from 'lucide-react';

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
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			<div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">
				<div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
					<DriverHeader title="マイドライブ" />
				</div>

				<main className="flex-1 p-4 pb-10">
					
					{/* タブメニュー（スマホ用にフォントサイズ調整） */}
					<div className="grid grid-cols-4 gap-1 bg-gray-200/50 p-1 rounded-xl mb-6 backdrop-blur-sm">
						{tabs.map((tab) => {
							const isActive = currentPath === tab.path;
							return (
								<button
									key={tab.id}
									type="button"
									className={`py-2 text-[10px] font-bold rounded-lg transition-all duration-200 ${isActive
											? 'bg-white text-black shadow-sm'
											: 'text-gray-500 hover:text-gray-700'
										}`}
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
							className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold shadow-lg shadow-green-100 mb-6 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
							onClick={handleCreateClick}
						>
							<Plus size={20} /> ドライブを作成
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
				</main>
			</div>
		</div>
	);
}

export default DriverDrivesPage;

// % End

