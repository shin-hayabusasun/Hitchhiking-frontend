// % Start(AI Assistant)
// 本人確認画面（個人情報・セキュリティ設定）

import { useState } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader';

export function IdentitySettingsPage() {
	const router = useRouter();
	const [file, setFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
			setError('');
		}
	}

	async function handleUpload() {
		if (!file) {
			setError('ファイルを選択してください');
			return;
		}

		setUploading(true);
		setError('');
		setSuccess(false);

		try {
			const formData = new FormData();
			formData.append('file', file);

			const response = await fetch('/api/users/me/identity-document', {
				method: 'POST',
				credentials: 'include',
				body: formData,
			});

			const data = await response.json();
			if (response.ok && data.success) {
				setSuccess(true);
				setFile(null);
				alert('本人確認書類をアップロードしました。管理者の確認をお待ちください。');
			} else {
				setError('アップロードに失敗しました');
			}
		} catch (err) {
			setError('アップロードに失敗しました');
		} finally {
			setUploading(false);
		}
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<TitleHeader title="本人確認" backPath="/settings" />
			<main className="p-8">
				<div className="bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-2xl font-bold mb-6">本人確認書類のアップロード</h2>

					<div className="mb-6">
						<p className="text-gray-700 mb-4">
							運転免許証、パスポート、マイナンバーカードなどの本人確認書類をアップロードしてください。
						</p>
						<ul className="list-disc list-inside text-sm text-gray-600 mb-4">
							<li>画像は鮮明に撮影してください</li>
							<li>有効期限内の書類をご使用ください</li>
							<li>個人情報が読み取れる状態で撮影してください</li>
						</ul>
					</div>

					<div className="mb-6">
						<label className="block text-gray-700 text-sm font-bold mb-2">
							書類画像を選択
						</label>
						<input
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							className="shadow border rounded w-full py-2 px-3"
						/>
						{file && (
							<p className="text-sm text-gray-600 mt-2">
								選択ファイル: {file.name}
							</p>
						)}
					</div>

					{error && <p className="text-red-500 text-sm mb-4">{error}</p>}
					{success && (
						<p className="text-green-500 text-sm mb-4">
							アップロードが完了しました
						</p>
					)}

					<div className="flex justify-end space-x-4">
						<button
							onClick={() => router.back()}
							className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded"
							disabled={uploading}
						>
							キャンセル
						</button>
						<button
							onClick={handleUpload}
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
							disabled={uploading || !file}
						>
							{uploading ? 'アップロード中...' : 'アップロード'}
						</button>
					</div>
				</div>
			</main>
		</div>
	);
}

export default IdentitySettingsPage;

// % End

