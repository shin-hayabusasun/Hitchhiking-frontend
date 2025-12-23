// % Start(AI Assistant)
// モックAPI: ポイント交換注文履歴取得

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	// モックデータ
	const mockOrders = [
		{
			id: 'order-1',
			productName: 'Amazonギフト券 1,000円分',
			points: 1000,
			status: 'delivered',
			orderDate: '2025-12-20',
		},
		{
			id: 'order-2',
			productName: 'コンビニコーヒー無料券',
			points: 150,
			status: 'shipped',
			orderDate: '2025-12-18',
		},
		{
			id: 'order-3',
			productName: 'スターバックスカード 500円分',
			points: 500,
			status: 'pending',
			orderDate: '2025-12-22',
		},
	];

	return res.status(200).json({
		orders: mockOrders,
	});
}

// % End

