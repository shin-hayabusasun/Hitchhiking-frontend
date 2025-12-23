// % Start(Assistant)
// 通知既読APIのモック
// % End

import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') {
		const { id } = req.query;

		// モックでは既読成功を返す
		res.status(200).json({
			success: true,
			message: `Notification ${id} marked as read`,
		});
	} else {
		res.setHeader('Allow', ['POST']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}

