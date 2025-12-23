// % Start(AI Assistant)
// モックAPI: マイドライブ一覧取得

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	// モックデータ
	const mockDrives = [
		{
			id: '1',
			departure: '東京駅',
			destination: '大阪駅',
			departureTime: new Date(Date.now() + 86400000).toISOString(),
			fee: 3000,
			capacity: 4,
			currentPassengers: 2,
			status: 'recruiting',
		},
		{
			id: '2',
			departure: '名古屋駅',
			destination: '京都駅',
			departureTime: new Date(Date.now() + 172800000).toISOString(),
			fee: 2000,
			capacity: 3,
			currentPassengers: 3,
			status: 'matched',
		},
	];

	return res.status(200).json({
		drives: mockDrives,
	});
}

// % End

