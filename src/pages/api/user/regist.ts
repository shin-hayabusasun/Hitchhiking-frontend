// % Start(AI Assistant)
// モックAPI: ユーザー登録

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	const { mail, password, name } = req.body;

	// バリデーション
	if (!mail || !password || !name) {
		return res.status(400).json({
			ok: false,
			message: '必須項目が入力されていません',
		});
	}

	// メールアドレスの重複チェック（モック）
	const existingEmails = ['existing@test.com'];
	if (existingEmails.includes(mail)) {
		return res.status(409).json({
			ok: false,
			message: 'このメールアドレスは既に登録されています',
		});
	}

	// 登録成功（モック）
	console.log('新規登録:', { mail, name });

	return res.status(200).json({
		ok: true,
		message: '登録が完了しました',
	});
}

// % End

