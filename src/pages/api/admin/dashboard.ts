// % Start(Assistant)
// 管理者ダッシュボード統計情報取得APIのモック
// % End

import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		// モックダッシュボード統計データ
		const mockStats = {
			totalUsers: 1523,
			totalOrders: 342,
			totalProducts: 87,
			issuedPoints: 45680,
			activeDrivers: 245,
			activeDrives: 89,
			pendingRequests: 23,
			completedDrives: 567,
		};

		res.status(200).json({ success: true, data: mockStats });
	} else {
		res.setHeader('Allow', ['GET']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}

