// % Start(小松暉)
// 新規ドライブ作成画面: ルートや条件を設定して募集を開始する新規ドライブ作成画面

import { useState } from 'react';
import { useRouter } from 'next/router';
import { driveApi } from '@/lib/api';
import { TitleHeader } from '@/components/TitleHeader';
import {
	ArrowLeft, MapPin, Calendar, Clock, Users,
	DollarSign, Car, Check, Music, Dog, Utensils
} from 'lucide-react';

export function CreateDrivePage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		departure: '',
		destination: '',
		departureDate: '',
		departureTime: '',
		capacity: 1,
		fee: 0,
		message: '',
		noSmoking: false,
		petAllowed: false,
		musicAllowed: false,
		foodAllowed: false, // 追加分
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	function validateForm() {
		if (!formData.departure) {
			setError('出発地を入力してください');
			return false;
		}
		if (!formData.destination) {
			setError('目的地を入力してください');
			return false;
		}
		if (!formData.departureDate || !formData.departureTime) {
			setError('出発日時を入力してください');
			return false;
		}
		if (formData.capacity < 1) {
			setError('定員は1人以上で設定してください');
			return false;
		}
		if (formData.fee < 0) {
			setError('料金は0円以上で設定してください');
			return false;
		}
		return true;
	}

	async function handleSaveClick() {
		setError('');

		if (!validateForm()) {
			return;
		}

		setLoading(true);

		try {
			const departuretime = `${formData.departureDate}T${formData.departureTime}:00`;

			await driveApi.createDrive({
				departure: formData.departure,
				destination: formData.destination,
				departuretime,
				capacity: formData.capacity,
				fee: formData.fee,
				message: formData.message,
				vehiclerules: {
					noSmoking: formData.noSmoking,
					petAllowed: formData.petAllowed,
					musicAllowed: formData.musicAllowed,
					foodAllowed: data.drive.vehicleRules?.foodAllowed ?? false,
				},
			});

			alert('ドライブを作成しました');
			router.push('/driver/drives');
		} catch (err) {
			setError('ドライブの作成に失敗しました');
		} finally {
			setLoading(false);
		}
	}

	function handleBack() {
		router.push('/driver/drives');
	}

	// return (
	// 	<div className="create-drive-page">
	// 		<TitleHeader title="ドライブ作成" />

	// 		<div className="create-drive-container">
	// 			<div className="form-group">
	// 				<label htmlFor="departure" className="form-label">
	// 					出発地
	// 				</label>
	// 				<input
	// 					type="text"
	// 					id="departure"
	// 					className="form-input"
	// 					value={formData.departure}
	// 					onChange={(e) => {
	// 						setFormData({
	// 							...formData,
	// 							departure: e.target.value,
	// 						});
	// 					}}
	// 					placeholder="例: 東京駅"
	// 				/>
	// 			</div>

	// 			<div className="form-group">
	// 				<label htmlFor="destination" className="form-label">
	// 					目的地
	// 				</label>
	// 				<input
	// 					type="text"
	// 					id="destination"
	// 					className="form-input"
	// 					value={formData.destination}
	// 					onChange={(e) => {
	// 						setFormData({
	// 							...formData,
	// 							destination: e.target.value,
	// 						});
	// 					}}
	// 					placeholder="例: 新宿駅"
	// 				/>
	// 			</div>

	// 			<div className="form-group">
	// 				<label className="form-label">出発日時</label>
	// 				<div className="datetime-input-group">
	// 					<input
	// 						type="date"
	// 						className="form-input"
	// 						value={formData.departureDate}
	// 						onChange={(e) => {
	// 							setFormData({
	// 								...formData,
	// 								departureDate: e.target.value,
	// 							});
	// 						}}
	// 					/>
	// 					<input
	// 						type="time"
	// 						className="form-input"
	// 						value={formData.departureTime}
	// 						onChange={(e) => {
	// 							setFormData({
	// 								...formData,
	// 								departureTime: e.target.value,
	// 							});
	// 						}}
	// 					/>
	// 				</div>
	// 			</div>

	// 			<div className="form-group">
	// 				<label htmlFor="capacity" className="form-label">
	// 					定員
	// 				</label>
	// 				<input
	// 					type="number"
	// 					id="capacity"
	// 					className="form-input"
	// 					value={formData.capacity}
	// 					onChange={(e) => {
	// 						setFormData({
	// 							...formData,
	// 							capacity: Number(e.target.value),
	// 						});
	// 					}}
	// 					min="1"
	// 					max="10"
	// 				/>
	// 			</div>

	// 			<div className="form-group">
	// 				<label htmlFor="fee" className="form-label">
	// 					料金（円）
	// 				</label>
	// 				<input
	// 					type="number"
	// 					id="fee"
	// 					className="form-input"
	// 					value={formData.fee}
	// 					onChange={(e) => {
	// 						setFormData({
	// 							...formData,
	// 							fee: Number(e.target.value),
	// 						});
	// 					}}
	// 					min="0"
	// 					step="100"
	// 				/>
	// 			</div>

	// 			<div className="form-group">
	// 				<label className="form-label">車両ルール</label>
	// 				<div className="checkbox-group">
	// 					<label className="checkbox-label">
	// 						<input
	// 							type="checkbox"
	// 							checked={formData.noSmoking}
	// 							onChange={(e) => {
	// 								setFormData({
	// 									...formData,
	// 									noSmoking: e.target.checked,
	// 								});
	// 							}}
	// 						/>
	// 						<span>禁煙</span>
	// 					</label>
	// 					<label className="checkbox-label">
	// 						<input
	// 							type="checkbox"
	// 							checked={formData.petAllowed}
	// 							onChange={(e) => {
	// 								setFormData({
	// 									...formData,
	// 									petAllowed: e.target.checked,
	// 								});
	// 							}}
	// 						/>
	// 						<span>ペット可</span>
	// 					</label>
	// 					<label className="checkbox-label">
	// 						<input
	// 							type="checkbox"
	// 							checked={formData.musicAllowed}
	// 							onChange={(e) => {
	// 								setFormData({
	// 									...formData,
	// 									musicAllowed: e.target.checked,
	// 								});
	// 							}}
	// 						/>
	// 						<span>音楽可</span>
	// 					</label>
	// 				</div>
	// 			</div>

	// 			<div className="form-group">
	// 				<label htmlFor="message" className="form-label">
	// 					メッセージ（任意）
	// 				</label>
	// 				<textarea
	// 					id="message"
	// 					className="form-textarea"
	// 					value={formData.message}
	// 					onChange={(e) => {
	// 						setFormData({
	// 							...formData,
	// 							message: e.target.value,
	// 						});
	// 					}}
	// 					rows={4}
	// 					placeholder="同乗者へのメッセージを入力してください"
	// 				></textarea>
	// 			</div>

	// 			{error && <div className="error-message">{error}</div>}

	// 			<div className="form-actions">
	// 				<button
	// 					type="button"
	// 					className="btn btn-secondary"
	// 					onClick={handleBack}
	// 				>
	// 					戻る
	// 				</button>
	// 				<button
	// 					type="button"
	// 					className="btn btn-primary"
	// 					onClick={handleSaveClick}
	// 					disabled={loading}
	// 				>
	// 					{loading ? '作成中...' : '保存'}
	// 				</button>
	// 			</div>
	// 		</div>
	// 	</div>
	// );
	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

			<div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">

				{/* ヘッダー */}
				<div className="bg-white shadow-sm sticky top-0 z-10 p-4 flex items-center gap-3">
					<button onClick={() => router.push('/driver/drives')} className="text-gray-600 p-1">
						<ArrowLeft className="w-5 h-5" />
					</button>
					<h1 className="text-green-600 font-bold text-lg">ドライブを作成</h1>
				</div>

				{/* フォームエリア */}
				<form onSubmit={handleSaveClick} className="p-4 space-y-4">

					{/* ルート情報カード */}
					<div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
						<p className="text-xs font-bold text-gray-400 uppercase tracking-wider">ルート情報</p>

						<div className="space-y-2">
							<label className="text-xs font-bold text-gray-600 flex justify-between">
								出発地 <span className="text-[10px] text-red-500 font-normal">※自宅付近は避けてください</span>
							</label>
							<div className="relative">
								<MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
								<input
									type="text"
									className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
									placeholder="例: 東京駅"
									value={formData.departure}
									onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<label className="text-xs font-bold text-gray-600">目的地</label>
							<div className="relative">
								<MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
								<input
									type="text"
									className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
									placeholder="例: 横浜駅"
									value={formData.destination}
									onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
								/>
							</div>
						</div>
					</div>

					{/* 日時カード */}
					<div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
						<p className="text-xs font-bold text-gray-400 uppercase tracking-wider">出発日時</p>
						<div className="grid grid-cols-2 gap-3">
							<div className="relative">
								<Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
								<input
									type="date"
									className="w-full pl-10 pr-2 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
									value={formData.departureDate}
									onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
								/>
							</div>
							<div className="relative">
								<Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
								<input
									type="time"
									className="w-full pl-10 pr-2 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
									value={formData.departureTime}
									onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
								/>
							</div>
						</div>
					</div>

					{/* 詳細設定カード */}
					<div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
						<p className="text-xs font-bold text-gray-400 uppercase tracking-wider">詳細設定</p>
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1">
								<label className="text-[10px] font-bold text-gray-500">定員</label>
								<div className="relative">
									<Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
									<input
										type="number"
										className="w-full pl-10 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
										value={formData.capacity}
										onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
									/>
								</div>
							</div>
							<div className="space-y-1">
								<label className="text-[10px] font-bold text-gray-500">料金/人</label>
								<div className="relative">
									<DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
									<input
										type="number"
										className="w-full pl-10 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-green-600"
										value={formData.fee}
										onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
									/>
								</div>
							</div>
						</div>
						<textarea
							className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm min-h-[80px] outline-none"
							placeholder="メッセージ（任意）"
							value={formData.message}
							onChange={(e) => setFormData({ ...formData, message: e.target.value })}
						/>
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

					

					{error && <div className="text-red-500 text-xs text-center font-bold">{error}</div>}

					{/* 作成ボタン */}
					<button
						type="submit"
						disabled={loading}
						className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold shadow-lg shadow-green-100 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:bg-gray-400"
					>
						{loading ? '作成中...' : <><Check size={20} /> ドライブを確定</>}
					</button>
					<div className="h-10" /> {/* 余白 */}
				</form>
			</div>
		</div >
	);
}

export default CreateDrivePage;

// % End

