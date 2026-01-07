// % Start(AI Assistant)
// モックAPI: ポイント残高取得

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	// モックデータ
	return res.status(200).json({
		totalBalance: 15000,
		sales: 5000,
	});
}

// % End

