// % Start(AI Assistant)
// ドライブ編集画面。既存の募集内容を編集または削除する。

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader';

export function EditDrivePage() {
	const router = useRouter();
	const { driveId } = router.query;
	const [formData, setFormData] = useState({
		departure: '',
		destination: '',
		departureTime: '',
		capacity: 1,
		fee: 0,
		message: '',
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		if (driveId) {
			async function fetchDriveData() {
				try {
					const response = await fetch(`/api/drives/${driveId}`, {
						method: 'GET',
						credentials: 'include',
					});
					const data = await response.json();
					if (response.ok && data.drive) {
						setFormData({
							departure: data.drive.departure || '',
							destination: data.drive.destination || '',
							departureTime: data.drive.departureTime || '',
							capacity: data.drive.capacity || 1,
							fee: data.drive.fee || 0,
							message: data.drive.message || '',
						});
					}
				} catch (err) {
					setError('データの取得に失敗しました');
				} finally {
					setLoading(false);
				}
			}
			fetchDriveData();
		}
	}, [driveId]);

	async function handleSave() {
		setError('');

		if (!formData.departure || !formData.destination || !formData.departureTime) {
			setError('必須項目を全て入力してください');
			return;
		}

		try {
			const response = await fetch(`/api/drives/${driveId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				alert('ドライブを更新しました');
				router.push('/driver/drives');
			} else {
				setError('更新に失敗しました');
			}
		} catch (err) {
			setError('更新に失敗しました');
		}
	}

	async function handleDelete() {
		if (!confirm('このドライブを削除してもよろしいですか？')) {
			return;
		}

		try {
			const response = await fetch(`/api/drives/${driveId}`, {
				method: 'DELETE',
				credentials: 'include',
			});

			if (response.ok) {
				alert('ドライブを削除しました');
				router.push('/driver/drives');
			} else {
				setError('削除に失敗しました');
			}
		} catch (err) {
			setError('削除に失敗しました');
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100">
				<TitleHeader title="ドライブ編集" />
				<main className="p-8 text-center">
					<p>読み込み中...</p>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<TitleHeader title="ドライブ編集" backPath="/driver/drives" />
			<main className="p-8">
				<div className="bg-white p-6 rounded-lg shadow-md">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-2xl font-bold">ドライブ情報を編集</h2>
						<button
							onClick={handleDelete}
							className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
						>
							削除
						</button>
					</div>

					<div className="space-y-4">
						<div>
							<label className="block text-gray-700 text-sm font-bold mb-2">
								出発地 *
							</label>
							<input
								type="text"
								className="shadow border rounded w-full py-2 px-3"
								value={formData.departure}
								onChange={(e) =>
									setFormData({ ...formData, departure: e.target.value })
								}
								required
							/>
						</div>

						<div>
							<label className="block text-gray-700 text-sm font-bold mb-2">
								目的地 *
							</label>
							<input
								type="text"
								className="shadow border rounded w-full py-2 px-3"
								value={formData.destination}
								onChange={(e) =>
									setFormData({ ...formData, destination: e.target.value })
								}
								required
							/>
						</div>

						<div>
							<label className="block text-gray-700 text-sm font-bold mb-2">
								出発日時 *
							</label>
							<input
								type="datetime-local"
								className="shadow border rounded w-full py-2 px-3"
								value={formData.departureTime}
								onChange={(e) =>
									setFormData({ ...formData, departureTime: e.target.value })
								}
								required
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-gray-700 text-sm font-bold mb-2">
									募集人数 *
								</label>
								<input
									type="number"
									className="shadow border rounded w-full py-2 px-3"
									value={formData.capacity}
									onChange={(e) =>
										setFormData({ ...formData, capacity: Number(e.target.value) })
									}
									min="1"
									required
								/>
							</div>
							<div>
								<label className="block text-gray-700 text-sm font-bold mb-2">
									料金 (円) *
								</label>
								<input
									type="number"
									className="shadow border rounded w-full py-2 px-3"
									value={formData.fee}
									onChange={(e) =>
										setFormData({ ...formData, fee: Number(e.target.value) })
									}
									min="0"
									required
								/>
							</div>
						</div>

						<div>
							<label className="block text-gray-700 text-sm font-bold mb-2">
								メッセージ
							</label>
							<textarea
								rows={4}
								className="shadow border rounded w-full py-2 px-3"
								value={formData.message}
								onChange={(e) =>
									setFormData({ ...formData, message: e.target.value })
								}
							></textarea>
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

export default EditDrivePage;

// % End

