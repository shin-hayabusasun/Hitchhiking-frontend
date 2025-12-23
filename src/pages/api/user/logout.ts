// % Start(AI Assistant)
// モックAPI: ログアウト

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	// Cookieをクリア
	res.setHeader(
		'Set-Cookie',
		'session=; Path=/; HttpOnly; Max-Age=0'
	);

	return res.status(200).json({
		ok: true,
		message: 'ログアウトしました',
	});
}

// % End

