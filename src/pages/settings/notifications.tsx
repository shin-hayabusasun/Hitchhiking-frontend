// % Start(AI Assistant)
// 通知設定画面（プッシュ通知等の受信設定）

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader';

export function NotificationSettingsPage() {
	const router = useRouter();
	const [settings, setSettings] = useState({
		rideRequest: true,
		message: true,
		reminder: true,
		promotion: false,
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		async function fetchSettings() {
			try {
				const response = await fetch('/api/settings/notifications', {
					method: 'GET',
					credentials: 'include',
				});
				const data = await response.json();
				if (response.ok) {
					setSettings({
						rideRequest: data.rideRequest ?? true,
						message: data.message ?? true,
						reminder: data.reminder ?? true,
						promotion: data.promotion ?? false,
					});
				}
			} catch (err) {
				setError('設定の取得に失敗しました');
			} finally {
				setLoading(false);
			}
		}
		fetchSettings();
	}, []);

	async function handleSave() {
		setError('');

		try {
			const response = await fetch('/api/settings/notifications', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(settings),
			});

			const data = await response.json();
			if (response.ok) {
				alert('通知設定を更新しました');
				router.push('/settings');
			} else {
				setError(data.message || '更新に失敗しました');
			}
		} catch (err) {
			setError('更新に失敗しました');
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100">
				<TitleHeader title="通知設定" backPath="/settings" />
				<main className="p-8 text-center">
					<p>読み込み中...</p>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<TitleHeader title="通知設定" backPath="/settings" />
			<main className="p-8">
				<div className="bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-2xl font-bold mb-6">通知設定</h2>

					<div className="space-y-6">
						<div className="flex justify-between items-center pb-4 border-b">
							<div>
								<h3 className="font-semibold">同乗申請通知</h3>
								<p className="text-sm text-gray-600">
									同乗者からの申請があった際の通知
								</p>
							</div>
							<label className="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={settings.rideRequest}
									onChange={(e) =>
										setSettings({ ...settings, rideRequest: e.target.checked })
									}
									className="sr-only peer"
								/>
								<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
							</label>
						</div>

						<div className="flex justify-between items-center pb-4 border-b">
							<div>
								<h3 className="font-semibold">メッセージ通知</h3>
								<p className="text-sm text-gray-600">
									新しいメッセージが届いた際の通知
								</p>
							</div>
							<label className="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={settings.message}
									onChange={(e) =>
										setSettings({ ...settings, message: e.target.checked })
									}
									className="sr-only peer"
								/>
								<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
							</label>
						</div>

						<div className="flex justify-between items-center pb-4 border-b">
							<div>
								<h3 className="font-semibold">リマインダー</h3>
								<p className="text-sm text-gray-600">
									ドライブ予定のリマインダー通知
								</p>
							</div>
							<label className="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={settings.reminder}
									onChange={(e) =>
										setSettings({ ...settings, reminder: e.target.checked })
									}
									className="sr-only peer"
								/>
								<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
							</label>
						</div>

						<div className="flex justify-between items-center pb-4">
							<div>
								<h3 className="font-semibold">プロモーション</h3>
								<p className="text-sm text-gray-600">
									キャンペーンやお得な情報の通知
								</p>
							</div>
							<label className="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={settings.promotion}
									onChange={(e) =>
										setSettings({ ...settings, promotion: e.target.checked })
									}
									className="sr-only peer"
								/>
								<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
							</label>
						</div>
					</div>

					{error && <p className="text-red-500 text-sm mt-4">{error}</p>}

					<div className="mt-8 flex justify-end space-x-4">
						<button
							onClick={() => router.back()}
							className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded"
						>
							キャンセル
						</button>
						<button
							onClick={handleSave}
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
						>
							保存
						</button>
					</div>
				</div>
			</main>
		</div>
	);
}

export default NotificationSettingsPage;

// % End

