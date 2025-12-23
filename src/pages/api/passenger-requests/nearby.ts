// % Start(AI Assistant)
// モックAPI: 近くの同乗者募集検索

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	// モックデータ
	const mockRequests = [
		{
			id: 'req-1',
			passengerName: '田中太郎',
			departure: '東京駅',
			destination: '横浜駅',
			date: '2025-12-25',
			time: '10:00',
			budget: 1500,
			distance: 2.5,
		},
		{
			id: 'req-2',
			passengerName: '佐藤花子',
			departure: '新宿駅',
			destination: '渋谷駅',
			date: '2025-12-26',
			time: '14:00',
			budget: 800,
			distance: 5.3,
		},
	];

	return res.status(200).json({
		requests: mockRequests,
	});
}

// % End

