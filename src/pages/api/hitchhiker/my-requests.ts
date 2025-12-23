// % Start(Assistant)
// マイリクエスト一覧取得APIのモック
// % End

import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		const { status } = req.query;

		const allRequests = [
			{
				id: 'req1',
				driveId: 'd1',
				driverName: '田中太郎',
				origin: '東京駅',
				destination: '大阪駅',
				date: '2024-01-15',
				time: '10:00',
				status: 'pending',
				fee: 5000,
			},
			{
				id: 'req2',
				driveId: 'd2',
				driverName: '佐藤花子',
				origin: '名古屋駅',
				destination: '福岡駅',
				date: '2024-01-20',
				time: '14:30',
				status: 'approved',
				fee: 8000,
			},
			{
				id: 'req3',
				driveId: 'd3',
				driverName: '鈴木一郎',
				origin: '仙台駅',
				destination: '札幌駅',
				date: '2023-12-10',
				time: '09:00',
				status: 'completed',
				fee: 12000,
			},
			{
				id: 'req4',
				driveId: 'd4',
				driverName: '高橋二郎',
				origin: '京都駅',
				destination: '広島駅',
				date: '2024-01-05',
				time: '11:00',
				status: 'rejected',
				fee: 6000,
			},
		];

		const filteredRequests = status
			? allRequests.filter((req) => req.status === status)
			: allRequests;

		res.status(200).json({ success: true, data: filteredRequests });
	} else {
		res.setHeader('Allow', ['GET']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}

