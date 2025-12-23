// % Start(稗田隼也)
// 新規登録画面: 新規ユーザー登録を行うためのUI

import { useState } from 'react';
import { useRouter } from 'next/router';

export function RegistPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		lastName: '',
		firstName: '',
		email: '',
		password: '',
		confirmPassword: '',
		sex: 1,
		year: '',
		month: '',
		day: '',
		postalCode: '',
		prefecture: '',
		city: '',
		address: '',
		isDriver: 0,
		identification: '',
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	// バリデーション
	function validateForm() {
		if (!formData.email) {
			setError('メールアドレスを入力してください');
			return false;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			setError('正しいメールアドレス形式で入力してください');
			return false;
		}
		if (!formData.password) {
			setError('パスワードを入力してください');
			return false;
		}
		if (formData.password.length < 8) {
			setError('パスワードは8文字以上で入力してください');
			return false;
		}
		if (formData.password !== formData.confirmPassword) {
			setError('パスワードが一致しません');
			return false;
		}
		if (!formData.lastName || !formData.firstName) {
			setError('氏名を入力してください');
			return false;
		}
		if (formData.isDriver === 1 && !formData.identification) {
			setError('運転者として登録する場合は運転免許証が必要です');
			return false;
		}
		return true;
	}

	// 登録処理
	async function handleRegister() {
		setError('');

		if (!validateForm()) {
			return;
		}

		setLoading(true);

		try {
			const requestData = {
				mail: formData.email,
				password: formData.password,
				name: [formData.lastName, formData.firstName],
				sex: formData.sex,
				barthday: [
					Number(formData.year),
					Number(formData.month),
					Number(formData.day),
				],
				adress: [
					formData.postalCode,
					formData.prefecture,
					formData.city,
					formData.address,
				],
				identification: formData.identification,
				isdriver: formData.isDriver,
			};

			const response = await fetch('/api/user/regist', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(requestData),
			});

			const data = await response.json();

			if (response.ok && data.ok) {
				// 登録完了画面へ遷移
				router.push('/login/Complete');
			} else {
				setError('登録に失敗しました。もう一度お試しください。');
			}
		} catch (err) {
			setError('登録に失敗しました。もう一度お試しください。');
		} finally {
			setLoading(false);
		}
	}

	function handleBack() {
		router.push('/login/logout');
	}

	function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setFormData({
					...formData,
					identification: reader.result as string,
				});
			};
			reader.readAsDataURL(file);
		}
	}

	return (
		<div className="regist-page">
			<div className="regist-container">
				<h1 className="regist-title">新規登録</h1>

				<div className="regist-form">
					<div className="form-group">
						<label className="form-label">氏名</label>
						<div className="name-input-group">
							<input
								type="text"
								className="form-input"
								value={formData.lastName}
								onChange={(e) => {
									setFormData({
										...formData,
										lastName: e.target.value,
									});
								}}
								placeholder="姓"
							/>
							<input
								type="text"
								className="form-input"
								value={formData.firstName}
								onChange={(e) => {
									setFormData({
										...formData,
										firstName: e.target.value,
									});
								}}
								placeholder="名"
							/>
						</div>
					</div>

					<div className="form-group">
						<label htmlFor="email" className="form-label">
							メールアドレス
						</label>
						<input
							type="email"
							id="email"
							className="form-input"
							value={formData.email}
							onChange={(e) => {
								setFormData({
									...formData,
									email: e.target.value,
								});
							}}
							placeholder="example@email.com"
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password" className="form-label">
							パスワード
						</label>
						<input
							type="password"
							id="password"
							className="form-input"
							value={formData.password}
							onChange={(e) => {
								setFormData({
									...formData,
									password: e.target.value,
								});
							}}
							placeholder="8文字以上"
						/>
					</div>

					<div className="form-group">
						<label htmlFor="confirmPassword" className="form-label">
							パスワード（確認）
						</label>
						<input
							type="password"
							id="confirmPassword"
							className="form-input"
							value={formData.confirmPassword}
							onChange={(e) => {
								setFormData({
									...formData,
									confirmPassword: e.target.value,
								});
							}}
							placeholder="パスワードを再入力"
						/>
					</div>

					<div className="form-group">
						<label className="form-label">性別</label>
						<div className="radio-group">
							<label className="radio-label">
								<input
									type="radio"
									name="sex"
									checked={formData.sex === 1}
									onChange={() => {
										setFormData({ ...formData, sex: 1 });
									}}
								/>
								<span>男性</span>
							</label>
							<label className="radio-label">
								<input
									type="radio"
									name="sex"
									checked={formData.sex === 0}
									onChange={() => {
										setFormData({ ...formData, sex: 0 });
									}}
								/>
								<span>女性</span>
							</label>
						</div>
					</div>

					<div className="form-group">
						<label className="form-label">生年月日</label>
						<div className="date-input-group">
							<input
								type="number"
								className="form-input"
								value={formData.year}
								onChange={(e) => {
									setFormData({
										...formData,
										year: e.target.value,
									});
								}}
								placeholder="年"
								min="1900"
								max="2100"
							/>
							<input
								type="number"
								className="form-input"
								value={formData.month}
								onChange={(e) => {
									setFormData({
										...formData,
										month: e.target.value,
									});
								}}
								placeholder="月"
								min="1"
								max="12"
							/>
							<input
								type="number"
								className="form-input"
								value={formData.day}
								onChange={(e) => {
									setFormData({
										...formData,
										day: e.target.value,
									});
								}}
								placeholder="日"
								min="1"
								max="31"
							/>
						</div>
					</div>

					<div className="form-group">
						<label className="form-label">住所</label>
						<input
							type="text"
							className="form-input"
							value={formData.postalCode}
							onChange={(e) => {
								setFormData({
									...formData,
									postalCode: e.target.value,
								});
							}}
							placeholder="郵便番号"
						/>
						<input
							type="text"
							className="form-input"
							value={formData.prefecture}
							onChange={(e) => {
								setFormData({
									...formData,
									prefecture: e.target.value,
								});
							}}
							placeholder="都道府県"
						/>
						<input
							type="text"
							className="form-input"
							value={formData.city}
							onChange={(e) => {
								setFormData({
									...formData,
									city: e.target.value,
								});
							}}
							placeholder="市区町村"
						/>
						<input
							type="text"
							className="form-input"
							value={formData.address}
							onChange={(e) => {
								setFormData({
									...formData,
									address: e.target.value,
								});
							}}
							placeholder="番地・建物名"
						/>
					</div>

					<div className="form-group">
						<label className="form-label">
							<input
								type="checkbox"
								checked={formData.isDriver === 1}
								onChange={(e) => {
									setFormData({
										...formData,
										isDriver: e.target.checked ? 1 : 0,
									});
								}}
							/>
							<span>運転者としても登録する</span>
						</label>
					</div>

					{formData.isDriver === 1 && (
						<div className="form-group">
							<label htmlFor="identification" className="form-label">
								運転免許証
							</label>
							<input
								type="file"
								id="identification"
								accept="image/*"
								onChange={handleFileUpload}
							/>
						</div>
					)}

					{error && <div className="error-message">{error}</div>}

					<button
						type="button"
						className="btn btn-primary btn-block"
						onClick={handleRegister}
						disabled={loading}
					>
						{loading ? '登録中...' : '登録する'}
					</button>

					<button
						type="button"
						className="btn btn-secondary btn-block"
						onClick={handleBack}
					>
						戻る
					</button>
				</div>
			</div>
		</div>
	);
}

export default RegistPage;

// % End

