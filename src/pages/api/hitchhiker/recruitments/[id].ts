// % Start(Assistant)
// 募集削除APIのモック
// % End

import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'DELETE') {
		const { id } = req.query;

		// モックでは削除成功を返す
		res.status(200).json({
			success: true,
			message: `Recruitment ${id} deleted successfully`,
		});
	} else {
		res.setHeader('Allow', ['DELETE']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}

