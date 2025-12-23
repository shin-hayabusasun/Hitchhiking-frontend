// % Start(AI Assistant)
// モックAPI: ポイント履歴取得

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	// モックデータ
	const mockTransactions = [
		{
			id: '1',
			type: 'earned',
			amount: 500,
			description: 'ドライブ完了ボーナス',
			date: '2025-12-20',
		},
		{
			id: '2',
			type: 'earned',
			amount: 1000,
			description: 'ドライブ完了',
			date: '2025-12-18',
		},
		{
			id: '3',
			type: 'spent',
			amount: 2000,
			description: '商品交換',
			date: '2025-12-15',
		},
		{
			id: '4',
			type: 'earned',
			amount: 300,
			description: '新規登録ボーナス',
			date: '2025-12-01',
		},
	];

	return res.status(200).json({
		transactions: mockTransactions,
	});
}

// % End

