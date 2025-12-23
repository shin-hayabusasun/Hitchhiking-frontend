// % Start(AI Assistant)
// プロフィール設定画面

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader';

export function ProfileSettingsPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		lastName: '',
		firstName: '',
		birthDate: '',
		email: '',
		phone: '',
		address: '',
		password: '',
		confirmPassword: '',
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		async function fetchProfile() {
			try {
				const response = await fetch('/api/users/me', {
					method: 'GET',
					credentials: 'include',
				});
				const data = await response.json();
				if (response.ok) {
					setFormData({
						lastName: data.lastName || '',
						firstName: data.firstName || '',
						birthDate: data.birthDate || '',
						email: data.email || '',
						phone: data.phone || '',
						address: data.address || '',
						password: '',
						confirmPassword: '',
					});
				}
			} catch (err) {
				setError('プロフィール情報の取得に失敗しました');
			} finally {
				setLoading(false);
			}
		}
		fetchProfile();
	}, []);

	async function handleSave() {
		setError('');

		if (formData.password && formData.password !== formData.confirmPassword) {
			setError('パスワードが一致しません');
			return;
		}

		try {
			const response = await fetch('/api/users/me/profile', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(formData),
			});

			const data = await response.json();
			if (response.ok && data.success) {
				alert('プロフィールを更新しました');
				router.push('/settings');
			} else {
				setError('更新に失敗しました');
			}
		} catch (err) {
			setError('更新に失敗しました');
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100">
				<TitleHeader title="プロフィール設定" backPath="/settings" />
				<main className="p-8 text-center">
					<p>読み込み中...</p>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<TitleHeader title="プロフィール設定" backPath="/settings" />
			<main className="p-8">
				<div className="bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-2xl font-bold mb-6">プロフィール情報</h2>

					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-gray-700 text-sm font-bold mb-2">
									姓
								</label>
								<input
									type="text"
									className="shadow border rounded w-full py-2 px-3"
									value={formData.lastName}
									onChange={(e) =>
										setFormData({ ...formData, lastName: e.target.value })
									}
								/>
							</div>
							<div>
								<label className="block text-gray-700 text-sm font-bold mb-2">
									名
								</label>
								<input
									type="text"
									className="shadow border rounded w-full py-2 px-3"
									value={formData.firstName}
									onChange={(e) =>
										setFormData({ ...formData, firstName: e.target.value })
									}
								/>
							</div>
						</div>

						<div>
							<label className="block text-gray-700 text-sm font-bold mb-2">
								生年月日
							</label>
							<input
								type="date"
								className="shadow border rounded w-full py-2 px-3"
								value={formData.birthDate}
								onChange={(e) =>
									setFormData({ ...formData, birthDate: e.target.value })
								}
							/>
						</div>

						<div>
							<label className="block text-gray-700 text-sm font-bold mb-2">
								メールアドレス
							</label>
							<input
								type="email"
								className="shadow border rounded w-full py-2 px-3"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
							/>
						</div>

						<div>
							<label className="block text-gray-700 text-sm font-bold mb-2">
								電話番号
							</label>
							<input
								type="tel"
								className="shadow border rounded w-full py-2 px-3"
								value={formData.phone}
								onChange={(e) =>
									setFormData({ ...formData, phone: e.target.value })
								}
							/>
						</div>

						<div>
							<label className="block text-gray-700 text-sm font-bold mb-2">
								住所
							</label>
							<input
								type="text"
								className="shadow border rounded w-full py-2 px-3"
								value={formData.address}
								onChange={(e) =>
									setFormData({ ...formData, address: e.target.value })
								}
							/>
						</div>

						<hr className="my-6" />

						<h3 className="text-lg font-bold mb-4">パスワード変更（任意）</h3>

						<div>
							<label className="block text-gray-700 text-sm font-bold mb-2">
								新しいパスワード
							</label>
							<input
								type="password"
								className="shadow border rounded w-full py-2 px-3"
								value={formData.password}
								onChange={(e) =>
									setFormData({ ...formData, password: e.target.value })
								}
								placeholder="変更する場合のみ入力"
							/>
						</div>

						<div>
							<label className="block text-gray-700 text-sm font-bold mb-2">
								パスワード（確認）
							</label>
							<input
								type="password"
								className="shadow border rounded w-full py-2 px-3"
								value={formData.confirmPassword}
								onChange={(e) =>
									setFormData({ ...formData, confirmPassword: e.target.value })
								}
								placeholder="確認のため再入力"
							/>
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

export default ProfileSettingsPage;

// % End

