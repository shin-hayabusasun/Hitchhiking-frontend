// % Start(AI Assistant)
// 決済情報画面（クレカ登録・確認・削除）

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader';

interface Card {
	id: string;
	last4: string;
	brand: string;
	expMonth: number;
	expYear: number;
}

export function PaymentSettingsPage() {
	const router = useRouter();
	const [cards, setCards] = useState<Card[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [showAddForm, setShowAddForm] = useState(false);
	const [newCard, setNewCard] = useState({
		cardNumber: '',
		name: '',
		expMonth: '',
		expYear: '',
		cvv: '',
	});

	useEffect(() => {
		fetchCards();
	}, []);

	async function fetchCards() {
		try {
			const response = await fetch('/api/payment/cards', {
				method: 'GET',
				credentials: 'include',
			});
			const data = await response.json();
			if (response.ok && data.cards) {
				setCards(data.cards);
			}
		} catch (err) {
			setError('カード情報の取得に失敗しました');
		} finally {
			setLoading(false);
		}
	}

	async function handleAddCard() {
		setError('');

		if (
			!newCard.cardNumber ||
			!newCard.name ||
			!newCard.expMonth ||
			!newCard.expYear ||
			!newCard.cvv
		) {
			setError('全ての項目を入力してください');
			return;
		}

		try {
			const response = await fetch('/api/payment/cards', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(newCard),
			});

			const data = await response.json();
			if (response.ok && data.cardId) {
				alert('カードを追加しました');
				setShowAddForm(false);
				setNewCard({
					cardNumber: '',
					name: '',
					expMonth: '',
					expYear: '',
					cvv: '',
				});
				fetchCards();
			} else {
				setError('カードの追加に失敗しました');
			}
		} catch (err) {
			setError('カードの追加に失敗しました');
		}
	}

	async function handleDeleteCard(cardId: string) {
		if (!confirm('このカードを削除してもよろしいですか？')) {
			return;
		}

		try {
			const response = await fetch(`/api/payment/cards/${cardId}`, {
				method: 'DELETE',
				credentials: 'include',
			});

			if (response.ok) {
				alert('カードを削除しました');
				fetchCards();
			} else {
				alert('カードの削除に失敗しました');
			}
		} catch (err) {
			alert('カードの削除に失敗しました');
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100">
				<TitleHeader title="決済情報" backPath="/settings" />
				<main className="p-8 text-center">
					<p>読み込み中...</p>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<TitleHeader title="決済情報" backPath="/settings" />
			<main className="p-8">
				<div className="bg-white p-6 rounded-lg shadow-md">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-2xl font-bold">登録済みカード</h2>
						<button
							onClick={() => setShowAddForm(!showAddForm)}
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						>
							{showAddForm ? 'キャンセル' : 'カード追加'}
						</button>
					</div>

					{showAddForm && (
						<div className="mb-6 p-4 border rounded-lg bg-gray-50">
							<h3 className="font-bold mb-4">新しいカードを追加</h3>
							<div className="space-y-4">
								<div>
									<label className="block text-gray-700 text-sm font-bold mb-2">
										カード番号
									</label>
									<input
										type="text"
										className="shadow border rounded w-full py-2 px-3"
										value={newCard.cardNumber}
										onChange={(e) =>
											setNewCard({ ...newCard, cardNumber: e.target.value })
										}
										placeholder="1234 5678 9012 3456"
										maxLength={19}
									/>
								</div>
								<div>
									<label className="block text-gray-700 text-sm font-bold mb-2">
										カード名義人
									</label>
									<input
										type="text"
										className="shadow border rounded w-full py-2 px-3"
										value={newCard.name}
										onChange={(e) =>
											setNewCard({ ...newCard, name: e.target.value })
										}
										placeholder="TARO YAMADA"
									/>
								</div>
								<div className="grid grid-cols-3 gap-4">
									<div>
										<label className="block text-gray-700 text-sm font-bold mb-2">
											有効期限（月）
										</label>
										<input
											type="text"
											className="shadow border rounded w-full py-2 px-3"
											value={newCard.expMonth}
											onChange={(e) =>
												setNewCard({ ...newCard, expMonth: e.target.value })
											}
											placeholder="MM"
											maxLength={2}
										/>
									</div>
									<div>
										<label className="block text-gray-700 text-sm font-bold mb-2">
											有効期限（年）
										</label>
										<input
											type="text"
											className="shadow border rounded w-full py-2 px-3"
											value={newCard.expYear}
											onChange={(e) =>
												setNewCard({ ...newCard, expYear: e.target.value })
											}
											placeholder="YY"
											maxLength={2}
										/>
									</div>
									<div>
										<label className="block text-gray-700 text-sm font-bold mb-2">
											CVV
										</label>
										<input
											type="text"
											className="shadow border rounded w-full py-2 px-3"
											value={newCard.cvv}
											onChange={(e) =>
												setNewCard({ ...newCard, cvv: e.target.value })
											}
											placeholder="123"
											maxLength={4}
										/>
									</div>
								</div>
								<button
									onClick={handleAddCard}
									className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
								>
									カードを追加
								</button>
							</div>
						</div>
					)}

					{error && <p className="text-red-500 text-sm mb-4">{error}</p>}

					{cards.length === 0 ? (
						<p className="text-center text-gray-600 py-8">
							登録されているカードはありません
						</p>
					) : (
						<div className="space-y-4">
							{cards.map((card) => (
								<div
									key={card.id}
									className="border rounded-lg p-4 flex justify-between items-center"
								>
									<div>
										<p className="font-semibold text-lg">
											{card.brand} **** {card.last4}
										</p>
										<p className="text-sm text-gray-600">
											有効期限: {card.expMonth}/{card.expYear}
										</p>
									</div>
									<button
										onClick={() => handleDeleteCard(card.id)}
										className="text-red-500 hover:text-red-700 font-bold"
									>
										削除
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			</main>
		</div>
	);
}

export default PaymentSettingsPage;

// % End

