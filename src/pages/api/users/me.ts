// % Start(AI Assistant)
// モックAPI: ユーザー情報取得

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	// Cookieからセッション情報を確認
	const cookies = req.headers.cookie || '';
	const hasSession = cookies.includes('session=mock-session-');

	if (!hasSession) {
		return res.status(401).json({
			message: '認証が必要です',
		});
	}

	// モックデータ
	return res.status(200).json({
		name: 'テストユーザー',
		email: 'user@test.com',
		isVerified: true,
	});
}

// % End

