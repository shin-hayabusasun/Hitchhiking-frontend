// % Start(AI Assistant)
// ドライブ管理画面（予定中、進行中、完了のタブ切り替え）

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DriverHeader } from '@/components/driver/DriverHeader';

interface Drive {
	id: string;
	departure: string;
	destination: string;
	departureTime: string;
	status: 'scheduled' | 'active' | 'completed';
	passengers: number;
	capacity: number;
}

export function DriveManagePage() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<
		'scheduled' | 'active' | 'completed'
	>('scheduled');
	const [drives, setDrives] = useState<Drive[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		fetchDrives();
	}, [activeTab]);

	async function fetchDrives() {
		setLoading(true);
		setError('');

		try {
			const response = await fetch(
				`/api/driver/drives?status=${activeTab}`,
				{
					method: 'GET',
					credentials: 'include',
				}
			);
			const data = await response.json();
			if (response.ok && data.drives) {
				setDrives(data.drives);
			}
		} catch (err) {
			setError('ドライブ情報の取得に失敗しました');
		} finally {
			setLoading(false);
		}
	}

	async function handleComplete(driveId: string) {
		if (!confirm('このドライブを完了しますか？')) {
			return;
		}

		try {
			const response = await fetch(`/api/drives/${driveId}/complete`, {
				method: 'POST',
				credentials: 'include',
			});

			if (response.ok) {
				alert('ドライブが完了しました');
				router.push('/driver/complete');
			} else {
				alert('完了処理に失敗しました');
			}
		} catch (err) {
			alert('完了処理に失敗しました');
		}
	}

	async function handleCancel(driveId: string) {
		if (!confirm('このドライブをキャンセルしますか？')) {
			return;
		}

		try {
			const response = await fetch(`/api/drives/${driveId}/cancel`, {
				method: 'POST',
				credentials: 'include',
			});

			if (response.ok) {
				alert('ドライブをキャンセルしました');
				fetchDrives();
			} else {
				alert('キャンセルに失敗しました');
			}
		} catch (err) {
			alert('キャンセルに失敗しました');
		}
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<DriverHeader />
			<main className="p-8">
				<h2 className="text-2xl font-bold mb-6 text-center">ドライブ管理</h2>

				<div className="mb-6 flex justify-center space-x-4">
					<button
						onClick={() => setActiveTab('scheduled')}
						className={`px-6 py-2 rounded ${
							activeTab === 'scheduled'
								? 'bg-blue-500 text-white'
								: 'bg-gray-200 text-gray-700'
						}`}
					>
						予定中
					</button>
					<button
						onClick={() => setActiveTab('active')}
						className={`px-6 py-2 rounded ${
							activeTab === 'active'
								? 'bg-green-500 text-white'
								: 'bg-gray-200 text-gray-700'
						}`}
					>
						進行中
					</button>
					<button
						onClick={() => setActiveTab('completed')}
						className={`px-6 py-2 rounded ${
							activeTab === 'completed'
								? 'bg-gray-500 text-white'
								: 'bg-gray-200 text-gray-700'
						}`}
					>
						完了
					</button>
				</div>

				{loading ? (
					<p className="text-center">読み込み中...</p>
				) : error ? (
					<p className="text-center text-red-500">{error}</p>
				) : drives.length === 0 ? (
					<p className="text-center text-gray-600">
						{activeTab === 'scheduled' && '予定中のドライブはありません'}
						{activeTab === 'active' && '進行中のドライブはありません'}
						{activeTab === 'completed' && '完了したドライブはありません'}
					</p>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{drives.map((drive) => (
							<div key={drive.id} className="bg-white rounded-lg shadow-md p-4">
								<h3 className="font-bold text-lg mb-2">
									{drive.departure} → {drive.destination}
								</h3>
								<p className="text-sm text-gray-600 mb-2">
									{drive.departureTime}
								</p>
								<p className="text-sm text-gray-600 mb-4">
									同乗者: {drive.passengers}/{drive.capacity}名
								</p>

								<div className="flex flex-col space-y-2">
									{activeTab === 'scheduled' && (
										<>
											<button
												onClick={() =>
													router.push(`/driver/requests?driveId=${drive.id}`)
												}
												className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
											>
												承認待ち確認
											</button>
											<button
												onClick={() =>
													router.push(`/driver/drives/edit/${drive.id}`)
												}
												className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded text-sm"
											>
												編集
											</button>
											<button
												onClick={() => handleCancel(drive.id)}
												className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
											>
												キャンセル
											</button>
										</>
									)}
									{activeTab === 'active' && (
										<>
											<button
												onClick={() =>
													router.push(`/chat/${drive.id}`)
												}
												className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
											>
												💬 チャット
											</button>
											<button
												onClick={() => handleComplete(drive.id)}
												className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
											>
												完了する
											</button>
										</>
									)}
									{activeTab === 'completed' && (
										<button
											onClick={() =>
												router.push(`/driver/review/${drive.id}`)
											}
											className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
										>
											評価を見る
										</button>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</main>
		</div>
	);
}

export default DriveManagePage;

// % End

