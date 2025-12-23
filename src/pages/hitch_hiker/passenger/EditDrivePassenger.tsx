// % Start(AI Assistant)
// 同乗者側募集編集画面。既存募集の編集・削除を行う。

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader';

export function EditDrivePassengerPage() {
	const router = useRouter();
	const { id } = router.query;
	const [formData, setFormData] = useState({
		departure: '',
		destination: '',
		date: '',
		time: '',
		details: '',
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		if (id) {
			async function fetchDriveData() {
				try {
					const response = await fetch(`/api/passenger/requests/${id}`, {
						method: 'GET',
						credentials: 'include',
					});
					const data = await response.json();
					if (response.ok) {
						setFormData({
							departure: data.departure || '',
							destination: data.destination || '',
							date: data.date || '',
							time: data.time || '',
							details: data.details || '',
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
	}, [id]);

	async function handleSave() {
		setError('');

		if (!formData.departure || !formData.destination || !formData.date || !formData.time) {
			setError('全ての必須項目を入力してください');
			return;
		}

		try {
			const response = await fetch(`/api/passenger/requests/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				alert('募集を更新しました');
				router.push('/hitch_hiker/Search');
			} else {
				setError('更新に失敗しました');
			}
		} catch (err) {
			setError('更新に失敗しました');
		}
	}

	async function handleDelete() {
		if (!confirm('この募集を削除してもよろしいですか？')) {
			return;
		}

		try {
			const response = await fetch(`/api/passenger/requests/${id}`, {
				method: 'DELETE',
				credentials: 'include',
			});

			if (response.ok) {
				alert('募集を削除しました');
				router.push('/hitch_hiker/Search');
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
				<TitleHeader title="募集編集" />
				<main className="p-8 text-center">
					<p>読み込み中...</p>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<TitleHeader title="募集編集" backPath="/hitch_hiker/Search" />
			<main className="p-8">
				<div className="bg-white p-6 rounded-lg shadow-md">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-2xl font-bold">募集内容を編集</h2>
						<button
							onClick={handleDelete}
							className="text-red-500 hover:text-red-700"
							title="削除"
						>
							🗑️ 削除
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

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-gray-700 text-sm font-bold mb-2">
									希望日 *
								</label>
								<input
									type="date"
									className="shadow border rounded w-full py-2 px-3"
									value={formData.date}
									onChange={(e) =>
										setFormData({ ...formData, date: e.target.value })
									}
									required
								/>
							</div>
							<div>
								<label className="block text-gray-700 text-sm font-bold mb-2">
									希望時間 *
								</label>
								<input
									type="time"
									className="shadow border rounded w-full py-2 px-3"
									value={formData.time}
									onChange={(e) =>
										setFormData({ ...formData, time: e.target.value })
									}
									required
								/>
							</div>
						</div>

						<div>
							<label className="block text-gray-700 text-sm font-bold mb-2">
								詳細情報
							</label>
							<textarea
								rows={4}
								className="shadow border rounded w-full py-2 px-3"
								value={formData.details}
								onChange={(e) =>
									setFormData({ ...formData, details: e.target.value })
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
							変更を保存
						</button>
					</div>
				</div>
			</main>
		</div>
	);
}

export default EditDrivePassengerPage;

// % End

