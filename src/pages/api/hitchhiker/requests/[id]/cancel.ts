// % Start(Assistant)
// リクエストキャンセルAPIのモック
// % End

import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') {
		const { id } = req.query;

		// モックではキャンセル成功を返す
		res.status(200).json({
			success: true,
			message: `Request ${id} cancelled successfully`,
		});
	} else {
		res.setHeader('Allow', ['POST']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}

