// % Start(小松暉)
// 新規ドライブ作成画面: ルートや条件を設定して募集を開始する新規ドライブ作成画面

import { useState } from 'react';
import { useRouter } from 'next/router';
import { driveApi } from '@/lib/api';
import { TitleHeader } from '@/components/TitleHeader';

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

	return (
		<div className="create-drive-page">
			<TitleHeader title="ドライブ作成" />

			<div className="create-drive-container">
				<div className="form-group">
					<label htmlFor="departure" className="form-label">
						出発地
					</label>
					<input
						type="text"
						id="departure"
						className="form-input"
						value={formData.departure}
						onChange={(e) => {
							setFormData({
								...formData,
								departure: e.target.value,
							});
						}}
						placeholder="例: 東京駅"
					/>
				</div>

				<div className="form-group">
					<label htmlFor="destination" className="form-label">
						目的地
					</label>
					<input
						type="text"
						id="destination"
						className="form-input"
						value={formData.destination}
						onChange={(e) => {
							setFormData({
								...formData,
								destination: e.target.value,
							});
						}}
						placeholder="例: 新宿駅"
					/>
				</div>

				<div className="form-group">
					<label className="form-label">出発日時</label>
					<div className="datetime-input-group">
						<input
							type="date"
							className="form-input"
							value={formData.departureDate}
							onChange={(e) => {
								setFormData({
									...formData,
									departureDate: e.target.value,
								});
							}}
						/>
						<input
							type="time"
							className="form-input"
							value={formData.departureTime}
							onChange={(e) => {
								setFormData({
									...formData,
									departureTime: e.target.value,
								});
							}}
						/>
					</div>
				</div>

				<div className="form-group">
					<label htmlFor="capacity" className="form-label">
						定員
					</label>
					<input
						type="number"
						id="capacity"
						className="form-input"
						value={formData.capacity}
						onChange={(e) => {
							setFormData({
								...formData,
								capacity: Number(e.target.value),
							});
						}}
						min="1"
						max="10"
					/>
				</div>

				<div className="form-group">
					<label htmlFor="fee" className="form-label">
						料金（円）
					</label>
					<input
						type="number"
						id="fee"
						className="form-input"
						value={formData.fee}
						onChange={(e) => {
							setFormData({
								...formData,
								fee: Number(e.target.value),
							});
						}}
						min="0"
						step="100"
					/>
				</div>

				<div className="form-group">
					<label className="form-label">車両ルール</label>
					<div className="checkbox-group">
						<label className="checkbox-label">
							<input
								type="checkbox"
								checked={formData.noSmoking}
								onChange={(e) => {
									setFormData({
										...formData,
										noSmoking: e.target.checked,
									});
								}}
							/>
							<span>禁煙</span>
						</label>
						<label className="checkbox-label">
							<input
								type="checkbox"
								checked={formData.petAllowed}
								onChange={(e) => {
									setFormData({
										...formData,
										petAllowed: e.target.checked,
									});
								}}
							/>
							<span>ペット可</span>
						</label>
						<label className="checkbox-label">
							<input
								type="checkbox"
								checked={formData.musicAllowed}
								onChange={(e) => {
									setFormData({
										...formData,
										musicAllowed: e.target.checked,
									});
								}}
							/>
							<span>音楽可</span>
						</label>
					</div>
				</div>

				<div className="form-group">
					<label htmlFor="message" className="form-label">
						メッセージ（任意）
					</label>
					<textarea
						id="message"
						className="form-textarea"
						value={formData.message}
						onChange={(e) => {
							setFormData({
								...formData,
								message: e.target.value,
							});
						}}
						rows={4}
						placeholder="同乗者へのメッセージを入力してください"
					></textarea>
				</div>

				{error && <div className="error-message">{error}</div>}

				<div className="form-actions">
					<button
						type="button"
						className="btn btn-secondary"
						onClick={handleBack}
					>
						戻る
					</button>
					<button
						type="button"
						className="btn btn-primary"
						onClick={handleSaveClick}
						disabled={loading}
					>
						{loading ? '作成中...' : '保存'}
					</button>
				</div>
			</div>
		</div>
	);
}

export default CreateDrivePage;

// % End

