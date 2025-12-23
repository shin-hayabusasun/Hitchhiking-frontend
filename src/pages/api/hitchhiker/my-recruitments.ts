// % Start(Assistant)
// マイ募集一覧取得APIのモック
// % End

import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		const mockRecruitments = [
			{
				id: 'rec1',
				origin: '渋谷',
				destination: '横浜',
				date: '2024-01-25',
				time: '15:00',
				status: 'active',
				applicantsCount: 3,
				fee: 2000,
			},
			{
				id: 'rec2',
				origin: '新宿',
				destination: '千葉',
				date: '2024-01-28',
				time: '10:00',
				status: 'active',
				applicantsCount: 0,
				fee: 1500,
			},
			{
				id: 'rec3',
				origin: '池袋',
				destination: '埼玉',
				date: '2024-01-30',
				time: '12:00',
				status: 'matched',
				applicantsCount: 1,
				fee: 1800,
			},
			{
				id: 'rec4',
				origin: '品川',
				destination: '川崎',
				date: '2023-12-20',
				time: '09:00',
				status: 'completed',
				applicantsCount: 2,
				fee: 1000,
			},
		];

		res.status(200).json({ success: true, data: mockRecruitments });
	} else {
		res.setHeader('Allow', ['GET']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}

