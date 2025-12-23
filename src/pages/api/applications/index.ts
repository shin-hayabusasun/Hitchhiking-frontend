// % Start(Assistant)
// 申請作成APIのモック
// API仕様: POST /api/applications
// 同乗者がドライブに申請する、または運転者が同乗者募集に応答する
// % End

import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') {
		const { targetid, type } = req.body;

		// バリデーション
		if (!targetid) {
			res.status(400).json({
				success: false,
				error: 'targetid is required',
			});
			return;
		}

		// 申請作成成功をモック
		res.status(200).json({
			success: true,
			message: `Application created successfully for ${type || 'drive'} ID: ${targetid}`,
			data: {
				applicationId: `app_${Date.now()}`,
				targetId: targetid,
				status: 'pending',
				createdAt: new Date().toISOString(),
			},
		});
	} else {
		res.setHeader('Allow', ['POST']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
