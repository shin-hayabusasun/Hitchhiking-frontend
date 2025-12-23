// % Start(AI Assistant)
// モックAPI: ユーザーログイン

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	const { mail, password, isuser } = req.body;

	// モック認証ロジック
	// テスト用のアカウント
	const mockUsers = [
		{ email: 'user@test.com', password: 'password123', isuser: 1 },
		{ email: 'admin@test.com', password: 'admin123', isuser: 0 },
	];

	const user = mockUsers.find(
		(u) => u.email === mail && u.password === password && u.isuser === isuser
	);

	if (user) {
		// セッション情報をCookieに設定（モック）
		res.setHeader(
			'Set-Cookie',
			`session=mock-session-${Date.now()}; Path=/; HttpOnly`
		);

		return res.status(200).json({
			ok: true,
			isuser: user.isuser,
		});
	}

	return res.status(401).json({
		ok: false,
		message: 'ログインに失敗しました',
	});
}

// % End

