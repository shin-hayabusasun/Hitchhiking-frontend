// % Start(Assistant)
// 同乗者リクエスト詳細取得APIのモック（運転者視点）
// % End

import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		const { id } = req.query;

		// モックリクエスト詳細データ
		const mockRequestDetail = {
			request: {
				id: id,
				origin: '渋谷駅',
				destination: '横浜駅',
				date: '2024-01-25',
				time: '15:00',
				budget: 2000,
				passengerCount: 2,
				message: '荷物が少しあります。よろしくお願いします。',
				status: 'active',
				createdAt: '2024-01-10',
			},
			passenger: {
				id: 'pass1',
				name: '山田太郎',
				age: 28,
				gender: '男性',
				rating: 4.8,
				reviewCount: 45,
				verificationStatus: 'verified',
				profileImage: '/images/default-avatar.png',
				bio: '通勤でよく利用しています。よろしくお願いします。',
			},
			matchingScore: 85,
		};

		res.status(200).json({ success: true, data: mockRequestDetail });
	} else {
		res.setHeader('Allow', ['GET']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
