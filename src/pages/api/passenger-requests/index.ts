// % Start(AI Assistant)
// モックAPI: 同乗者募集検索（条件指定）

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	// モックデータ
	const mockRequests = [
		{
			id: 'req-1',
			passengerName: '山田次郎',
			departure: '大阪駅',
			destination: '京都駅',
			date: '2025-12-28',
			time: '09:00',
			budget: 2000,
			matchingScore: 85,
		},
		{
			id: 'req-2',
			passengerName: '鈴木一郎',
			departure: '名古屋駅',
			destination: '岐阜駅',
			date: '2025-12-29',
			time: '15:30',
			budget: 1500,
			matchingScore: 78,
		},
		{
			id: 'req-3',
			passengerName: '伊藤美咲',
			departure: '福岡駅',
			destination: '熊本駅',
			date: '2025-12-30',
			time: '11:00',
			budget: 3000,
			matchingScore: 92,
		},
	];

	return res.status(200).json({
		requests: mockRequests,
	});
}

// % End

