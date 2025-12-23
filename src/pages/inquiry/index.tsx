// % Start(五藤暖葵)
// 問い合わせ画面: 運営への問い合わせフォームおよびFAQを表示する画面

import { useState } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader';

export function InquiryPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		category: '',
		email: '',
		subject: '',
		body: '',
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	function validateForm() {
		if (!formData.category) {
			setError('問い合わせ種類を選択してください');
			return false;
		}
		if (!formData.email) {
			setError('メールアドレスを入力してください');
			return false;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			setError('正しいメールアドレス形式で入力してください');
			return false;
		}
		if (!formData.subject) {
			setError('件名を入力してください');
			return false;
		}
		if (!formData.body) {
			setError('本文を入力してください');
			return false;
		}
		return true;
	}

	async function handleSubmit() {
		setError('');

		if (!validateForm()) {
			return;
		}

		setLoading(true);

		try {
			await fetch('/api/inquiry', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(formData),
			});
			alert('お問い合わせを送信しました');
			router.push('/');
		} catch (err) {
			setError('送信に失敗しました。もう一度お試しください。');
		} finally {
			setLoading(false);
		}
	}

	function handleBack() {
		router.push('/');
	}

	return (
		<div className="inquiry-page">
			<TitleHeader title="お問い合わせ" onBack={handleBack} />

			<div className="inquiry-container">
				<div className="form-group">
					<label htmlFor="category" className="form-label">
						問い合わせ種類
					</label>
					<select
						id="category"
						className="form-select"
						value={formData.category}
						onChange={(e) => {
							setFormData({
								...formData,
								category: e.target.value,
							});
						}}
					>
						<option value="">選択してください</option>
						<option value="service">サービスについて</option>
						<option value="account">アカウントについて</option>
						<option value="payment">決済について</option>
						<option value="drive">ドライブについて</option>
						<option value="other">その他</option>
					</select>
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
					<label htmlFor="subject" className="form-label">
						件名
					</label>
					<input
						type="text"
						id="subject"
						className="form-input"
						value={formData.subject}
						onChange={(e) => {
							setFormData({
								...formData,
								subject: e.target.value,
							});
						}}
						placeholder="お問い合わせの件名"
					/>
				</div>

				<div className="form-group">
					<label htmlFor="body" className="form-label">
						本文
					</label>
					<textarea
						id="body"
						className="form-textarea"
						value={formData.body}
						onChange={(e) => {
							setFormData({
								...formData,
								body: e.target.value,
							});
						}}
						rows={8}
						placeholder="お問い合わせ内容を詳しくご記入ください"
					></textarea>
				</div>

				{error && <div className="error-message">{error}</div>}

				<button
					type="button"
					className="btn btn-primary btn-block"
					onClick={handleSubmit}
					disabled={loading}
				>
					{loading ? '送信中...' : '送信する'}
				</button>

				<div className="faq-section">
					<h2>よくある質問</h2>
					<div className="faq-list">
						<div className="faq-item">
							<h3>Q. 登録方法を教えてください</h3>
							<p>
								A.
								ログイン画面から「新規登録」ボタンを押して必要事項を入力してください。
							</p>
						</div>
						<div className="faq-item">
							<h3>Q. ポイントの有効期限はありますか？</h3>
							<p>A. ポイントの有効期限は獲得から1年間です。</p>
						</div>
						<div className="faq-item">
							<h3>Q. キャンセル方法を教えてください</h3>
							<p>
								A.
								マイドライブまたはマイリクエストからキャンセルできます。
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default InquiryPage;

// % End

