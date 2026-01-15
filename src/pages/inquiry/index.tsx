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
			await fetch('http://127.0.0.1:8000/api/inquiry', {
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
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">
            
                <div className="bg-white/50 backdrop-blur-sm z-10 relative">
                    <TitleHeader title="問い合わせフォーム" backPath="/admin/dashboard" />
                </div>


                <div className="p-4 max-w-md mx-auto space-y-6">

                    {/* お問い合わせフォームカード */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm">
                        <div className="space-y-5">
                            
                            {/* ② 問い合わせ種類 */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-1.5">
                                    お問い合わせ種類<span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        id="category"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-gray-100 text-gray-900 rounded-xl p-4 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow font-medium cursor-pointer"
                                    >
                                        <option value="" className="text-gray-400">選択してください</option>
                                        <option value="service">サービスについて</option>
                                        <option value="account">アカウントについて</option>
                                        <option value="payment">決済について</option>
                                        <option value="drive">ドライブについて</option>
                                        <option value="other">その他</option>
                                    </select>
                                    {/* セレクトボックスの矢印アイコン */}
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* ③ メールアドレス */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1.5">
                                    メールアドレス<span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="example@email.com"
                                    className="w-full bg-gray-100 text-gray-900 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow font-medium placeholder-gray-400"
                                />
                            </div>

                            {/* ④ 件名 */}
                            <div>
                                <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-1.5">
                                    件名<span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    placeholder="お問い合わせの件名を入力"
                                    className="w-full bg-gray-100 text-gray-900 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow font-medium placeholder-gray-400"
                                />
                            </div>

                            {/* ⑤ お問い合わせ内容 */}
                            <div>
                                <label htmlFor="body" className="block text-sm font-bold text-gray-700 mb-1.5">
                                    お問い合わせ内容<span className="text-red-500 ml-1">*</span>
                                </label>
                                <textarea
                                    id="body"
                                    value={formData.body}
                                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                                    rows={6}
                                    placeholder="詳細をご記入ください"
                                    className="w-full bg-gray-100 text-gray-900 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow font-medium placeholder-gray-400 resize-none"
                                ></textarea>
                            </div>

                            {/* エラーメッセージ表示エリア */}
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-pulse">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="12"></line>
                                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                    </svg>
                                    {error}
                                </div>
                            )}

                            {/* ⑥ 送信ボタン */}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-full shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {/* 送信アイコン */}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                                {loading ? '送信中...' : '送信する'}
                            </button>
                            
                            <p className="text-xs text-center text-gray-400 leading-relaxed mt-2">
                                お問い合わせ内容は、3営業日以内にご登録のメールアドレス宛に回答いたします。
                            </p>
                        </div>
                    </div>

                    {/* よくある質問セクション */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm">
                        <h2 className="font-bold text-gray-800 mb-4 text-lg">よくある質問</h2>
                        <div className="space-y-6">
                            <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                <h3 className="font-bold text-gray-800 text-sm mb-2 flex gap-2">
                                    <span className="text-blue-600">Q.</span>
                                    登録方法を教えてください
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed pl-6">
                                    <span className="font-bold text-gray-400 mr-1">A.</span>
                                    ログイン画面から「新規登録」ボタンを押して必要事項を入力してください。
                                </p>
                            </div>
                            
                            <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                <h3 className="font-bold text-gray-800 text-sm mb-2 flex gap-2">
                                    <span className="text-blue-600">Q.</span>
                                    ポイントの有効期限はありますか？
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed pl-6">
                                    <span className="font-bold text-gray-400 mr-1">A.</span>
                                    ポイントの有効期限は獲得から1年間です。
                                </p>
                            </div>

                            <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                <h3 className="font-bold text-gray-800 text-sm mb-2 flex gap-2">
                                    <span className="text-blue-600">Q.</span>
                                    キャンセル方法を教えてください
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed pl-6">
                                    <span className="font-bold text-gray-400 mr-1">A.</span>
                                    マイドライブまたはマイリクエストからキャンセルできます。
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
export default InquiryPage;

// % End

