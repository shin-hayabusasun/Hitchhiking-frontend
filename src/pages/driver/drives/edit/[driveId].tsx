// % Start(AI Assistant)
// ドライブ編集画面。既存の募集内容を編集または削除する。

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader';
import {
	ArrowLeft, MapPin, Calendar, Clock, Users,
	DollarSign, Car, Check, Trash2, Dog, Music, Utensils
} from 'lucide-react';

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
		noSmoking: true,
		petAllowed: false,
		musicAllowed: true,
		foodAllowed: false,
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
							noSmoking: data.drive.vehicleRules?.noSmoking ?? true,
							petAllowed: data.drive.vehicleRules?.petAllowed ?? false,
							musicAllowed: data.drive.vehicleRules?.musicAllowed ?? true,
							foodAllowed: data.drive.vehicleRules?.foodAllowed ?? false,
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

	// if (loading) {
	// 	return (
	// 		<div className="min-h-screen bg-gray-100">
	// 			<TitleHeader title="ドライブ編集" />
	// 			<main className="p-8 text-center">
	// 				<p>読み込み中...</p>
	// 			</main>
	// 		</div>
	// 	);
	// }
	if (loading) {
		return (
			/* 外側の背景（中央寄せ用） */
			<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

				<div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">

					{/* 読み込み中でもヘッダーだけは見せておく */}
					<div className="bg-white shadow-sm p-4 flex items-center gap-3 border-b border-gray-100">
						<button onClick={() => router.push('/driver/drives')} className="text-gray-600 p-1">
							<ArrowLeft className="w-5 h-5" />
						</button>
						<h1 className="text-green-600 font-bold text-lg">ドライブ編集</h1>
					</div>

					{/* フレームの中央にローディングを表示 */}
					<div className="flex-1 flex flex-col items-center justify-center space-y-3">
						<p className="text-sm font-bold text-gray-400">読み込み中</p>
					</div>
				</div>
			</div>
		);
	}

	// return (
	// 	<div className="min-h-screen bg-gray-100">
	// 		<TitleHeader title="ドライブ編集" backPath="/driver/drives" />
	// 		<main className="p-8">
	// 			<div className="bg-white p-6 rounded-lg shadow-md">
	// 				<div className="flex justify-between items-center mb-6">
	// 					<h2 className="text-2xl font-bold">ドライブ情報を編集</h2>
	// 					<button
	// 						onClick={handleDelete}
	// 						className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
	// 					>
	// 						削除
	// 					</button>
	// 				</div>

	// 				<div className="space-y-4">
	// 					<div>
	// 						<label className="block text-gray-700 text-sm font-bold mb-2">
	// 							出発地 *
	// 						</label>
	// 						<input
	// 							type="text"
	// 							className="shadow border rounded w-full py-2 px-3"
	// 							value={formData.departure}
	// 							onChange={(e) =>
	// 								setFormData({ ...formData, departure: e.target.value })
	// 							}
	// 							required
	// 						/>
	// 					</div>

	// 					<div>
	// 						<label className="block text-gray-700 text-sm font-bold mb-2">
	// 							目的地 *
	// 						</label>
	// 						<input
	// 							type="text"
	// 							className="shadow border rounded w-full py-2 px-3"
	// 							value={formData.destination}
	// 							onChange={(e) =>
	// 								setFormData({ ...formData, destination: e.target.value })
	// 							}
	// 							required
	// 						/>
	// 					</div>

	// 					<div>
	// 						<label className="block text-gray-700 text-sm font-bold mb-2">
	// 							出発日時 *
	// 						</label>
	// 						<input
	// 							type="datetime-local"
	// 							className="shadow border rounded w-full py-2 px-3"
	// 							value={formData.departureTime}
	// 							onChange={(e) =>
	// 								setFormData({ ...formData, departureTime: e.target.value })
	// 							}
	// 							required
	// 						/>
	// 					</div>

	// 					<div className="grid grid-cols-2 gap-4">
	// 						<div>
	// 							<label className="block text-gray-700 text-sm font-bold mb-2">
	// 								募集人数 *
	// 							</label>
	// 							<input
	// 								type="number"
	// 								className="shadow border rounded w-full py-2 px-3"
	// 								value={formData.capacity}
	// 								onChange={(e) =>
	// 									setFormData({ ...formData, capacity: Number(e.target.value) })
	// 								}
	// 								min="1"
	// 								required
	// 							/>
	// 						</div>
	// 						<div>
	// 							<label className="block text-gray-700 text-sm font-bold mb-2">
	// 								料金 (円) *
	// 							</label>
	// 							<input
	// 								type="number"
	// 								className="shadow border rounded w-full py-2 px-3"
	// 								value={formData.fee}
	// 								onChange={(e) =>
	// 									setFormData({ ...formData, fee: Number(e.target.value) })
	// 								}
	// 								min="0"
	// 								required
	// 							/>
	// 						</div>
	// 					</div>

	// 					<div>
	// 						<label className="block text-gray-700 text-sm font-bold mb-2">
	// 							メッセージ
	// 						</label>
	// 						<textarea
	// 							rows={4}
	// 							className="shadow border rounded w-full py-2 px-3"
	// 							value={formData.message}
	// 							onChange={(e) =>
	// 								setFormData({ ...formData, message: e.target.value })
	// 							}
	// 						></textarea>
	// 					</div>
	// 				</div>

	// 				{error && <p className="text-red-500 text-sm mt-4">{error}</p>}

	// 				<div className="mt-8 flex justify-end space-x-4">
	// 					<button
	// 						onClick={() => router.back()}
	// 						className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded"
	// 					>
	// 						キャンセル
	// 					</button>
	// 					<button
	// 						onClick={handleSave}
	// 						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
	// 					>
	// 						保存
	// 					</button>
	// 				</div>
	// 			</div>
	// 		</main>
	// 	</div>
	// );
	return (
		
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

			<div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">

				{/* ヘッダー */}
				<div className="bg-white shadow-sm sticky top-0 z-20 p-4 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<button onClick={() => router.push('/driver/drives')} className="text-gray-600 p-1">
							<ArrowLeft className="w-5 h-5" />
						</button>
						<h1 className="text-green-600 font-bold text-lg">ドライブ編集</h1>
					</div>
					<button
						onClick={handleDelete}
						className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
					>
						<Trash2 className="w-5 h-5" />
					</button>
				</div>

				<form onSubmit={handleSave} className="p-4 space-y-4">
					{/* ルート情報カード */}
					<div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
						<p className="text-xs font-bold text-gray-400 uppercase">ルート情報</p>
						<div className="space-y-3">
							<div className="space-y-1">
								<label className="text-[10px] font-bold text-gray-500 ml-1">出発地 *</label>
								<div className="relative">
									<MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
									<input
										type="text"
										className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
										value={formData.departure}
										onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
										required
									/>
								</div>
							</div>
							<div className="space-y-1">
								<label className="text-[10px] font-bold text-gray-500 ml-1">目的地 *</label>
								<div className="relative">
									<MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
									<input
										type="text"
										className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
										value={formData.destination}
										onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
										required
									/>
								</div>
							</div>
						</div>
					</div>

					{/* 日時カード */}
					<div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
						<p className="text-xs font-bold text-gray-400 uppercase">出発日時</p>
						<div className="relative">
							<Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
							<input
								type="datetime-local"
								className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
								value={formData.departureTime}
								onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
								required
							/>
						</div>
					</div>

					{/* 詳細情報カード */}
					<div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
						<p className="text-xs font-bold text-gray-400 uppercase">募集詳細</p>
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1">
								<label className="text-[10px] font-bold text-gray-500 ml-1">募集人数</label>
								<div className="relative">
									<Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
									<input
										type="number"
										className="w-full pl-10 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
										value={formData.capacity}
										onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
										min="1"
										required
									/>
								</div>
							</div>
							<div className="space-y-1">
								<label className="text-[10px] font-bold text-gray-500 ml-1">料金/人</label>
								<div className="relative">
									<DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
									<input
										type="number"
										className="w-full pl-10 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold"
										value={formData.fee}
										onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
										min="0"
										required
									/>
								</div>
							</div>
						</div>
						<div className="space-y-1">
							<label className="text-[10px] font-bold text-gray-500 ml-1">メッセージ</label>
							<textarea
								rows={3}
								className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
								value={formData.message}
								onChange={(e) => setFormData({ ...formData, message: e.target.value })}
								placeholder="注意事項など"
							/>
						</div>
					</div>

					<div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
						<p className="text-xs font-bold text-gray-400 uppercase tracking-wider">車両ルール</p>
						<div className="space-y-3">
							{/* 禁煙設定 */}
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500"><Car size={16} /></div>
									<span className="text-sm font-medium text-gray-700">禁煙</span>
								</div>
								<input
									type="checkbox"
									className="w-10 h-5 bg-gray-200 rounded-full appearance-none checked:bg-green-500 transition-all relative after:content-[''] after:absolute after:w-4 after:h-4 after:bg-white after:rounded-full after:top-0.5 after:left-0.5 checked:after:left-5 cursor-pointer"
									checked={formData.noSmoking}
									onChange={(e) => setFormData({ ...formData, noSmoking: e.target.checked })}
								/>
							</div>

							{/* ペット設定 */}
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500"><Dog size={16} /></div>
									<span className="text-sm font-medium text-gray-700">ペット可</span>
								</div>
								<input
									type="checkbox"
									className="w-10 h-5 bg-gray-200 rounded-full appearance-none checked:bg-green-500 transition-all relative after:content-[''] after:absolute after:w-4 after:h-4 after:bg-white after:rounded-full after:top-0.5 after:left-0.5 checked:after:left-5 cursor-pointer"
									checked={formData.petAllowed}
									onChange={(e) => setFormData({ ...formData, petAllowed: e.target.checked })}
								/>
							</div>

							{/* 飲食設定 */}
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500"><Utensils size={16} /></div>
									<span className="text-sm font-medium text-gray-700">飲食OK</span>
								</div>
								<input
									type="checkbox"
									className="w-10 h-5 bg-gray-200 rounded-full appearance-none checked:bg-green-500 transition-all relative after:content-[''] after:absolute after:w-4 after:h-4 after:bg-white after:rounded-full after:top-0.5 after:left-0.5 checked:after:left-5 cursor-pointer"
									checked={formData.foodAllowed}
									onChange={(e) => setFormData({ ...formData, foodAllowed: e.target.checked })}
								/>
							</div>

							{/* 音楽設定 */}
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500"><Music size={16} /></div>
									<span className="text-sm font-medium text-gray-700">音楽OK</span>
								</div>
								<input
									type="checkbox"
									className="w-10 h-5 bg-gray-200 rounded-full appearance-none checked:bg-green-500 transition-all relative after:content-[''] after:absolute after:w-4 after:h-4 after:bg-white after:rounded-full after:top-0.5 after:left-0.5 checked:after:left-5 cursor-pointer"
									checked={formData.musicAllowed}
									onChange={(e) => setFormData({ ...formData, musicAllowed: e.target.checked })}
								/>
							</div>
						</div>
					</div>

					{error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}

					{/* 保存ボタン */}
					<div className="pt-2 pb-8 space-y-3">
						
						<button
							type="submit"
							className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold shadow-lg shadow-green-100 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
						>
							<Check size={20} /> 変更を保存
						</button>
						<p className="text-[10px] text-center text-gray-400 px-4">
							※既に申請がある場合、変更内容が同乗者に通知されます
						</p>
						
					</div>
				</form>
			</div>
		</div>
	);
}

export default EditDrivePage;

// % End

