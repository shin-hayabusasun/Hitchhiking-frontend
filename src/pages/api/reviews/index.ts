// % Start(AI Assistant)
// モックAPI: レビュー投稿

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	const { driveId, rating, comment } = req.body;

	if (!driveId || !rating) {
		return res.status(400).json({
			message: 'driveIdとratingが必要です',
		});
	}

	// モック処理: 実際にはデータベースにレビューを保存
	return res.status(200).json({
		message: 'レビューを投稿しました',
		reviewId: `review-${Date.now()}`,
	});
}

// % End

