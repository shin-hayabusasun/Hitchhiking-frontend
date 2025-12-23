// % Start(AI Assistant)
// モックAPI: ポイント交換商品一覧取得

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	// モックデータ
	const mockProducts = [
		{
			id: '1',
			name: 'Amazonギフト券 1,000円分',
			description: 'すぐに使えるAmazonギフト券',
			points: 1000,
			stock: 50,
			image: '/images/amazon-gift.jpg',
		},
		{
			id: '2',
			name: 'コンビニコーヒー無料券',
			description: 'セブン-イレブンで使えるコーヒー券',
			points: 150,
			stock: 100,
		},
		{
			id: '3',
			name: 'スターバックスカード 500円分',
			description: 'スタバで使えるプリペイドカード',
			points: 500,
			stock: 30,
		},
		{
			id: '4',
			name: 'クオカード 3,000円分',
			description: '全国の加盟店で使えるクオカード',
			points: 3000,
			stock: 0,
		},
	];

	return res.status(200).json({
		products: mockProducts,
	});
}

// % End

