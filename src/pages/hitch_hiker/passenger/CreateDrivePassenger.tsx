// % Start(田所櫂人)
// 募集作成画面: 同乗者がルート、日時等の条件を設定して募集を作成する画面

import { useState } from 'react';
import { useRouter } from 'next/router';
import { driveApi } from '@/lib/api';
import { TitleHeader } from '@/components/TitleHeader';

export function CreateDrivePassengerPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		departure: '',
		destination: '',
		departureDate: '',
		departureTime: '',
		capacity: 1,
		fee: 0,
		message: '',
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
		return true;
	}

	async function handleCreateClick() {
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
			});

			alert('募集を作成しました');
			router.push('/hitch_hiker/Search');
		} catch (err) {
			setError('募集の作成に失敗しました');
		} finally {
			setLoading(false);
		}
	}

	function handleBack() {
		router.push('/hitch_hiker/Search');
	}

	return (
		<div className="create-drive-passenger-page">
			<TitleHeader title="募集作成" />

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
						希望人数
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
						希望料金（円）
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
						placeholder="運転者へのメッセージを入力してください"
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
						onClick={handleCreateClick}
						disabled={loading}
					>
						{loading ? '作成中...' : '募集を作成'}
					</button>
				</div>
			</div>
		</div>
	);
}

export default CreateDrivePassengerPage;

// % End

