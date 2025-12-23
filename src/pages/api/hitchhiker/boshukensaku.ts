// % Start(AI Assistant)
// モックAPI: 募集検索

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	// モックデータ
	const mockDrives = [
		{
			id: '1',
			driverName: '山田太郎',
			departure: '東京駅',
			destination: '横浜駅',
			departureTime: new Date(Date.now() + 86400000).toISOString(),
			fee: 1000,
			capacity: 4,
			currentPassengers: 2,
			matchingScore: 85,
		},
		{
			id: '2',
			driverName: '佐藤花子',
			departure: '新宿駅',
			destination: '渋谷駅',
			departureTime: new Date(Date.now() + 172800000).toISOString(),
			fee: 500,
			capacity: 3,
			currentPassengers: 1,
			matchingScore: 92,
		},
		{
			id: '3',
			driverName: '鈴木一郎',
			departure: '品川駅',
			destination: '川崎駅',
			departureTime: new Date(Date.now() + 259200000).toISOString(),
			fee: 800,
			capacity: 4,
			currentPassengers: 0,
			matchingScore: 78,
		},
	];

	return res.status(200).json({
		card: mockDrives,
	});
}

// % End

