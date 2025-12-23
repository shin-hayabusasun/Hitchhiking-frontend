// % Start(AI Assistant)
// モックAPI: ログイン状態確認

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	// Cookieからセッション情報を確認
	const cookies = req.headers.cookie || '';
	const hasSession = cookies.includes('session=mock-session-');

	return res.status(200).json({
		ok: hasSession,
	});
}

// % End

