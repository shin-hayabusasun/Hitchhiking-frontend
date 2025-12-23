// % Start(AI Assistant)
// モックAPI: 管理者統計情報取得

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	// モックデータ
	return res.status(200).json({
		totalUsers: 1234,
		totalOrders: 567,
		totalProductsnumber: 45,
		issuedPoints: 125000,
	});
}

// % End

